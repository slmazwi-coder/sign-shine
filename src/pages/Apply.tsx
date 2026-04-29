import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  learner_first_name: z.string().trim().min(1).max(80),
  learner_last_name: z.string().trim().min(1).max(80),
  learner_id_number: z.string().trim().min(6).max(20),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  hearing_status: z.string().optional(),
  previous_school: z.string().max(150).optional(),
  grade_applying_for: z.string().max(20).optional(),
  parent_name: z.string().trim().min(1).max(120),
  parent_phone: z.string().trim().min(6).max(30),
  parent_email: z.string().trim().email().max(150).or(z.literal("")).optional(),
  address: z.string().max(300).optional(),
  notes: z.string().max(1000).optional(),
});

const Field = ({ label, children }: any) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-primary-dark">{label}</span>
    {children}
  </label>
);

const inp = "w-full rounded-md border border-input bg-card px-4 py-2.5 text-base text-foreground outline-none focus:border-primary";

export default function Apply() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as any;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Please check the form");
      setSubmitting(false);
      return;
    }
    const payload: any = { ...parsed.data };
    if (!payload.parent_email) delete payload.parent_email;
    if (!payload.date_of_birth) delete payload.date_of_birth;
    const { error } = await supabase.from("applications").insert(payload);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="px-[5%] pb-20 pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[4px] text-primary">Online Applications</span>
          <h1 className="mb-3 font-display text-4xl text-primary-dark md:text-5xl">Apply to Sive Special School</h1>
          <div className="mb-6 h-1 w-16 rounded bg-gradient-gold" />
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Complete the form below to apply for a place. Our admissions team reviews every application and will contact you to confirm next steps. All fields marked with * are required.
          </p>

          {done ? (
            <div className="rounded-xl border border-primary/20 bg-secondary p-10 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-primary" />
              <h2 className="mb-3 font-display text-3xl text-primary-dark">Application Received</h2>
              <p className="mb-6 text-muted-foreground">
                Thank you. The school admissions office will be in touch using the contact details you provided.
              </p>
              <a href="/" className="inline-block rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-light">Back to Home</a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8 shadow-elegant">
              <h3 className="mb-2 font-display text-xl text-primary-dark">Learner Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name *"><input name="learner_first_name" required className={inp} /></Field>
                <Field label="Last Name *"><input name="learner_last_name" required className={inp} /></Field>
                <Field label="ID Number *"><input name="learner_id_number" required className={inp} /></Field>
                <Field label="Date of Birth"><input type="date" name="date_of_birth" className={inp} /></Field>
                <Field label="Gender">
                  <select name="gender" className={inp} defaultValue="">
                    <option value="">Select...</option>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </Field>
                <Field label="Hearing Status">
                  <select name="hearing_status" className={inp} defaultValue="">
                    <option value="">Select...</option>
                    <option>Deaf</option><option>Hard of Hearing</option><option>Other</option>
                  </select>
                </Field>
                <Field label="Previous School"><input name="previous_school" className={inp} /></Field>
                <Field label="Grade Applying For">
                  <select name="grade_applying_for" className={inp} defaultValue="">
                    <option value="">Select grade...</option>
                    {["R","1","2","3","4","5","6","7","8","9","10","11","12"].map(g=>(<option key={g}>Grade {g}</option>))}
                  </select>
                </Field>
              </div>

              <h3 className="mt-6 mb-2 font-display text-xl text-primary-dark">Parent / Guardian</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *"><input name="parent_name" required className={inp} /></Field>
                <Field label="Phone *"><input name="parent_phone" required className={inp} /></Field>
                <Field label="Email"><input type="email" name="parent_email" className={inp} /></Field>
                <Field label="Home Address"><input name="address" className={inp} /></Field>
              </div>

              <Field label="Additional Notes">
                <textarea name="notes" rows={4} className={inp} placeholder="Anything we should know..." />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full rounded-md bg-accent py-4 text-base font-bold text-primary-dark transition hover:bg-accent-light disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application →"}
              </button>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
