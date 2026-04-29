import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap, Hand } from "lucide-react";

/**
 * Learners log in with admission number + ID number.
 * The admin creates an auth user where:
 *   email    = `${admissionNumber}@learner.sive.local`  (synthetic)
 *   password = ID number
 * That mapping is documented in the admin portal when creating learners.
 */
export default function LearnerLogin() {
  const nav = useNavigate();
  const [admission, setAdmission] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const email = `${admission.trim().toLowerCase()}@learner.sive.local`;
    const { error } = await supabase.auth.signInWithPassword({ email, password: idNumber.trim() });
    setLoading(false);
    if (error) {
      toast.error("Could not sign in. Check your admission number and ID.");
      return;
    }
    nav("/learner");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-primary-foreground/10 bg-card p-8 shadow-elegant">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-primary-dark">Learner Portal</h1>
            <p className="text-xs text-muted-foreground">View your reports & documents</p>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/15 bg-secondary p-4 text-sm text-primary-dark">
          <Hand className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Sign in with your <strong>admission number</strong> and your <strong>ID number</strong> as the password.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-dark">Admission Number</span>
            <input
              required value={admission} onChange={(e) => setAdmission(e.target.value)}
              placeholder="e.g. SIV2026001"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-dark">ID Number</span>
            <input
              required type="password" value={idNumber} onChange={(e) => setIdNumber(e.target.value)}
              placeholder="Your ID number"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
          </label>
          <button disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Back to website</Link>
      </div>
    </div>
  );
}
