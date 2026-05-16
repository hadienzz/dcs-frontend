"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  Database,
  LineChart,
  Target,
} from "lucide-react";

import { useSdgIndicatorSelection } from "@/hooks/sdgs-public/use-sdg-indicator-selection";
import { useSdgGoal, useSdgsGoals } from "@/hooks/sdgs-public/use-sdgs-public";
import { cn } from "@/lib/utils";
import type { SdgGoal, SdgIndicator, SdgTrendPoint } from "@/types/sdgs-public";

export function SdgGoalDetail({ goalNumber }: { goalNumber: string }) {
  const { data: goals = [] } = useSdgsGoals();
  const { data: goal, isLoading } = useSdgGoal(goalNumber);
  const {
    selectedIndicator,
    selectedIndicatorCode,
    setSelectedIndicatorCode,
  } = useSdgIndicatorSelection(goal?.indicators);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!goal || !selectedIndicator) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f5] px-5 pt-24">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-slate-950">SDG tidak ditemukan</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Coba kembali ke daftar SDGs dan pilih goal lain.
          </p>
          <Link
            href="/#sdgs-explorer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#b6252a] px-5 text-sm font-semibold text-white"
          >
            Kembali ke section SDGs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <SdgGoalDetailView
      goal={goal}
      goals={goals}
      selectedIndicator={selectedIndicator}
      selectedIndicatorCode={selectedIndicatorCode}
      onSelectIndicator={setSelectedIndicatorCode}
    />
  );
}

