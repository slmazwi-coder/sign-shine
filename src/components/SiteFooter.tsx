import { Link } from "react-router-dom";
import logo from "@/assets/sive-logo.jpg";

export default function SiteFooter() {
  return (
    <footer className="border-t border-accent/20 bg-[#0a2e13] px-[5%] py-9 text-primary-foreground/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Sive Special School crest"
            className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/50"
          />
          <span className="font-display text-lg text-primary-foreground">Sive Special School For The Deaf</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Sive Special School · Cedarville, Eastern Cape · EMIS: 200501449</p>
        <div className="flex gap-5 text-sm">
          <a href="/#about" className="hover:text-accent-light">About</a>
          <a href="/apply" className="hover:text-accent-light">Apply</a>
          <a href="/#contact" className="hover:text-accent-light">Contact</a>
          <Link to="/admin-login" className="hover:text-accent-light">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
