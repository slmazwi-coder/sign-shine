import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const ADMIN_PASSWORD = "sive2026";

export default function AdminLogin() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    if (password === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      sessionStorage.setItem("admin_auth", "true");
      nav("/admin");
    } else {
      toast.error("Invalid password");
      setLoading(false);
    }
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
          <input
            required type="password" value={password} onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter password" className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary"
          />
          <button disabled={loading} className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Please wait..." : "Sign In"}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← Back to website</Link>
      </div>
    </div>
  );
}
