import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-accent/20 bg-[#0a2e13] px-[5%] py-9 text-primary-foreground/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="font-display text-lg text-primary-foreground">Sive Special School For The Deaf</div>
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
