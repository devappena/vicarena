"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#05070a]/80 backdrop-blur-xl">
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold text-[#05070a] font-display text-xl tracking-wide">
            A
          </span>
          <span className="truncate font-display text-xl tracking-[0.18em] text-white sm:text-2xl">
            ARENA<span className="text-gold">DIRECT</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 transition ${
                isActive(pathname, link.href)
                  ? "bg-white/10 text-white"
                  : "text-white/75 hover:bg-white/8 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/15 text-white lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/55 lg:hidden"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id={menuId}
            className="relative z-40 border-t border-white/10 bg-[#05070a] px-4 py-3 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-4 py-3 text-base ${
                      isActive(pathname, link.href)
                        ? "bg-gold text-[#05070a]"
                        : "text-white/85 hover:bg-white/8"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