function SdgGoalDetailView({
  goal,
  goals,
  selectedIndicator,
  selectedIndicatorCode,
  onSelectIndicator,
}: {
  goal: SdgGoal;
  goals: SdgGoal[];
  selectedIndicator: SdgIndicator;
  selectedIndicatorCode: string;
  onSelectIndicator: (indicatorCode: string) => void;
}) {
  const style = { "--goal-color": goal.color } as CSSProperties;

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#f7f8f5] pt-24 text-slate-950"
      style={style}
    >
      <section className="border-b border-black/5 bg-[#fbfbf7]">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <Link
            href="/#sdgs-explorer"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[var(--goal-color)]"
          >
            <ArrowLeft className="size-4" />
            Kembali ke 17 SDGs
          </Link>
          <GoalSwitcher goals={goals} activeGoal={goal} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fbfbf7]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:py-16">
          <div className="relative min-h-[23rem] w-full max-w-[calc(100vw-2.5rem)] min-w-0 overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.75)] lg:max-w-none">
            <Image
              src={goal.imageUrl}
              alt={goal.name}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.86))]" />
            <div
              className="absolute left-6 top-6 flex size-24 flex-col justify-center rounded-3xl px-5 font-bold shadow-[0_18px_50px_-26px_rgba(0,0,0,0.8)]"
              style={{ backgroundColor: goal.color, color: goal.foreground }}
            >
              <span className="text-5xl leading-none">{goal.id}</span>
              <span className="text-[10px] uppercase tracking-[0.24em]">Goal</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
                {goal.englishName}
              </p>
              <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {goal.name}
              </h1>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--goal-color)]">
              SDG {goal.id}
            </p>
            <h2 className="mt-3 max-w-[calc(100vw-2.5rem)] break-words text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:max-w-3xl md:text-6xl">
              {goal.tagline}
            </h2>
            <p className="mt-6 max-w-[calc(100vw-2.5rem)] text-base leading-8 text-slate-600 md:max-w-3xl">
              {goal.detail}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {goal.focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-8 grid max-w-[calc(100vw-2.5rem)] grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4">
              {goal.stats.map((stat) => (
                <StatTile key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--goal-color)]">
              Indikator SDG {goal.id}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Klik indikator untuk lihat data.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Setiap indikator menampilkan nilai utama, tren tahunan, distribusi
            capaian, insight, dan program yang berkaitan.
          </p>
        </div>

        <IndicatorTabs
          indicators={goal.indicators}
          activeCode={selectedIndicatorCode}
          onSelect={onSelectIndicator}
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <IndicatorPanel indicator={selectedIndicator} color={goal.color} />
          <IndicatorCharts indicator={selectedIndicator} color={goal.color} />
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#eef2ef]">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--goal-color)]">
                Data program dan dampak
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Ringkasan lintas program.
              </h2>
            </div>
            <span className="hidden rounded-full border border-black/8 bg-white px-4 py-2 text-xs font-semibold text-slate-600 md:inline-flex">
              5 tahun terakhir
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <DataTable indicator={selectedIndicator} color={goal.color} />
            <ProgramImpact goal={goal} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--goal-color)]">
              Berita terkait
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Update tentang SDG {goal.id}.
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--goal-color)]"
          >
            Lihat semua berita
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {goal.news.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[color-mix(in_oklab,var(--goal-color)_12%,white)] px-3 py-1 text-xs font-semibold text-[var(--goal-color)]">
                  {item.category}
                </span>
                <span className="text-xs font-medium text-slate-400">{item.date}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition group-hover:text-[var(--goal-color)]">
                Baca berita
                <ChevronRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function GoalSwitcher({
  goals,
  activeGoal,
}: {
  goals: SdgGoal[];
  activeGoal: SdgGoal;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {goals.map((goal) => {
        const isActive = goal.id === activeGoal.id;

        return (
          <Link
            key={goal.id}
            href={`/sdg/${goal.slug}`}
            aria-label={`Buka SDG ${goal.id}: ${goal.name}`}
            className={cn(
              "flex h-12 min-w-12 items-center justify-center rounded-xl border text-sm font-bold transition",
              isActive
                ? "border-transparent shadow-[0_14px_34px_-22px_rgba(15,23,42,0.8)]"
                : "border-black/8 bg-white text-slate-500 hover:-translate-y-0.5",
            )}
            style={{
              backgroundColor: isActive ? goal.color : undefined,
              color: isActive ? goal.foreground : undefined,
            }}
          >
            {goal.id}
          </Link>
        );
      })}
    </div>
  );
}

function StatTile({ stat }: { stat: SdgGoal["stats"][number] }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-4 shadow-sm">
      <div className="text-2xl font-semibold text-slate-950">{stat.value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{stat.label}</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{stat.description}</p>
    </div>
  );
}

function IndicatorTabs({
  indicators,
  activeCode,
  onSelect,
}: {
  indicators: SdgIndicator[];
  activeCode: string;
  onSelect: (indicatorCode: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {indicators.map((indicator) => {
        const isActive = indicator.code === activeCode;

        return (
          <button
            key={indicator.code}
            type="button"
            onClick={() => onSelect(indicator.code)}
            className={cn(
              "min-w-[18rem] rounded-2xl border px-4 py-3 text-left transition",
              isActive
                ? "border-transparent bg-[var(--goal-color)] text-white shadow-[0_18px_44px_-28px_rgba(15,23,42,0.7)]"
                : "border-black/8 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-black/14",
            )}
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {indicator.code}
            </span>
            <span className="mt-1 line-clamp-2 block text-sm font-semibold leading-6">
              {indicator.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function IndicatorPanel({
  indicator,
  color,
}: {
  indicator: SdgIndicator;
  color: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm">
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[19rem]">
          <Image
            src={indicator.imageUrl}
            alt={indicator.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              {indicator.code}
            </span>
            <span className="text-xs font-medium text-slate-400">
              {indicator.updatedAt}
            </span>
          </div>
          <h3 className="mt-5 text-2xl font-semibold leading-tight text-slate-950">
            {indicator.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {indicator.description}
          </p>
          <div className="mt-6 flex items-end justify-between gap-5 border-t border-black/6 pt-5">
            <div>
              <div className="text-4xl font-semibold tracking-tight text-slate-950">
                {indicator.value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {indicator.unitLabel}
              </div>
            </div>
            <div className="rounded-full bg-[#f3f4ef] px-3 py-1.5 text-xs font-semibold text-slate-700">
              {indicator.statusLabel}
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Sumber: {indicator.source}
          </p>
        </div>
      </div>
    </div>
  );
}

function IndicatorCharts({
  indicator,
  color,
}: {
  indicator: SdgIndicator;
  color: string;
}) {
  return (
    <div className="grid gap-5">
      <Panel title="Tren indikator" icon={LineChart}>
        <MiniLineChart data={indicator.trend} color={color} />
      </Panel>
      <Panel title="Distribusi capaian" icon={BarChart3}>
        <div className="space-y-4">
          {indicator.distribution.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="font-semibold text-slate-950">{item.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Icon className="size-4 text-[var(--goal-color)]" />
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MiniLineChart({ data, color }: { data: SdgTrendPoint[]; color: string }) {
  const values = data.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = data
    .map((item, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 88 - ((item.value - min) / range) * 68;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 100" className="h-48 w-full overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, index) => {
          const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
          const y = 88 - ((item.value - min) / range) * 68;

          return (
            <g key={item.year}>
              <circle cx={x} cy={y} r="2.8" fill="white" stroke={color} strokeWidth="2" />
              <text
                x={x}
                y="98"
                textAnchor="middle"
                className="fill-slate-500 text-[5px] font-medium"
              >
                {item.year}
              </text>
              {index === data.length - 1 ? (
                <text
                  x={Math.max(14, x - 3)}
                  y={Math.max(10, y - 8)}
                  textAnchor="end"
                  className="fill-slate-950 text-[6px] font-bold"
                >
                  {item.value}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DataTable({
  indicator,
  color,
}: {
  indicator: SdgIndicator;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Database className="size-4" style={{ color }} />
        <h3 className="text-base font-semibold text-slate-950">Data indikator</h3>
      </div>
      <div className="overflow-hidden rounded-xl border border-black/6">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8f5] text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Nilai</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {indicator.trend.map((item, index) => (
              <tr key={item.year}>
                <td className="px-4 py-3 font-medium text-slate-700">{item.year}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">{item.value}</td>
                <td className="px-4 py-3 text-slate-600">
                  {index === indicator.trend.length - 1 ? indicator.statusLabel : "Terekam"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 grid gap-3">
        {indicator.insights.map((insight) => (
          <div key={insight} className="flex gap-3 rounded-xl bg-[#f7f8f5] p-3">
            <BookOpen className="mt-0.5 size-4 shrink-0" style={{ color }} />
            <p className="text-sm leading-6 text-slate-600">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramImpact({ goal }: { goal: SdgGoal }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Target className="size-4 text-[var(--goal-color)]" />
        <h3 className="text-base font-semibold text-slate-950">
          Capaian program berdasarkan target
        </h3>
      </div>
      <div className="space-y-3">
        {goal.indicators.map((indicator) => (
          <div key={indicator.code} className="rounded-xl border border-black/6 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--goal-color)]">
                  {indicator.code}
                </div>
                <h4 className="mt-2 text-sm font-semibold leading-6 text-slate-950">
                  {indicator.title}
                </h4>
              </div>
              <span className="shrink-0 text-lg font-semibold text-slate-950">
                {indicator.value}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {indicator.relatedPrograms.map((program) => (
                <span
                  key={program}
                  className="rounded-full bg-[#f3f4ef] px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {program}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] pt-24">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="h-10 w-44 animate-pulse rounded-full bg-white" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="min-h-[24rem] animate-pulse rounded-[2rem] bg-white" />
          <div className="space-y-4">
            <div className="h-8 w-28 animate-pulse rounded-full bg-white" />
            <div className="h-16 max-w-xl animate-pulse rounded-2xl bg-white" />
            <div className="h-32 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
