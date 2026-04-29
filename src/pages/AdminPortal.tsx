import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LogOut, Inbox, Users, FileText, Pencil, Plus, Trash2, Download, Check, X } from "lucide-react";

const inp = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary";

export default function AdminPortal() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/admin-login"); return; }
    if (!isAdmin) { toast.error("Admin access required."); supabase.auth.signOut().then(()=>nav("/admin-login")); }
  }, [user, isAdmin, loading, nav]);

  if (loading || !isAdmin) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary-dark px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 text-primary-foreground">
            <Shield className="h-6 w-6" />
            <div><strong className="block font-display">Admin Portal</strong><span className="text-xs text-primary-foreground/70">Sive Special School</span></div>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => nav("/"))}
            className="flex items-center gap-2 rounded bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground hover:bg-primary-foreground/20"
          ><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="applications">
          <TabsList className="mb-6 flex h-auto flex-wrap gap-1 bg-secondary p-1">
            <TabsTrigger value="applications" className="gap-2"><Inbox className="h-4 w-4" /> Applications</TabsTrigger>
            <TabsTrigger value="learners" className="gap-2"><Users className="h-4 w-4" /> Learners</TabsTrigger>
            <TabsTrigger value="reports" className="gap-2"><FileText className="h-4 w-4" /> Reports & Docs</TabsTrigger>
            <TabsTrigger value="content" className="gap-2"><Pencil className="h-4 w-4" /> Website Content</TabsTrigger>
          </TabsList>
          <TabsContent value="applications"><ApplicationsTab /></TabsContent>
          <TabsContent value="learners"><LearnersTab /></TabsContent>
          <TabsContent value="reports"><ReportsTab /></TabsContent>
          <TabsContent value="content"><ContentTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ============ APPLICATIONS ============ */
function ApplicationsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  async function load() {
    let q = supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setApps(data ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("applications").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    await supabase.from("applications").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(["pending","approved","rejected","all"] as const).map(f => (
          <button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter===f?"bg-primary text-primary-foreground":"bg-secondary text-primary-dark hover:bg-muted"}`}>{f}</button>
        ))}
      </div>
      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No applications.</div>
      ) : (
        <div className="grid gap-4">
          {apps.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-primary-dark">{a.learner_first_name} {a.learner_last_name}</h3>
                  <p className="text-xs text-muted-foreground">Applied {new Date(a.created_at).toLocaleDateString()} · {a.grade_applying_for ?? "—"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${a.status==="pending"?"bg-accent/20 text-accent-foreground":a.status==="approved"?"bg-primary/15 text-primary":"bg-destructive/15 text-destructive"}`}>{a.status}</span>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div><strong>ID:</strong> {a.learner_id_number}</div>
                <div><strong>DOB:</strong> {a.date_of_birth ?? "—"}</div>
                <div><strong>Hearing:</strong> {a.hearing_status ?? "—"}</div>
                <div><strong>Previous school:</strong> {a.previous_school ?? "—"}</div>
                <div><strong>Parent:</strong> {a.parent_name}</div>
                <div><strong>Phone:</strong> {a.parent_phone}</div>
                <div><strong>Email:</strong> {a.parent_email ?? "—"}</div>
                <div><strong>Address:</strong> {a.address ?? "—"}</div>
              </div>
              {a.notes && <p className="mt-3 rounded bg-secondary p-3 text-sm text-muted-foreground">{a.notes}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {a.status !== "approved" && (
                  <button onClick={()=>setStatus(a.id,"approved")} className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-dark"><Check className="h-3 w-3" /> Approve</button>
                )}
                {a.status !== "rejected" && (
                  <button onClick={()=>setStatus(a.id,"rejected")} className="flex items-center gap-1 rounded bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground hover:opacity-90"><X className="h-3 w-3" /> Reject</button>
                )}
                <button onClick={()=>remove(a.id)} className="flex items-center gap-1 rounded border border-border px-3 py-1.5 text-xs hover:bg-secondary"><Trash2 className="h-3 w-3" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ LEARNERS ============ */
function LearnersTab() {
  const [learners, setLearners] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data } = await supabase.from("learners").select("*").order("created_at", { ascending: false });
    setLearners(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const admission = String(fd.get("admission_number")).trim();
    const idNumber = String(fd.get("id_number")).trim();
    const email = `${admission.toLowerCase()}@learner.sive.local`;

    // 1. Sign up the auth account (uses ID number as password)
    const { data: signUp, error: suErr } = await supabase.auth.signUp({
      email, password: idNumber,
      options: { data: { full_name: `${fd.get("first_name")} ${fd.get("last_name")}` } },
    });
    if (suErr) { toast.error(suErr.message); setBusy(false); return; }
    const newUserId = signUp.user?.id;

    // 2. Insert learner row
    const { error: insErr } = await supabase.from("learners").insert({
      user_id: newUserId,
      admission_number: admission,
      id_number: idNumber,
      first_name: String(fd.get("first_name")),
      last_name: String(fd.get("last_name")),
      grade: String(fd.get("grade") || "") || null,
      date_of_birth: (fd.get("date_of_birth") as string) || null,
      guardian_name: String(fd.get("guardian_name") || "") || null,
      guardian_phone: String(fd.get("guardian_phone") || "") || null,
    });
    if (insErr) { toast.error(insErr.message); setBusy(false); return; }

    // 3. Grant learner role
    if (newUserId) await supabase.from("user_roles").insert({ user_id: newUserId, role: "learner" });

    toast.success(`Learner created. Login: ${admission} / ID number`);
    setBusy(false); setShowForm(false); load();
    (e.target as HTMLFormElement).reset();
  }

  async function remove(id: string) {
    if (!confirm("Delete this learner record?")) return;
    await supabase.from("learners").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{learners.length} learners</p>
        <button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Add Learner
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mb-6 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg text-primary-dark">New Learner</h3>
          <p className="mb-4 rounded bg-secondary p-3 text-xs text-primary-dark">
            The learner will sign in with <strong>admission number</strong> + <strong>ID number</strong>.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Inp name="admission_number" label="Admission Number *" required />
            <Inp name="id_number" label="ID Number *" required />
            <Inp name="first_name" label="First Name *" required />
            <Inp name="last_name" label="Last Name *" required />
            <Inp name="grade" label="Grade" />
            <Inp name="date_of_birth" label="Date of Birth" type="date" />
            <Inp name="guardian_name" label="Guardian Name" />
            <Inp name="guardian_phone" label="Guardian Phone" />
          </div>
          <button disabled={busy} className="mt-5 rounded bg-accent px-6 py-2.5 font-bold text-primary-dark hover:bg-accent-light disabled:opacity-50">
            {busy ? "Creating..." : "Create Learner"}
          </button>
        </form>
      )}

      {learners.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No learners yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-primary-dark">
              <tr><th className="p-3">Admission</th><th className="p-3">Name</th><th className="p-3">Grade</th><th className="p-3">Guardian</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {learners.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{l.admission_number}</td>
                  <td className="p-3">{l.first_name} {l.last_name}</td>
                  <td className="p-3">{l.grade ?? "—"}</td>
                  <td className="p-3">{l.guardian_name ?? "—"}<br /><span className="text-xs text-muted-foreground">{l.guardian_phone ?? ""}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={()=>remove(l.id)} className="text-destructive hover:underline"><Trash2 className="inline h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Inp = ({ label, ...rest }: any) => (
  <label className="block">
    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-primary-dark">{label}</span>
    <input {...rest} className={inp} />
  </label>
);

/* ============ REPORTS ============ */
function ReportsTab() {
  const [learners, setLearners] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [reports, setReports] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("learners").select("id, admission_number, first_name, last_name").order("admission_number")
      .then(({ data }) => setLearners(data ?? []));
  }, []);

  useEffect(() => {
    if (!selected) { setReports([]); return; }
    supabase.from("learner_reports").select("*").eq("learner_id", selected).order("uploaded_at", { ascending: false })
      .then(({ data }) => setReports(data ?? []));
  }, [selected, busy]);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return toast.error("Pick a learner first");
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file") as File;
    if (!file || file.size === 0) return toast.error("Choose a file");
    setBusy(true);
    const path = `${selected}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from("learner-reports").upload(path, file);
    if (upErr) { toast.error(upErr.message); setBusy(false); return; }
    const { error } = await supabase.from("learner_reports").insert({
      learner_id: selected,
      title: String(fd.get("title")) || file.name,
      term: String(fd.get("term") || "") || null,
      year: fd.get("year") ? Number(fd.get("year")) : null,
      doc_type: String(fd.get("doc_type") || "report"),
      storage_path: path,
    });
    if (error) toast.error(error.message); else toast.success("Uploaded");
    setBusy(false);
    (e.target as HTMLFormElement).reset();
  }

  async function remove(r: any) {
    if (!confirm("Delete this document?")) return;
    await supabase.storage.from("learner-reports").remove([r.storage_path]);
    await supabase.from("learner_reports").delete().eq("id", r.id);
    setBusy(b => !b);
  }

  async function download(path: string, filename: string) {
    const { data, error } = await supabase.storage.from("learner-reports").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a"); a.href = data.signedUrl; a.download = filename; a.click();
  }

  return (
    <div>
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary-dark">Select Learner</label>
        <select className={inp} value={selected} onChange={(e)=>setSelected(e.target.value)}>
          <option value="">— Choose a learner —</option>
          {learners.map(l => <option key={l.id} value={l.id}>{l.admission_number} · {l.first_name} {l.last_name}</option>)}
        </select>
      </div>

      {selected && (
        <>
          <form onSubmit={upload} className="mb-6 rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-display text-lg text-primary-dark">Upload Document</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Inp name="title" label="Title *" required placeholder="e.g. Term 3 Report" />
              <Inp name="doc_type" label="Type" placeholder="report, certificate, letter..." defaultValue="report" />
              <Inp name="term" label="Term" placeholder="1, 2, 3, 4" />
              <Inp name="year" label="Year" type="number" placeholder="2026" />
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-primary-dark">File (PDF or document) *</span>
                <input name="file" type="file" required className={inp} />
              </label>
            </div>
            <button disabled={busy} className="mt-4 rounded bg-primary px-6 py-2.5 font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50">
              {busy ? "Uploading..." : "Upload"}
            </button>
          </form>

          <h3 className="mb-3 font-display text-lg text-primary-dark">Documents</h3>
          {reports.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">No documents.</div>
          ) : (
            <div className="grid gap-2">
              {reports.map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <strong className="block text-sm text-primary-dark">{r.title}</strong>
                      <span className="text-xs text-muted-foreground">{r.doc_type} · {r.term && `Term ${r.term} ·`} {r.year ?? ""}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>download(r.storage_path, r.title)} className="flex items-center gap-1 rounded bg-secondary px-3 py-1.5 text-xs hover:bg-muted"><Download className="h-3 w-3" /> Download</button>
                    <button onClick={()=>remove(r)} className="rounded border border-border px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============ CONTENT ============ */
const CONTENT_KEYS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "hero_tag", label: "Hero badge" },
  { key: "hero_title", label: "Hero title" },
  { key: "hero_motto", label: "Hero motto" },
  { key: "hero_desc", label: "Hero description", multiline: true },
  { key: "about_text", label: "About paragraph", multiline: true },
  { key: "contact_address", label: "Physical address" },
  { key: "contact_postal", label: "Postal address" },
  { key: "contact_phone", label: "Phone numbers" },
  { key: "contact_email", label: "Email" },
  { key: "contact_facebook", label: "Facebook" },
  { key: "contact_emis", label: "EMIS number" },
  { key: "hours", label: "School hours" },
];

function ContentTab() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("key,value").then(({ data }) => {
      const v: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { v[r.key] = typeof r.value === "string" ? r.value : r.value?.text ?? ""; });
      setValues(v);
    });
  }, []);

  async function saveAll() {
    setBusy(true);
    const rows = CONTENT_KEYS.filter(k => values[k.key] != null).map(k => ({ key: k.key, value: values[k.key] }));
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    setBusy(false);
    if (error) toast.error(error.message); else toast.success("Website updated");
  }

  return (
    <div>
      <p className="mb-5 text-sm text-muted-foreground">Edit the public website. Leave a field blank to use the default.</p>
      <div className="grid gap-4">
        {CONTENT_KEYS.map(k => (
          <label key={k.key} className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-dark">{k.label}</span>
            {k.multiline ? (
              <textarea rows={4} className={inp} value={values[k.key] ?? ""} onChange={(e)=>setValues({...values,[k.key]:e.target.value})} />
            ) : (
              <input className={inp} value={values[k.key] ?? ""} onChange={(e)=>setValues({...values,[k.key]:e.target.value})} />
            )}
          </label>
        ))}
      </div>
      <button onClick={saveAll} disabled={busy} className="mt-6 rounded bg-accent px-6 py-3 font-bold text-primary-dark hover:bg-accent-light disabled:opacity-50">
        {busy ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
