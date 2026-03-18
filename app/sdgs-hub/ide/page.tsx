"use client";

import { SdgsHubHero } from "@/components/sdgs-hub/sdgs-hub-hero";
import { IdeaCard } from "@/components/sdgs-hub/idea-card";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import { motion } from "framer-motion";
import { Trophy, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function IdePage() {
  const { ideas, voteIdea } = useSdgsHub();

  // Sort: highest votes first
  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes);
  const topIdeas = sortedIdeas.slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <SdgsHubHero
        title="Ruang Ide &"
        accentWord="Aspirasi Mahasiswa"
        subtitle="Vote ide terbaik mahasiswa untuk kampus yang lebih berkelanjutan. Ide dengan dukungan tertinggi akan ditinjau oleh tim SDGs Center."
      />

      {/* Top Ideas Highlight */}
      <ScrollSection>
        <section className="bg-gradient-to-b from-gray-50/50 to-white py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Ide Terpopuler
              </h2>
            </div>
            <div className="space-y-4">
              {topIdeas.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="relative"
                >
                  {i === 0 && (
                    <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shadow-sm z-10">
                      🏆
                    </div>
                  )}
                  <IdeaCard idea={idea} index={0} onVote={voteIdea} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* All Ideas List */}
      <ScrollSection>
        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Semua Ide ({ideas.length})
            </h2>
            <Link
              href="/sdgs-hub/ide/buat"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b6252a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#9a1e22] hover:shadow-md"
            >
              <Lightbulb className="h-4 w-4" />
              Kirim Idemu
            </Link>
          </div>
          <div className="space-y-4">
            {sortedIdeas.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} onVote={voteIdea} />
            ))}
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
