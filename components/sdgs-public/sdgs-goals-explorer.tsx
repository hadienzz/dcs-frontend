"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Database,
  Layers3,
  Target,
} from "lucide-react";

import { useSdgsGoals } from "@/hooks/sdgs-public/use-sdgs-public";
import { cn } from "@/lib/utils";
import type { SdgGoal } from "@/types/sdgs-public";

export function SdgsGoalsExplorer() {
  const { data: goals = [], isLoading } = useSdgsGoals();

  return <SdgsGoalsExplorerView goals={goals} isLoading={isLoading} />;
}

function SdgsGoalsExplorerView({
  goals,
  isLoading,
}: {
  goals: SdgGoal[];
  isLoading: boolean;
}) {
  const featuredGoal = goals.find((goal) => goal.id === 12) ?? goals[0];

  return (
    <section
      id="sdgs-explorer"
      className="scroll-mt-24 overflow-x-hidden bg-[#f7f8f5] text-slate-950"
    >
      <div className="relative overflow-hidden border-y border-black/5 bg-[#fbfbf7]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.62) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.62) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-10 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:pb-16 lg:pt-14">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#9f1f25] shadow-sm">
                <Target className="size-3.5" />
                SDGs Impact Explorer
              </div>
              <h1 className="mt-6 max-w-[calc(100vw-2.5rem)] text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl md:max-w-3xl md:text-6xl">
                Jelajahi 17 tujuan, data, dan bukti dampaknya.
              </h1>
              <p className="mt-5 max-w-[calc(100vw-2.5rem)] text-base leading-8 text-slate-600 md:max-w-2xl md:text-lg">
                Pilih goal SDG untuk melihat ringkasan, statistik, indikator,
                tren data, program terkait, dan berita yang relevan dalam satu
                halaman yang mudah dipindai.
              </p>
              
            </div>

            <div className="grid max-w-[calc(100vw-2.5rem)] grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-4">
              <ImpactMetric icon={Layers3} label="Goals" value="17" />
              <ImpactMetric icon={Database} label="Indikator" value="51+" />
              <ImpactMetric icon={BarChart3} label="Program" value="180+" />
              <ImpactMetric icon={CalendarDays} label="Update" value="2026" />
            </div>
          </div>

            {featuredGoal ? (
            <div className="relative min-h-[25rem] w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.75)] lg:max-w-none">
              <Image
                src={featuredGoal.imageUrl}
                alt={featuredGoal.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.88),rgba(15,23,42,0.18)),linear-gradient(0deg,rgba(15,23,42,0.72),transparent_48%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex size-20 flex-col justify-center rounded-2xl px-4 font-bold shadow-[0_16px_40px_-28px_rgba(0,0,0,0.65)]"
                    style={{
                      backgroundColor: featuredGoal.color,
                      color: featuredGoal.foreground,
                    }}
                  >
                    <span className="text-4xl leading-none">{featuredGoal.id}</span>
                    <span className="text-[10px] uppercase leading-tight tracking-wide">
                      SDG
                    </span>
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    Featured
                  </span>
                </div>
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    Goal {featuredGoal.id}
                  </p>
                  <h2 className="mt-3 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-5xl">
                    {featuredGoal.name}
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/78">
                    {featuredGoal.summary}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <section id="daftar-sdgs" className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
              17 tujuan pembangunan berkelanjutan
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Pilih SDG untuk buka data detail.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            Hover kartu untuk melihat detail cepat. Klik CTA untuk membuka
            indikator, statistik, dan berita dari goal tersebut.
          </p>
        </div>

        {isLoading ? (
          <GoalsSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {goals.map((goal, index) => (
              <SdgGoalCard key={goal.id} goal={goal} priority={index < 4} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function SdgGoalCard({ goal, priority }: { goal: SdgGoal; priority: boolean }) {
  return (
    <Link
      href={`/sdg/${goal.slug}`}
      className="group relative min-h-[10rem] overflow-hidden rounded-xl border border-white/80 bg-slate-900 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.55)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-44px_rgba(15,23,42,0.7)] focus-visible:ring-2 focus-visible:ring-[#b6252a] sm:min-h-[22rem] sm:rounded-2xl"
    >
      <Image
        src={goal.imageUrl}
        alt={goal.name}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 33vw"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.36)_46%,rgba(15,23,42,0.92)_100%)]" />
      <div
        className="absolute left-2 top-2 flex size-9 flex-col items-center justify-center rounded-lg font-bold shadow-[0_16px_40px_-24px_rgba(0,0,0,0.75)] sm:left-4 sm:top-4 sm:size-16 sm:rounded-2xl sm:px-3"
        style={{ backgroundColor: goal.color, color: goal.foreground }}
      >
        <span className="text-base leading-none sm:text-3xl">{goal.id}</span>
        <span className="hidden text-[9px] uppercase tracking-wide sm:block">SDG</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-5">
        <div className="transition duration-300 group-hover:-translate-y-2">
          <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/65 sm:block">
            {goal.englishName}
          </p>
          <h3 className="mt-0 break-words text-xs font-semibold leading-tight text-white sm:mt-2 sm:text-xl md:text-2xl">
            {goal.name}
          </h3>
        </div>
        <div className="hidden grid-rows-[0fr] opacity-0 transition-all duration-300 sm:grid sm:max-h-0 sm:translate-y-3 group-hover:sm:mt-4 group-hover:sm:max-h-52 group-hover:sm:translate-y-0 group-hover:sm:grid-rows-[1fr] group-hover:sm:opacity-100 group-focus-visible:sm:mt-4 group-focus-visible:sm:max-h-52 group-focus-visible:sm:translate-y-0 group-focus-visible:sm:grid-rows-[1fr] group-focus-visible:sm:opacity-100">
          <div className="overflow-hidden">
            <p className="text-sm leading-6 text-white/78">{goal.summary}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-slate-950">
              Lihat detail
              <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ImpactMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white px-4 py-4 shadow-sm">
      <Icon className="size-4 text-[#b6252a]" />
      <div className="mt-4 text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function GoalsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className={cn(
            "min-h-[10rem] animate-pulse rounded-xl border border-black/5 bg-white sm:min-h-[22rem] sm:rounded-2xl",
            index % 3 === 0 && "bg-[#fff7f7]",
          )}
        />
      ))}
    </div>
  );
}
