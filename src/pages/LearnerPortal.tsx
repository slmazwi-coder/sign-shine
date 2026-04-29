import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Download, FileText, GraduationCap, LogOut } from "lucide-react";

export default function LearnerPortal() {
  const { user, isLearner, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [learner, setLearner] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/learner-login"); return; }
    if (!isLearner && !isAdmin) {
      toast.error("This portal is for learners only.");
      supabase.auth.signOut().then(() => nav("/learner-login"));
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLearner, loading]);

  async function load() {
    const { data: l } = await supabase.from("learners").select("*").eq("user_id", user!.id).maybeSingle();
    setLearner(l);
    if (l) {
      const { data: r } = await supabase
        .from("learner_reports").select("*").eq("learner_id", l.id)
        .order("year", { ascending: false }).order("uploaded_at", { ascending: false });
      setReports(r ?? []);
    }
  }

  async function download(path: string, filename: string) {
    const { data, error } = await supabase.storage.from("learner-reports").createSignedUrl(path, 60);
    if (error) { toast.error(error.message); return; }
    const a = document.createElement("a");
    a.href = data.signedUrl; a.download = filename; a.click();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary-dark px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3 text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
            <div>
              <strong className="block font-display">Learner Portal</strong>
              <span className="text-xs text-primary-foreground/70">Sive Special School</span>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => nav("/"))}
            className="flex items-center gap-2 rounded bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground hover:bg-primary-foreground/20"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {!learner ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg text-muted-foreground">No learner record found for your account. Please contact the school.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 rounded-xl border border-border bg-card p-8 shadow-md">
              <h1 className="font-display text-3xl text-primary-dark">Welcome, {learner.first_name} {learner.last_name}</h1>
              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                <Info label="Admission No" value={learner.admission_number} />
                <Info label="Grade" value={learner.grade || "—"} />
                <Info label="Guardian" value={learner.guardian_name || "—"} />
              </div>
            </div>

            <h2 className="mb-4 font-display text-2xl text-primary-dark">My Reports & Documents</h2>
            {reports.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {reports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-5 transition hover:border-primary">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <strong className="block text-primary-dark">{r.title}</strong>
                        <span className="text-xs text-muted-foreground">
                          {r.doc_type} · {r.term ? `Term ${r.term} · ` : ""}{r.year ?? ""}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => download(r.storage_path, r.title)}
                      className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-secondary p-4">
    <span className="block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    <strong className="mt-1 block text-primary-dark">{value}</strong>
  </div>
);
