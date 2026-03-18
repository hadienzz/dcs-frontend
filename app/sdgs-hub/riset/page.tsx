"use client";

import { SdgsHubHero } from "@/components/sdgs-hub/sdgs-hub-hero";
import { ProjectCard } from "@/components/sdgs-hub/project-card";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import { Search } from "lucide-react";
import { useState } from "react";

export default function RisetPage() {
  const { projects } = useSdgsHub();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSdg, setSelectedSdg] = useState("");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSdg = !selectedSdg || p.sdgCategory === selectedSdg;
    return matchesSearch && matchesSdg;
  });

  const sdgCategories = Array.from(
    new Set(projects.map((p) => p.sdgCategory)),
  ).sort();

  return (
    <main className="min-h-screen bg-white">
      <SdgsHubHero
        title="Pencarian Tim"
        accentWord="Riset & Project"
        subtitle="Temukan project riset yang sesuai dengan minat dan keahlianmu. Dosen dan mitra memposting topik riset — kamu bisa langsung mendaftar dan menghubungi via WhatsApp."
      />

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-12">
          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari project, topik, atau skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
                />
              </div>
              {/* SDG Filter */}
              <select
                value={selectedSdg}
                onChange={(e) => setSelectedSdg(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm transition-all focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
              >
                <option value="">Semua SDG</option>
                {sdgCategories.map((sdg) => (
                  <option key={sdg} value={sdg}>
                    {sdg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Count */}
          <p className="mb-6 text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-700">
              {filteredProjects.length}
            </span>{" "}
            project
          </p>

          {/* Grid */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 px-8 py-16 text-center">
              <p className="text-gray-500">Tidak ada project yang ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </section>
      </ScrollSection>
    </main>
  );
}
