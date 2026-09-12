import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/live", label: "Live" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/classements", label: "Classements" },
  { href: "/competitions", label: "Compétitions" },
  { href: "/favoris", label: "Favoris" },
  { href: "/regarder", label: "Où regarder" },
  { href: "/videos", label: "Résumés" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#05070a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-[#05070a] font-display text-xl tracking-wide">
            A
          </span>
          <span className="font-display text-2xl tracking-[0.18em] text-white">
            ARENA<span className="text-gold">DIRECT</span>
          </span>
        </Link>
        <nav className="flex max-w-[60vw] items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-white/75 transition hover:bg-white/8 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
