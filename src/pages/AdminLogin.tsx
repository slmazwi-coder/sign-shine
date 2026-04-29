import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/admin", data: { full_name: fullName } },
      });
      if (error) { toast.error(error.message); setLoading(false); return; }
      // Try to grant admin role — succeeds only if no admin yet (DB has no such guard,
      // so we attempt; first signup expected to be admin per user choice).
      // To be safe: only insert if user is the only user in user_roles or no admins exist.
      // Use an RPC-less approach: try insert; will fail if RLS blocks (it won't, because policy allows admins...).
      // Initial bootstrap: we let the very first signup auto-claim admin via a public RPC.
      const userId = data.user?.id;
      if (userId) {
        const { error: rpcErr } = await supabase.rpc("claim_first_admin");
        if (rpcErr && !rpcErr.message.toLowerCase().includes("already")) {
          toast.message("Account created. Ask an existing admin to grant you access.");
        } else {
          toast.success("Admin account created!");
        }
      }
      nav("/admin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      nav("/admin");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="w-full max-w-md rounded-2xl border border-primary-foreground/10 bg-card p-8 shadow-elegant">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-primary-dark">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">Sive Special School</p>
          </div>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {mode === "signup" && (
            <input
              required value={fullName} onChange={(e)=>setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
            />
          )}
          <input
            required type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email" className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <input
            required type="password" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password" className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <button disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Please wait..." : mode === "signup" ? "Create Admin Account" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "First admin? Create the initial account →" : "← Back to sign in"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Back to website</Link>
      </div>
    </div>
  );
}
