"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lightbulb,
  Rocket,
  FlaskConical,
  LogOut,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  LayoutDashboard,
  Eye,
} from "lucide-react";

import type {
  Innovation,
  Idea,
  Project,
  SubmissionStatus,
  AdminMessage,
} from "@/hooks/useSdgsHubData";

const SUPERADMIN_STORAGE_KEY = "sdgs-superadmin-session";

type TabType = "overview" | "ide" | "inovasi" | "riset";

interface DashboardData {
  ideas: Idea[];
  innovations: Innovation[];
  projects: Project[];
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    label: "Menunggu Review",
  },
  approved: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    label: "Disetujui",
  },
  rejected: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-600",
    label: "Ditolak",
  },
};

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {style.label}
    </span>
  );
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<DashboardData>({
    ideas: [],
    innovations: [],
    projects: [],
  });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>(
    {},
  );
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">(
    "all",
  );

  // Auth check
  useEffect(() => {
    const session = window.localStorage.getItem(SUPERADMIN_STORAGE_KEY);
    if (!session) {
      router.replace("/superadmin");
    }
  }, [router]);

  // Load data from localStorage (same as useSdgsHubData)
  const loadData = useCallback(() => {
    try {
      const rawIdeas = window.localStorage.getItem("sdgs-hub-ideas");
      const rawInnovations = window.localStorage.getItem(
        "sdgs-hub-innovations",
      );
      const rawProjects = window.localStorage.getItem("sdgs-hub-projects");

      setData({
        ideas: rawIdeas ? JSON.parse(rawIdeas) : [],
        innovations: rawInnovations ? JSON.parse(rawInnovations) : [],
        projects: rawProjects ? JSON.parse(rawProjects) : [],
      });
    } catch {
      setData({ ideas: [], innovations: [], projects: [] });
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "sdgs-hub-ideas" ||
        e.key === "sdgs-hub-innovations" ||
        e.key === "sdgs-hub-projects"
      ) {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadData]);

  const updateItemStatus = (
    type: "idea" | "innovation" | "project",
    itemId: string,
    status: SubmissionStatus,
    message?: string,
  ) => {
    const adminMsg: AdminMessage | undefined = message
      ? {
          id: `msg-${Date.now()}`,
          from: "admin",
          message,
          createdAt: new Date().toISOString(),
        }
      : undefined;

    if (type === "idea") {
      const updated = data.ideas.map((item) =>
        item.id === itemId
          ? {
              ...item,
              submissionStatus: status,
              adminMessages: adminMsg
                ? [...(item.adminMessages || []), adminMsg]
                : item.adminMessages,
            }
          : item,
      );
      window.localStorage.setItem("sdgs-hub-ideas", JSON.stringify(updated));
      setData((prev) => ({ ...prev, ideas: updated }));
    } else if (type === "innovation") {
      const updated = data.innovations.map((item) =>
        item.id === itemId
          ? {
              ...item,
              submissionStatus: status,
              adminMessages: adminMsg
                ? [...(item.adminMessages || []), adminMsg]
                : item.adminMessages,
            }
          : item,
      );
      window.localStorage.setItem(
        "sdgs-hub-innovations",
        JSON.stringify(updated),
      );
      setData((prev) => ({ ...prev, innovations: updated }));
    } else if (type === "project") {
      const updated = data.projects.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status:
                status === "approved"
                  ? ("open" as const)
                  : status === "rejected"
                    ? ("closed" as const)
                    : item.status,
            }
          : item,
      );
      window.localStorage.setItem("sdgs-hub-projects", JSON.stringify(updated));
      setData((prev) => ({ ...prev, projects: updated }));
    }
  };

  const sendMessage = (type: "idea" | "innovation", itemId: string) => {
    const msg = messageInputs[itemId];
    if (!msg?.trim()) return;

    const adminMsg: AdminMessage = {
      id: `msg-${Date.now()}`,
      from: "admin",
      message: msg.trim(),
      createdAt: new Date().toISOString(),
    };

    if (type === "idea") {
      const updated = data.ideas.map((item) =>
        item.id === itemId
          ? {
              ...item,
              adminMessages: [...(item.adminMessages || []), adminMsg],
            }
          : item,
      );
      window.localStorage.setItem("sdgs-hub-ideas", JSON.stringify(updated));
      setData((prev) => ({ ...prev, ideas: updated }));
    } else {
      const updated = data.innovations.map((item) =>
        item.id === itemId
          ? {
              ...item,
              adminMessages: [...(item.adminMessages || []), adminMsg],
            }
          : item,
      );
      window.localStorage.setItem(
        "sdgs-hub-innovations",
        JSON.stringify(updated),
      );
      setData((prev) => ({ ...prev, innovations: updated }));
    }

    setMessageInputs((prev) => ({ ...prev, [itemId]: "" }));
  };

  const logout = () => {
    window.localStorage.removeItem(SUPERADMIN_STORAGE_KEY);
    router.push("/superadmin");
  };

  const toggle = (id: string) =>
    setExpandedItem((prev) => (prev === id ? null : id));

  // Stats
  const pendingIdeas = data.ideas.filter(
    (i) => (i.submissionStatus || "approved") === "pending",
  ).length;
  const pendingInnovations = data.innovations.filter(
    (i) => (i.submissionStatus || "approved") === "pending",
  ).length;
  const activeProjects = data.projects.filter(
    (p) => p.status === "open" || p.status === "in-progress",
  ).length;

  const filterBySearch = <T extends { title: string; sdgCategory?: string }>(
    items: T[],
  ) =>
    items.filter((item) => {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.sdgCategory || "").toLowerCase().includes(q)
      );
    });

  const filterByStatus = <T extends { submissionStatus?: SubmissionStatus }>(
    items: T[],
    defaultStatus: SubmissionStatus = "approved",
  ) =>
    filterStatus === "all"
      ? items
      : items.filter(
          (item) => (item.submissionStatus || defaultStatus) === filterStatus,
        );

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "ide",
      label: "Ide",
      icon: <Lightbulb className="h-4 w-4" />,
      count: pendingIdeas,
    },
    {
      id: "inovasi",
      label: "Inovasi",
      icon: <Rocket className="h-4 w-4" />,
      count: pendingInnovations,
    },
    {
      id: "riset",
      label: "Riset",
      icon: <FlaskConical className="h-4 w-4" />,
      count: activeProjects,
    },
  ];

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#fafafa_0%,#fff_100%)]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 border-b border-black/6 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b6252a]/8">
              <ShieldCheck className="h-5 w-5 text-[#b6252a]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">SDGs Center Management</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedItem(null);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[#b6252a] text-white shadow-[0_8px_20px_-10px_rgba(182,37,42,0.6)]"
                  : "bg-white text-gray-600 border border-black/8 hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Ide",
                  value: data.ideas.length,
                  pending: pendingIdeas,
                  icon: <Lightbulb className="h-5 w-5" />,
                  color: "#4C9F38",
                },
                {
                  label: "Total Inovasi",
                  value: data.innovations.length,
                  pending: pendingInnovations,
                  icon: <Rocket className="h-5 w-5" />,
                  color: "#26BDE2",
                },
                {
                  label: "Total Riset",
                  value: data.projects.length,
                  pending: 0,
                  icon: <FlaskConical className="h-5 w-5" />,
                  color: "#E5243B",
                },
                {
                  label: "Riset Aktif",
                  value: activeProjects,
                  pending: 0,
                  icon: <Eye className="h-5 w-5" />,
                  color: "#FCC30B",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm"
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    {stat.label}
                  </div>
                  {stat.pending > 0 && (
                    <div className="mt-2 text-xs font-semibold text-amber-600">
                      {stat.pending} menunggu review
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recent pending items */}
            {(pendingIdeas > 0 || pendingInnovations > 0) && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Perlu Ditinjau
                </h3>
                <div className="space-y-3">
                  {data.ideas
                    .filter(
                      (i) => (i.submissionStatus || "approved") === "pending",
                    )
                    .slice(0, 3)
                    .map((idea) => (
                      <div
                        key={idea.id}
                        className="flex items-center justify-between rounded-xl border border-black/6 bg-white p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                            <Lightbulb className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {idea.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ide oleh {idea.author} &middot; {idea.sdgCategory}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("ide");
                            setExpandedItem(idea.id);
                          }}
                          className="text-xs font-semibold text-[#b6252a] hover:underline"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  {data.innovations
                    .filter(
                      (i) => (i.submissionStatus || "approved") === "pending",
                    )
                    .slice(0, 3)
                    .map((inno) => (
                      <div
                        key={inno.id}
                        className="flex items-center justify-between rounded-xl border border-black/6 bg-white p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                            <Rocket className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {inno.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Inovasi oleh {inno.creator} &middot;{" "}
                              {inno.sdgCategory}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("inovasi");
                            setExpandedItem(inno.id);
                          }}
                          className="text-xs font-semibold text-[#b6252a] hover:underline"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Ide Tab */}
        {activeTab === "ide" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />
            <div className="mt-4 space-y-3">
              {filterBySearch(filterByStatus(data.ideas, "approved")).length ===
              0 ? (
                <EmptyState label="ide" />
              ) : (
                filterBySearch(filterByStatus(data.ideas, "approved")).map(
                  (idea) => (
                    <SubmissionCard
                      key={idea.id}
                      title={idea.title}
                      subtitle={`oleh ${idea.author} (${idea.email})`}
                      sdgCategory={idea.sdgCategory}
                      createdAt={idea.createdAt}
                      description={idea.description}
                      status={idea.submissionStatus || "approved"}
                      adminMessages={idea.adminMessages || []}
                      expanded={expandedItem === idea.id}
                      onToggle={() => toggle(idea.id)}
                      onApprove={() =>
                        updateItemStatus("idea", idea.id, "approved")
                      }
                      onReject={() =>
                        updateItemStatus("idea", idea.id, "rejected")
                      }
                      messageValue={messageInputs[idea.id] || ""}
                      onMessageChange={(val) =>
                        setMessageInputs((p) => ({ ...p, [idea.id]: val }))
                      }
                      onSendMessage={() => sendMessage("idea", idea.id)}
                      extra={
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{idea.votes} votes</span>
                        </div>
                      }
                    />
                  ),
                )
              )}
            </div>
          </motion.div>
        )}

        {/* Inovasi Tab */}
        {activeTab === "inovasi" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
            />
            <div className="mt-4 space-y-3">
              {filterBySearch(filterByStatus(data.innovations, "approved"))
                .length === 0 ? (
                <EmptyState label="inovasi" />
              ) : (
                filterBySearch(
                  filterByStatus(data.innovations, "approved"),
                ).map((inno) => (
                  <SubmissionCard
                    key={inno.id}
                    title={inno.title}
                    subtitle={`oleh ${inno.creator}${inno.creatorEmail ? ` (${inno.creatorEmail})` : ""}`}
                    sdgCategory={inno.sdgCategory}
                    createdAt={inno.createdAt || ""}
                    description={inno.description}
                    status={inno.submissionStatus || "approved"}
                    adminMessages={inno.adminMessages || []}
                    expanded={expandedItem === inno.id}
                    onToggle={() => toggle(inno.id)}
                    onApprove={() =>
                      updateItemStatus("innovation", inno.id, "approved")
                    }
                    onReject={() =>
                      updateItemStatus("innovation", inno.id, "rejected")
                    }
                    messageValue={messageInputs[inno.id] || ""}
                    onMessageChange={(val) =>
                      setMessageInputs((p) => ({ ...p, [inno.id]: val }))
                    }
                    onSendMessage={() => sendMessage("innovation", inno.id)}
                    extra={
                      <div className="flex flex-wrap gap-1.5">
                        {inno.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    }
                  />
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Riset Tab */}
        {activeTab === "riset" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari riset..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                />
              </div>
            </div>
            <div className="space-y-3">
              {filterBySearch(data.projects).length === 0 ? (
                <EmptyState label="riset" />
              ) : (
                filterBySearch(data.projects).map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">
                            {proj.title}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                              proj.status === "open"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : proj.status === "in-progress"
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-gray-200 bg-gray-50 text-gray-500"
                            }`}
                          >
                            {proj.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {proj.dosenName} &middot; {proj.sdgCategory} &middot;{" "}
                          {proj.createdAt}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                          {proj.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Slot: {proj.filledSlots}/{proj.teamSlots}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {proj.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {proj.status === "closed" && (
                          <button
                            onClick={() =>
                              updateItemStatus("project", proj.id, "approved")
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Buka Kembali
                          </button>
                        )}
                        {(proj.status === "open" ||
                          proj.status === "in-progress") && (
                          <button
                            onClick={() =>
                              updateItemStatus("project", proj.id, "rejected")
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Tutup
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ── Sub-components ────────────────────────── */

function FilterBar({
  search,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: SubmissionStatus | "all";
  onFilterChange: (v: SubmissionStatus | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan judul atau SDG..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
        />
      </div>
      <div className="flex gap-1.5">
        {(
          [
            { value: "all", label: "Semua" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ] as const
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              filterStatus === f.value
                ? "bg-[#b6252a] text-white"
                : "bg-white border border-black/8 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">
        Tidak ada {label} yang ditemukan
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Coba ubah filter atau kata kunci pencarian
      </p>
    </div>
  );
}

function SubmissionCard({
  title,
  subtitle,
  sdgCategory,
  createdAt,
  description,
  status,
  adminMessages,
  expanded,
  onToggle,
  onApprove,
  onReject,
  messageValue,
  onMessageChange,
  onSendMessage,
  extra,
}: {
  title: string;
  subtitle: string;
  sdgCategory: string;
  createdAt: string;
  description: string;
  status: SubmissionStatus;
  adminMessages: AdminMessage[];
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  messageValue: string;
  onMessageChange: (val: string) => void;
  onSendMessage: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {subtitle} &middot; {sdgCategory}
            {createdAt && ` \u00b7 ${createdAt}`}
          </p>
          {extra && <div className="mt-2">{extra}</div>}
        </div>
        <div className="shrink-0 pt-1 text-gray-400">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-black/6 bg-gray-50/50 p-5">
              {/* Description */}
              <div className="mb-5">
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Deskripsi
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">
                  {description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mb-5 flex flex-wrap gap-2">
                <button
                  onClick={onApprove}
                  disabled={status === "approved"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  onClick={onReject}
                  disabled={status === "rejected"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>

              {/* Messages */}
              {adminMessages.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <MessageSquare className="mr-1 inline h-3 w-3" /> Pesan
                    Admin
                  </h4>
                  <div className="space-y-2">
                    {adminMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-[#b6252a]/10 bg-[#fff8f8] p-3"
                      >
                        <p className="text-sm text-gray-700">{msg.message}</p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {new Date(msg.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Message */}
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kirim Pesan ke User
                </h4>
                <div className="flex gap-2">
                  <input
                    value={messageValue}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Tulis pesan, alasan revisi, atau feedback..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder-gray-400 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSendMessage();
                    }}
                  />
                  <button
                    onClick={onSendMessage}
                    disabled={!messageValue.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#b6252a] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#9a1e22] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
