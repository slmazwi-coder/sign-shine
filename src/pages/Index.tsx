import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import campus from "@/assets/sive-campus.jpg";
import matric from "@/assets/sive-matric.jpg";
import award from "@/assets/sive-award.jpg";
import deafWeek from "@/assets/sive-deaf-week.jpg";
import logo from "@/assets/sive-logo.jpg";
import {
  Trophy,
  GraduationCap,
  Globe2,
  Award,
  BookOpen,
  Users,
  Hand,
  Sparkles,
  Microscope,
  Heart,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Building2,
  Calendar,
  ChevronDown,
} from "lucide-react";

type Content = Record<string, any>;

const DEFAULTS: Content = {
  hero_tag: "Cedarville, Eastern Cape · Est. 1996",
  hero_title: "Empowering Deaf Learners to Reach the Sky",
  hero_motto: "Education For All",
  hero_desc:
    "Sive Special School for the Deaf is a public government school dedicated to providing world-class education through South African Sign Language to deaf and hard-of-hearing learners in the Alfred Nzo District and beyond.",
  about_text:
    "Sive Special School For The Deaf was established on 1 January 1996 at Mvenyane Mission, Cedarville, in the Matatiele Local Municipality. The school is a government public institution registered with the Department of Basic Education (EMIS No: 200501449) and caters exclusively to learners who are deaf or hard of hearing. Instruction is delivered through South African Sign Language (SASL), and the school has become one of the Eastern Cape's leading deaf schools — producing provincial top achievers year after year.",
  contact_address: "1342 De Wet Street / Mvenyane Mission, Cedarville, 4720, Eastern Cape",
  contact_postal: "P.O. Box 74, Cedarville, 4720",
  contact_phone: "087 056 2193 · 072 312 9213 · 083 345 5069",
  contact_email: "sivespecialschool@gmail.com",
  contact_facebook: "Sive Special School For The Deaf",
  contact_emis: "200501449",
  hours: "Mon–Fri: 08:00–14:30 · Sat: 08:00–15:00 · Sun: Closed",
};

