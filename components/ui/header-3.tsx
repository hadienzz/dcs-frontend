"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  FileText,
  GlobeIcon,
  Handshake,
  HelpCircle,
  LayersIcon,
  Leaf,
  Map,
  Newspaper,
  PlayCircle,
  Rocket,
  Shield,
  Sparkles,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { SearchBar } from "@/components/home/custom/search-bar";
import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  getSdgDashboardRouteByRole,
  useSdgDashboardAuth,
} from "@/hooks/use-sdg-dashboard-auth";
import {
  buildSdgDashboardNotifications,
  type PortalNotificationItem,
} from "@/lib/portal-notifications";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const telkomPrimaryButtonClass =
  "rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_38px_-16px_rgba(182,37,42,0.95),inset_0_1px_0_rgba(255,255,255,0.38)]";

const telkomSecondaryButtonClass =
  "rounded-full border border-[#b6252a]/15 bg-white/80 text-[#9f1f25] shadow-[0_10px_24px_-20px_rgba(182,37,42,0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b6252a]/35 hover:bg-[#fff5f5] hover:text-[#8f1a20] hover:shadow-[0_18px_32px_-20px_rgba(182,37,42,0.55)]";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const desktopNotificationRef = React.useRef<HTMLDivElement | null>(null);
  const mobileNotificationRef = React.useRef<HTMLDivElement | null>(null);
  const scrolled = useScroll(10);
  const pathname = usePathname();
  const { currentAccount } = useSdgDashboardAuth();
  const { projects: dashboardProjects } = useSdgDashboardProjects();
  const isSdgsHubArea = pathname.startsWith("/sdgs-hub");
  const dashboardHref = currentAccount
    ? getSdgDashboardRouteByRole(currentAccount.role)
    : "/sdgdashboard";

  const homeHref = React.useCallback(
    (id: string) => (pathname === "/" ? `#${id}` : `/#${id}`),
    [pathname],
  );

  const productLinks = React.useMemo<LinkItem[]>(
    () => [
      {
        title: "Peta Dampak",
        href: homeHref("map"),
        description: "Lihat sebaran dampak dan proyek DCS di Indonesia.",
        icon: Map,
      },
      {
        title: "Program Inovasi",
        href: "/program",
        description: "Jelajahi seluruh program dan solusi yang dikembangkan.",
        icon: LayersIcon,
      },
      {
        title: "Kepakaran",
        href: homeHref("kepakaran"),
        description: "Temui para ahli yang mendukung implementasi SDGs.",
        icon: Users,
      },
      {
        title: "Berita & Update",
        href: "/news",
        description: "Pantau publikasi dan kabar terbaru dari DCS.",
        icon: Newspaper,
      },
      {
        title: "Keunggulan DCS",
        href: homeHref("keunggulan"),
        description: "Ringkasan nilai utama dan diferensiasi program kami.",
        icon: Sparkles,
      },
      {
        title: "Video Unggulan",
        href: homeHref("video"),
        description: "Tonton profil singkat dan fokus inisiatif DCS.",
        icon: PlayCircle,
      },
      {
        title: "SDGs Hub",
        href: "/sdgs-hub",
        description: "Portal kolaborasi riset, inovasi, dan ide mahasiswa.",
        icon: Rocket,
      },
    ],
    [homeHref],
  );

  const companyLinks = React.useMemo<LinkItem[]>(
    () => [
      {
        title: "Tentang Kami",
        href: "/tentangkami",
        description: "Struktur, visi, misi, dan fokus SDGs Telkom University.",
        icon: GlobeIcon,
      },
      {
        title: "Kolaborasi",
        href: homeHref("footer"),
        description: "Terhubung dengan tim DCS untuk kerja sama strategis.",
        icon: Handshake,
      },
      {
        title: "Dampak Berkelanjutan",
        href: homeHref("map"),
        description: "Pelajari cakupan kontribusi dan implementasi lapangan.",
        icon: Leaf,
      },
    ],
    [homeHref],
  );

  const companyLinks2 = React.useMemo<LinkItem[]>(
    () => [
      {
        title: "Program",
        href: "/program",
        icon: LayersIcon,
      },
      {
        title: "Berita",
        href: "/news",
        icon: FileText,
      },
      {
        title: "Kontak",
        href: homeHref("footer"),
        icon: HelpCircle,
      },
      {
        title: "Peta Dampak",
        href: homeHref("map"),
        icon: BarChart3,
      },
      {
        title: "Profil DCS",
        href: "/tentangkami",
        icon: Shield,
      },
      {
        title: "SDGs Hub",
        href: "/sdgs-hub",
        icon: Rocket,
      },
    ],
    [homeHref],
  );

  const sdgsHubAccountLink = React.useMemo<LinkItem>(() => {
    if (currentAccount) {
      return {
        title: "Dashboard Saya",
        href: dashboardHref,
        description:
          "Buka dashboard dan lanjut ke area internal atau portal eksternal sesuai akun.",
        icon: BarChart3,
      };
    }

    return {
      title: "Masuk",
      href: dashboardHref,
      description:
        "Masuk dulu untuk membuka dashboard internal atau portal eksternal.",
      icon: BarChart3,
    };
  }, [currentAccount, dashboardHref]);
  const mobilePrimarySectionTitle = "Jelajahi";
  const mobilePrimaryLinks = productLinks;
  const mobileSecondarySectionTitle = "Tentang";
  const mobileSecondaryLinks = companyLinks;
  const mobileTertiarySectionTitle = "Tautan Cepat";
  const mobileTertiaryLinks = companyLinks2;
  const ctaHref = isSdgsHubArea ? sdgsHubAccountLink.href : homeHref("footer");
  const ctaLabel = isSdgsHubArea ? sdgsHubAccountLink.title : "Hubungi Kami";
  const secondaryMobileHref = "/tentangkami";
  const secondaryMobileLabel = "Tentang Kami";
  const notifications = React.useMemo<PortalNotificationItem[]>(() => {
    if (!currentAccount) {
      return [];
    }

    return buildSdgDashboardNotifications({
      role: currentAccount.role,
      projects: dashboardProjects,
    });
  }, [currentAccount, dashboardProjects]);
  const notificationHref = dashboardHref;
  const notificationContextLabel = currentAccount
    ? currentAccount.role === "internal"
      ? "Dashboard Internal"
      : "Portal Eksternal"
    : "SDGs Hub";
  const notificationFooterLabel = currentAccount
    ? "Buka dashboard"
    : "Lihat halaman terkait";
  const showNotifications = Boolean(currentAccount);
  const unreadNotifications = notifications.length;

  React.useEffect(() => {
    setOpen(false);
    setNotificationOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!notificationOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = desktopNotificationRef.current?.contains(target);
      const clickedMobile = mobileNotificationRef.current?.contains(target);

      if (!clickedDesktop && !clickedMobile) {
        setNotificationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationOpen]);

  const isActive = React.useCallback(
    (href: string) => {
      if (href.startsWith("/#")) return false;
      if (href.startsWith("#")) return pathname === "/";
      return href === pathname || (href !== "/" && pathname.startsWith(href));
    },
    [pathname],
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "relative flex h-16 w-full max-w-5xl items-center justify-between rounded-2xl border px-5 transition-all duration-500",
          scrolled || open
            ? "border-white/40 bg-white/70 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
            : "border-white/30 bg-white/50 backdrop-blur-xl",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center rounded-xl p-1.5 transition-colors hover:bg-foreground/[0.04]"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/[0.06]">
            <Image
              src="/dcslogo.png"
              alt="SDG's Telkom University"
              width={36}
              height={36}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop center navigation */}
        <div
          className={cn(
            "hidden items-center md:flex absolute left-1/2 -translate-x-1/2 transition-all duration-300",
            searchExpanded
              ? "pointer-events-none opacity-0 scale-95"
              : "opacity-100 scale-100",
          )}
        >
          <NavigationMenu>
            <NavigationMenuList className="gap-0">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={cn(
                      "inline-flex h-9 items-center rounded-lg px-4 py-2 text-[14px] font-medium text-foreground/60 transition-colors hover:text-foreground",
                      isActive("/") && "text-foreground",
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/sdgs-hub"
                    className={cn(
                      "inline-flex h-9 items-center rounded-lg px-4 py-2 text-[14px] font-medium text-foreground/60 transition-colors hover:text-foreground",
                      isActive("/sdgs-hub") && "text-foreground",
                    )}
                  >
                    SDGs Hub
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-4 py-2 text-[14px] font-medium text-foreground/60 hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                  Jelajahi
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="w-[38rem] p-5">
                    <ul className="grid grid-cols-2 gap-1">
                      {productLinks.map((item) => (
                        <li key={item.title}>
                          <ListItem
                            {...item}
                            onNavigate={() => setOpen(false)}
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t border-border/50 pt-4">
                      <Link
                        href="/program"
                        className="group/cta inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Lihat seluruh program
                        <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent px-4 py-2 text-[14px] font-medium text-foreground/60 hover:bg-transparent hover:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground">
                  Tentang
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-0">
                  <div className="flex w-[38rem]">
                    <div className="flex-1 border-r border-border/40 p-5">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                        Tentang
                      </p>
                      <ul className="space-y-1">
                        {companyLinks.map((item) => (
                          <li key={item.title}>
                            <ListItem
                              {...item}
                              onNavigate={() => setOpen(false)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-52 p-5">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                        Tautan Cepat
                      </p>
                      <ul className="space-y-0.5">
                        {companyLinks2.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] text-foreground/70 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
                              >
                                <item.icon className="size-4 text-muted-foreground/60" />
                                <span className="font-medium">{item.title}</span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/news"
                    className={cn(
                      "inline-flex h-9 items-center rounded-lg px-4 py-2 text-[14px] font-medium text-foreground/60 transition-colors hover:text-foreground",
                      isActive("/news") && "text-foreground",
                    )}
                  >
                    Berita
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <SearchBar onExpandChange={setSearchExpanded} />
          {showNotifications ? (
            <NotificationMenu
              ref={desktopNotificationRef}
              open={notificationOpen}
              onToggle={() => setNotificationOpen((current) => !current)}
              onClose={() => setNotificationOpen(false)}
              items={notifications}
              href={notificationHref}
              unreadCount={unreadNotifications}
              contextLabel={notificationContextLabel}
              footerLabel={notificationFooterLabel}
            />
          ) : null}
          <Button
            asChild
            variant="outline"
            className={cn(
              telkomPrimaryButtonClass,
              "h-9 px-5 text-[13.5px] font-semibold",
            )}
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <SearchBar />
          {showNotifications ? (
            <NotificationMenu
              ref={mobileNotificationRef}
              open={notificationOpen}
              onToggle={() => setNotificationOpen((current) => !current)}
              onClose={() => setNotificationOpen(false)}
              items={notifications}
              href={notificationHref}
              unreadCount={unreadNotifications}
              contextLabel={notificationContextLabel}
              footerLabel={notificationFooterLabel}
              compact
            />
          ) : null}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="size-10 rounded-lg text-foreground/70 hover:bg-foreground/[0.04]"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu open={open}>
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 pt-6 pb-8">
            {/* Jelajahi section */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {mobilePrimarySectionTitle}
              </p>
              <div className="space-y-0.5">
                {mobilePrimaryLinks.map((link) => (
                  <MobileNavLink
                    key={link.title}
                    {...link}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>

            {/* DCS section */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {mobileSecondarySectionTitle}
              </p>
              <div className="space-y-0.5">
                {mobileSecondaryLinks.map((link) => (
                  <MobileNavLink
                    key={link.title}
                    {...link}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {mobileTertiarySectionTitle}
              </p>
              <div className="space-y-0.5">
                {mobileTertiaryLinks.map((link) => (
                  <MobileNavLink
                    key={link.title}
                    {...link}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile bottom buttons */}
          <div className="border-t border-border/40 px-6 py-5">
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className={cn(
                  telkomSecondaryButtonClass,
                  "h-12 w-full rounded-xl bg-white/85 text-sm font-semibold shadow-[0_14px_28px_-22px_rgba(182,37,42,0.45)]",
                )}
              >
                <Link href={secondaryMobileHref} onClick={() => setOpen(false)}>
                  {secondaryMobileLabel}
                </Link>
              </Button>
              <Button
                asChild
                className={cn(
                  telkomPrimaryButtonClass,
                  "h-12 w-full rounded-xl text-sm font-semibold shadow-[0_20px_36px_-20px_rgba(182,37,42,0.95),inset_0_1px_0_rgba(255,255,255,0.24)]",
                )}
              >
                <Link href={ctaHref} onClick={() => setOpen(false)}>
                  {ctaLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </MobileMenu>
    </header>
  );
}

/* ─── Mobile Menu Portal ─── */

type NotificationMenuProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: PortalNotificationItem[];
  href: string;
  unreadCount: number;
  contextLabel?: string;
  footerLabel?: string;
  compact?: boolean;
};

const notificationButtonClass =
  "relative inline-flex items-center justify-center rounded-xl border border-[#b6252a]/12 bg-white/82 text-[#8f1a20] shadow-[0_14px_28px_-24px_rgba(182,37,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#b6252a]/28 hover:bg-[#fff7f7]";

const NotificationMenu = React.forwardRef<HTMLDivElement, NotificationMenuProps>(
  function NotificationMenu(
    {
      open,
      onToggle,
      onClose,
      items,
      href,
      unreadCount,
      contextLabel = "SDGs Hub",
      footerLabel = "Lihat halaman terkait",
      compact = false,
    },
    ref,
  ) {
    const displayedItems = items.slice(0, 4);

    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Buka notifikasi"
          className={cn(
            notificationButtonClass,
            compact ? "size-10" : "h-9 w-10",
          )}
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#ed1e28_100%)] px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-[0_10px_20px_-12px_rgba(182,37,42,0.9)]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>

        {open ? (
          <div className="absolute right-0 top-[calc(100%+0.85rem)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.8rem] border border-black/8 bg-white/96 shadow-[0_32px_90px_-48px_rgba(15,23,42,0.34)] backdrop-blur">
            <div className="border-b border-black/6 bg-[linear-gradient(180deg,#fff7f7_0%,#ffffff_100%)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                    Pusat Notifikasi
                  </div>
                  <div className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                    {unreadCount > 0
                      ? `${unreadCount} update menunggu dilihat`
                      : "Belum ada update baru"}
                  </div>
                </div>
                <span className="rounded-full border border-[#b6252a]/12 bg-white px-3 py-1 text-xs font-semibold text-[#b6252a]">
                  {contextLabel}
                </span>
              </div>
            </div>

            <div className="max-h-[24rem] space-y-3 overflow-y-auto px-4 py-4">
              {displayedItems.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-black/8 bg-[#fafafa] px-4 py-8 text-center text-sm leading-7 text-slate-500">
                  Belum ada notifikasi penting untuk akun aktif saat ini.
                </div>
              ) : (
                displayedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-[1.4rem] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#fff9f9_100%)] p-4 transition hover:border-[#b6252a]/16 hover:shadow-[0_18px_48px_-36px_rgba(182,37,42,0.3)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold",
                          item.badgeClassName,
                        )}
                      >
                        {item.badgeLabel}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        {item.label}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold leading-6 text-slate-900">
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                      <span>{item.meta}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#b6252a]">
                        Buka
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="border-t border-black/6 px-4 py-4">
              <Link
                href={href}
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#b6252a]/20 hover:text-[#b6252a]"
              >
                {footerLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

type MobileMenuProps = {
  open: boolean;
  children: React.ReactNode;
};

function MobileMenu({ open, children }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "fixed inset-x-0 top-[5.5rem] bottom-0 z-40 md:hidden",
        "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60",
      )}
    >
      <div className="animate-in fade-in-0 slide-in-from-top-2 h-full duration-200 ease-out">
        {children}
      </div>
    </div>,
    document.body,
  );
}

/* ─── Mobile Nav Link ─── */

type MobileNavLinkProps = LinkItem & {
  onClick: () => void;
};

function MobileNavLink({
  title,
  href,
  icon: Icon,
  description,
  onClick,
}: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3.5 rounded-lg px-3 py-3 transition-colors hover:bg-foreground/[0.04]"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.03] ring-1 ring-black/[0.04]">
        <Icon className="size-[18px] text-foreground/50" />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between">
        <div className="min-w-0">
          <span className="block text-sm font-medium text-foreground/90">
            {title}
          </span>
          {description && (
            <span className="block truncate text-xs text-muted-foreground/70">
              {description}
            </span>
          )}
        </div>
        <ChevronRight className="size-4 shrink-0 text-foreground/20 transition-colors group-hover:text-foreground/40" />
      </div>
    </Link>
  );
}

/* ─── Desktop Dropdown List Item ─── */

type ListItemProps = React.ComponentProps<typeof NavigationMenuLink> &
  LinkItem & {
    onNavigate?: () => void;
  };

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  onNavigate,
  ...props
}: ListItemProps) {
  return (
    <NavigationMenuLink
      className={cn(
        "group/item flex w-full items-start gap-3.5 rounded-lg p-3 transition-colors hover:bg-foreground/[0.04]",
        className,
      )}
      {...props}
      asChild
    >
      <Link href={href} onClick={onNavigate}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.03] ring-1 ring-black/[0.04] transition-colors group-hover/item:bg-foreground/[0.06]">
          <Icon className="size-[18px] text-foreground/50 transition-colors group-hover/item:text-foreground/70" />
        </div>
        <div className="flex flex-col gap-0.5 pt-0.5">
          <span className="text-[13.5px] font-medium leading-tight text-foreground/90">
            {title}
          </span>
          {description ? (
            <span className="text-xs leading-relaxed text-muted-foreground/70">
              {description}
            </span>
          ) : null}
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

/* ─── Scroll Hook ─── */

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}
