import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logo from "@/assets/sive-logo.jpg";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Programmes", href: "/#programmes" },
  { label: "Apply Online", href: "/apply" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[68px] border-b-2 border-accent bg-primary-dark/95 backdrop-blur-md">
      <div className="mx-auto flex h-full items-center justify-between px-[5%]">
        <Link to="/" className="flex items-center gap-3" aria-label="Sive Special School home">
          <img
            src={logo}
            alt="Sive Special School crest"
            className="h-11 w-11 object-contain mix-blend-luminosity opacity-80"
          />
          <div className="text-primary-foreground">
            <strong className="block font-display text-base leading-tight">Sive Special School</strong>
            <span className="text-[0.65rem] uppercase tracking-[2px] text-accent-light">For The Deaf</span>
          </div>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((n) => (
            <li key={n.href}>
              <Link
                to={n.href}
                className="text-sm font-medium tracking-wide text-primary-foreground/85 transition-colors hover:text-accent-light"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/learner-login"
            className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70 hover:text-accent-light"
          >
            Learner Login
          </Link>
          <Link
            to="/apply"
            className="rounded bg-accent px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-dark transition-colors hover:bg-accent-light"
          >
            Apply Now
          </Link>
        </div>
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-primary-dark border-t border-accent/30">
          <ul className="flex flex-col px-6 py-4 gap-3">
            {navItems.map((n) => (
              <li key={n.href}>
                <Link to={n.href} onClick={() => setOpen(false)} className="block text-primary-foreground/90 py-2">
                  {n.label}
                </Link>
              </li>
            ))}
            <li><Link to="/learner-login" onClick={() => setOpen(false)} className="block text-accent-light py-2">Learner Login</Link></li>
            <li><Link to="/apply" onClick={() => setOpen(false)} className="block py-2 font-bold text-accent">Apply Now →</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