export default function Index() {
  const [c, setC] = useState<Content>(DEFAULTS);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key,value")
      .then(({ data }) => {
        if (data && data.length) {
          const obj: Content = { ...DEFAULTS };
          data.forEach((r: any) => {
            obj[r.key] =
              typeof r.value === "string" ? r.value : r.value?.text ?? r.value;
          });
          setC(obj);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <header className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-hero">
        <div
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 opacity-60 md:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--accent) / 0.15) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-3xl px-[5%] pb-16 pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded border border-accent/50 bg-accent/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[3px] text-accent-light">
            <Hand className="h-3.5 w-3.5" /> {c.hero_tag}
          </div>
          <h1 className="mb-4 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[1.05] text-primary-foreground">
            {c.hero_title.split(" ").map((w: string, i: number) =>
              w.toLowerCase() === "deaf" ? (
                <span key={i} className="text-accent-light">
                  {w}{" "}
                </span>
              ) : (
                <span key={i}>{w} </span>
              )
            )}
          </h1>
          <p className="mb-8 border-l-[3px] border-accent pl-4 text-xl italic text-primary-foreground/75">
            &quot;{c.hero_motto}&quot;
          </p>
          <p className="mb-10 max-w-xl text-base leading-relaxed text-primary-foreground/65">
            {c.hero_desc}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-primary-dark transition-all hover:-translate-y-0.5 hover:bg-accent-light"
            >
              Apply Online <ChevronDown className="h-4 w-4 -rotate-90" />
            </Link>
            <a
              href="#about"
              className="rounded border-2 border-primary-foreground/40 px-8 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:border-accent-light hover:text-accent-light"
            >
              Discover Our School
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 flex flex-wrap justify-center border-t border-accent/30 bg-black/30 backdrop-blur-md">
          {[
            ["1996", "Year Founded"],
            ["100%", "Matric Pass Rate 2024"],
            ["5+", "Top Province Years"],
            ["15+", "TVET College Enrolments"],
          ].map(([n, l], i) => (
            <div
              key={i}
              className="flex-1 min-w-[140px] border-r border-primary-foreground/10 px-10 py-5 text-center last:border-r-0"
            >
              <div className="font-bebas text-3xl leading-none text-accent-light">
                {n}
              </div>
              <div className="mt-1 text-[0.7rem] uppercase tracking-[1.5px] text-primary-foreground/60">
                {l}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" className="bg-card px-[5%] py-24">
        <div className="mx-auto max-w-7xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[4px] text-primary">
            Who We Are
          </span>
          <h2 className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-primary-dark">
            A School Built on{" "}
            <span className="text-primary-light">Pride, Sign &amp; Purpose</span>
          </h2>
          <div className="mb-10 h-1 w-16 rounded bg-gradient-gold" />
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            For nearly three decades, Sive Special School has stood as a beacon
            of hope for deaf and hard-of-hearing children in the Eastern Cape —
            offering specialised education in a nurturing, fully accessible
            environment.
          </p>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative">
              <img
                src={campus}
                alt="Aerial view of the Sive Special School campus designed by TCN Architects"
                className="w-full rounded-lg shadow-elegant"
              />
              <div className="absolute -bottom-5 -right-5 rounded-md bg-primary px-6 py-5 text-center text-primary-foreground shadow-gold md:-right-5">
                <strong className="block font-bebas text-4xl leading-none text-accent-light">
                  29
                </strong>
                <span className="text-xs uppercase tracking-wider opacity-80">
                  Years of
                  <br />
                  Excellence
                </span>
              </div>
            </div>

            <div className="md:pl-5">
              <p className="mb-5 leading-relaxed text-muted-foreground">
                {c.about_text}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [
                    Users,
                    "Inclusive Education",
                    "Every deaf child deserves equal access to quality education and opportunity.",
                  ],
                  [
                    Trophy,
                    "Academic Excellence",
                    "Holding learners to the highest standard and celebrating every win.",
                  ],
                  [
                    Hand,
                    "Sign Language First",
                    "SASL is our primary language of instruction, identity and community.",
                  ],
                  [
                    Heart,
                    "Community Rooted",
                    "Partnering with families, government and local organisations.",
                  ],
                ].map(([Icon, title, desc]: any, i) => (
                  <div
                    key={i}
                    className="rounded-lg border-l-4 border-primary bg-secondary p-5 transition-transform hover:-translate-y-1"
                  >
                    <Icon className="mb-2 h-6 w-6 text-primary" />
                    <h4 className="mb-1 text-sm font-bold text-primary-dark">
                      {title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section
        id="achievements"
        className="relative overflow-hidden bg-gradient-hero px-[5%] py-24"
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(0 0% 100% / 0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[4px] text-accent-light">
            Our Track Record
          </span>
          <h2 className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-primary-foreground">
            Achievements That Speak for Themselves
          </h2>
          <div
            className="mb-10 h-1 w-16 rounded"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--accent-light)), transparent)",
            }}
          />
          <p className="max-w-2xl text-lg text-primary-foreground/70">
            Sive Special School consistently punches above its weight —
            delivering results that rival any school in the province.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                Award,
                "100%",
                "2024 Matric Pass Rate",
                "A perfect pass rate, with 2 learners invited to the provincial awards ceremony.",
              ],
              [
                Globe2,
                "5+",
                "Provincial Top Achievers",
                "Five consecutive years producing provincial top performers.",
              ],
              [
                Trophy,
                "MSI",
                "National SASL Award",
                "A Sive learner won Top in South African Sign Language at the MSI national competition.",
              ],
              [
                GraduationCap,
                "15",
                "TVET College Enrolments",
                "In 2026, 15 Sive graduates enrolled at Ingwe TVET College via formal partnership.",
              ],
            ].map(([Icon, num, title, desc]: any, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.07] p-7 backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-primary-foreground/[0.12]"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-gold" />
                <Icon className="mb-3 h-8 w-8 text-accent-light" />
                <div className="mb-1 font-bebas text-5xl leading-none text-accent-light">
                  {num}
                </div>
                <h3 className="mb-2 font-display text-lg text-primary-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-primary-foreground/65">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Photos row */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <img
              src={matric}
              alt="Matric Class of 2024 cake-cutting celebration"
              className="h-56 w-full rounded-lg object-cover shadow-elegant"
            />
            <img
              src={award}
              alt="Sive learner with MSI Top in SASL award certificate and trophy"
              className="h-56 w-full rounded-lg object-cover shadow-elegant"
            />
            <img
              src={deafWeek}
              alt="Sive learners holding banner during Deaf Awareness Week march"
              className="h-56 w-full rounded-lg object-cover shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section id="programmes" className="bg-background px-[5%] py-24">
        <div className="mx-auto max-w-7xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[4px] text-primary">
            What We Offer
          </span>
          <h2 className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-primary-dark">
            Our Programmes
          </h2>
          <div className="mb-10 h-1 w-16 rounded bg-gradient-gold" />
          <p className="max-w-2xl text-lg text-muted-foreground">
            A comprehensive curriculum tailored to deaf learners — from
            foundation phase through to matric.
          </p>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                Hand,
                "South African Sign Language",
                "SASL is our language of instruction and a fully recognised subject. Learners are immersed in a signing environment from day one.",
              ],
              [
                BookOpen,
                "Full CAPS Curriculum",
                "We deliver the National Curriculum (CAPS) in all subjects, adapted for deaf learners through visual, sign-based methodologies.",
              ],
              [
                Microscope,
                "Mathematics & Science",
                "Strong emphasis on Maths and Science — producing learners who excel at provincial level and the MSI national competition.",
              ],
              [
                GraduationCap,
                "Matric & Further Studies",
                "We prepare learners for the National Senior Certificate and support transitions to TVET colleges and universities.",
              ],
              [
                Sparkles,
                "Deaf Awareness & Advocacy",
                "Active participation in Deaf Awareness Week, championing accessibility, freedom of expression and access to information.",
              ],
              [
                Users,
                "SASL Teacher Training",
                "A recognised training centre hosting SASL professional development for Deaf education teachers across the Eastern Cape.",
              ],
            ].map(([Icon, title, desc]: any, i) => (
              <div
                key={i}
                className="rounded-xl border-b-4 border-primary bg-card p-7 shadow-md transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary-dark">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-secondary px-[5%] py-20">
        <div className="mx-auto max-w-7xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[4px] text-primary">
            Partners &amp; Supporters
          </span>
          <h2 className="mb-5 font-display text-3xl text-primary-dark">
            Standing With Sive
          </h2>
          <div className="mb-8 h-1 w-16 rounded bg-gradient-gold" />
          <div className="flex flex-wrap gap-3">
            {[
              "Department of Basic Education",
              "Independent Development Trust (IDT)",
              "Ingwe TVET College",
              "Nelson Mandela University",
              "Maths & Science Infinity (MSI)",
              "TCN Architects",
              "Alfred Nzo District Municipality",
              "Local Choice Pharmacy",
              "Bergview",
              "Royal Courtyard Hotel",
              "Cedarville Filling Station",
            ].map((p) => (
              <div
                key={p}
                className="rounded-full border-2 border-primary/15 bg-card px-6 py-2.5 text-sm font-semibold text-primary-dark transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-primary-dark px-[5%] py-24 text-primary-foreground"
      >
        <div className="mx-auto max-w-7xl">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[4px] text-accent-light">
            Get In Touch
          </span>
          <h2 className="mb-5 font-display text-[clamp(2rem,4vw,3rem)] leading-tight">
            Contact Sive Special School
          </h2>
          <div
            className="mb-12 h-1 w-16 rounded"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--accent-light)), transparent)",
            }}
          />

          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-base font-semibold uppercase tracking-wider text-accent-light">
                School Details
              </h3>
              {[
                [MapPin, "Physical Address", c.contact_address],
                [Building2, "Postal Address", c.contact_postal],
                [Phone, "Telephone", c.contact_phone],
                [Mail, "Email", c.contact_email],
                [Facebook, "Facebook", c.contact_facebook],
                [Calendar, "School Hours", c.hours],
              ].map(([Icon, label, val]: any, i) => (
                <div key={i} className="mb-6 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/15">
                    <Icon className="h-5 w-5 text-accent-light" />
                  </div>
                  <div>
                    <strong className="block text-xs uppercase tracking-[2px] text-accent-light">
                      {label}
                    </strong>
                    <span className="text-base text-primary-foreground/85">
                      {val}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.06] p-9">
              <h3 className="mb-3 font-display text-2xl">Ready to Apply?</h3>
              <p className="mb-6 text-primary-foreground/75 leading-relaxed">
                Submit an online application for your child to join the Sive
                Special School family. Our admissions team will review and
                contact you.
              </p>
              <Link
                to="/apply"
                className="block w-full rounded-md bg-accent px-6 py-4 text-center font-bold text-primary-dark transition hover:bg-accent-light"
              >
                Start an Application &rarr;
              </Link>
              <div className="mt-6 flex items-center gap-3 rounded-md border border-accent/20 bg-primary-foreground/5 p-4">
                <div className="shrink-0 border-2 border-accent p-[2px]">
                  <img
                    src={logo}
                    alt="Sive Special School crest"
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="text-xs text-primary-foreground/70">
                  <strong className="text-accent-light block">
                    EMIS Number
                  </strong>
                  {c.contact_emis}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
