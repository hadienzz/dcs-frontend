"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MoveRight, X } from "lucide-react";

import { SearchBar } from "@/components/home/custom/search-bar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavigationLeaf = {
  title: string;
  href: string;
};

type NavigationGroup = {
  title: string;
  description?: string;
  href?: string;
  items?: NavigationLeaf[];
  ctaLabel?: string;
  ctaHref?: string;
};

function Header1() {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const homeSectionHref = (sectionId: string) =>
    pathname === "/" ? `#${sectionId}` : `/#${sectionId}`;

  const navigationItems: NavigationGroup[] = [
    {
      title: "Beranda",
      href: "/",
    },
    {
      title: "Jelajahi DCS",
      description:
        "Akses cepat ke peta dampak, video unggulan, kepakaran, produk, dan berita terbaru dari DCS.",
      ctaLabel: "Lihat Peta Dampak",
      ctaHref: homeSectionHref("map"),
      items: [
        { title: "Peta Dampak", href: homeSectionHref("map") },
        { title: "Keunggulan DCS", href: homeSectionHref("keunggulan") },
        { title: "Video Unggulan", href: homeSectionHref("video") },
        { title: "Kepakaran", href: homeSectionHref("kepakaran") },
        { title: "Produk Inovasi", href: homeSectionHref("produk") },
        { title: "Berita & Update", href: homeSectionHref("berita") },
      ],
    },
    {
      title: "Halaman",
      description:
        "Navigasi ke halaman lengkap program, berita, profil, dan kontak Digital Collaboration for Sustainability.",
      ctaLabel: "Hubungi Kami",
      ctaHref: homeSectionHref("footer"),
      items: [
        { title: "Program", href: "/program" },
        { title: "Berita", href: "/news" },
        { title: "Tentang Kami", href: "/tentangkami" },
        { title: "Kontak", href: homeSectionHref("footer") },
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const isActivePath = (href?: string) =>
    Boolean(href) &&
    (href === pathname ||
      (href === "/" && pathname === "/") ||
      (href !== "/" && href?.startsWith("/") && pathname.startsWith(href)));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-border bg-background/95 shadow-lg backdrop-blur-md"
          : "border-border/70 bg-background/90 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="hidden min-w-0 flex-1 lg:flex">
          <NavigationMenu className="justify-start">
            <NavigationMenuList className="justify-start gap-2">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <Button
                      asChild
                      variant={isActivePath(item.href) ? "secondary" : "ghost"}
                      className="rounded-full px-4"
                    >
                      <Link href={item.href}>{item.title}</Link>
                    </Button>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="rounded-full bg-transparent px-4">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[500px] p-4">
                        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                          <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-5">
                            <div className="space-y-3">
                              <p className="text-base font-semibold text-foreground">
                                {item.title}
                              </p>
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            {item.ctaHref && item.ctaLabel ? (
                              <Button asChild size="sm" className="mt-8 w-fit">
                                <Link href={item.ctaHref}>{item.ctaLabel}</Link>
                              </Button>
                            ) : null}
                          </div>
                          <div className="flex flex-col gap-1">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                asChild
                                key={subItem.title}
                                className="block"
                              >
                                <Link
                                  href={subItem.href}
                                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex min-w-0 items-center lg:justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full border border-transparent pr-3 transition hover:border-border hover:bg-muted/60"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-border/70">
              <Image
                src="/dcslogo.png"
                alt="DCS Telkom University"
                width={48}
                height={48}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                DCS Telkom University
              </p>
              <p className="text-sm font-semibold text-foreground">
                SDG&apos;s Digital Collaboration
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <SearchBar />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/news">Lihat Berita</Link>
          </Button>
          <Button asChild className="rounded-full shadow-sm">
            <Link href={homeSectionHref("footer")}>Hubungi Kami</Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          <SearchBar />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-20 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu navigasi"
          />
          <div className="absolute inset-x-0 top-full z-50 border-t bg-background shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
              <div className="grid gap-6">
                {navigationItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="text-lg font-semibold text-foreground"
                          onClick={() => setOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <p className="text-lg font-semibold text-foreground">
                          {item.title}
                        </p>
                      )}
                    </div>
                    {item.description ? (
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                    <div className="grid gap-2">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          <span>{subItem.title}</span>
                          <MoveRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full sm:w-auto"
                  >
                    <Link href="/program" onClick={() => setOpen(false)}>
                      Lihat Program
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-full sm:w-auto">
                    <Link
                      href={homeSectionHref("footer")}
                      onClick={() => setOpen(false)}
                    >
                      Hubungi Kami
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}

export { Header1 };
