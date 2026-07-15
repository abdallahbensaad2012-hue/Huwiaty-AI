/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { UserState, Roadmap, RoadmapMilestone, Badge } from "../types";
import { translations, staticBadges } from "../translations";
import ArabesquePattern, { ArabesqueBorder, ElegantStar } from "./ArabesquePattern";
import { Lock, Unlock, CheckCircle2, Play, Award, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  state: UserState;
  onUpdateRoadmap: (roadmap: Roadmap) => void;
  onAddXp: (xp: number) => void;
}

export default function TabJourney({ state, onUpdateRoadmap, onAddXp }: Props) {
  const language = state.profile?.language || 'ar';
  const t = translations[language];
  const isRtl = language === 'ar';

  const roadmap = state.roadmap;
  const milestones = roadmap?.milestones || [];
  const badges = roadmap?.badges || [];

  const handleUnlockNext = (currentActiveId: string) => {
    if (!roadmap) return;

    // Deep clone milestones
    const updatedMilestones = milestones.map((m) => ({ ...m }));
    const activeIdx = updatedMilestones.findIndex((m) => m.id === currentActiveId);

    if (activeIdx === -1) return;

    // Mark current completed
    const completedMilestone = updatedMilestones[activeIdx];
    completedMilestone.status = "completed" as const;
    const xpReward = completedMilestone.xpReward || 200;

    // Check if there is a next milestone to set active
    let unlockedNextId = "";
    if (activeIdx + 1 < updatedMilestones.length) {
      updatedMilestones[activeIdx + 1].status = "active" as const;
      unlockedNextId = updatedMilestones[activeIdx + 1].id;
    }

    // Check for badge triggers
    const updatedBadges = [...badges];
    
    // Trigger First Step Badge on milestone 1 complete
    if (currentActiveId === "milestone_1" && !updatedBadges.some(b => b.id === "badge_first_milestone")) {
      const firstStepBadge = staticBadges.find(b => b.id === "badge_first_milestone");
      if (firstStepBadge) {
        updatedBadges.push({
          ...firstStepBadge,
          unlockedAt: Date.now()
        });
      }
    }

    // Trigger Leader Badge on milestone 3/4 complete
    if ((currentActiveId === "milestone_3" || currentActiveId === "milestone_4") && !updatedBadges.some(b => b.id === "badge_leader")) {
      const leaderBadge = staticBadges.find(b => b.id === "badge_leader");
      if (leaderBadge) {
        updatedBadges.push({
          ...leaderBadge,
          unlockedAt: Date.now()
        });
      }
    }

    // Trigger All completed badge if milestone 5 is complete
    if (currentActiveId === "milestone_5" && !updatedBadges.some(b => b.id === "badge_heritage")) {
      const heritageBadge = staticBadges.find(b => b.id === "badge_heritage");
      if (heritageBadge) {
        updatedBadges.push({
          ...heritageBadge,
          unlockedAt: Date.now()
        });
      }
    }

    // Award XP
    onAddXp(xpReward);

    // Save updated roadmap
    onUpdateRoadmap({
      ...roadmap,
      milestones: updatedMilestones,
      badges: updatedBadges
    });
  };

  return (
    <div className="relative min-h-screen py-6 px-4 md:px-8 max-w-4xl mx-auto overflow-hidden" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <ArabesquePattern className="opacity-[0.06] text-violet-950" />

      {/* Header section */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-2xl font-black text-violet-950 flex items-center justify-center gap-2 font-display">
          <Award className="w-7 h-7 text-amber-500 animate-pulse" />
          {t.journeyTitle}
        </h2>
        <p className="text-xs text-violet-900/50 mt-1.5 max-w-md mx-auto font-semibold">
          {t.journeySubtitle}
        </p>
        <ArabesqueBorder />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left/Main Column: Roadmap timeline */}
        <div className="lg:col-span-2 space-y-6">
          {milestones.length === 0 ? (
            <div className="glass-premium border border-white rounded-3xl p-8 text-center shadow-xl">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-bounce" />
              <p className="text-violet-950 font-black mb-2 font-display">No active roadmap generated.</p>
              <p className="text-xs text-violet-900/40 font-semibold">Please complete the onboarding assessment to receive your personalized route.</p>
            </div>
          ) : (
            <div className="relative border-l-2 md:border-l-4 border-dashed border-amber-300/40 pl-6 md:pl-10 space-y-8 py-2 mr-0 ml-4 rtl:border-l-0 rtl:pl-0 rtl:border-r-2 md:rtl:border-r-4 rtl:pr-6 md:rtl:pr-10">
              {milestones.map((milestone, idx) => {
                const isActive = milestone.status === "active";
                const isCompleted = milestone.status === "completed";
                const isLocked = milestone.status === "locked";

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Node Icon */}
                    <div className={`absolute top-0 -left-[37px] rtl:-right-[37px] w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-all z-20 ${
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-300 text-white" 
                        : isActive 
                        ? "bg-gradient-to-br from-violet-900 to-indigo-950 border-amber-400 text-amber-300 scale-110 ring-4 ring-amber-400/20 animate-pulse-gentle" 
                        : "bg-white/60 border-violet-100 text-violet-900/40"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Milestone Card */}
                    <div className={`rounded-3xl p-5 border transition-all duration-300 ${
                      isCompleted 
                        ? "bg-emerald-50/15 border-emerald-100/30 opacity-75 shadow-sm" 
                        : isActive 
                        ? "glass-premium border-amber-300 shadow-2xl ring-1 ring-amber-400/10 hover:scale-[1.01]" 
                        : "bg-white/40 border-violet-100/40 text-violet-900/40 opacity-60"
                    }`}>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-display ${
                          isCompleted 
                            ? "bg-emerald-100/60 text-emerald-800" 
                            : isActive 
                            ? "bg-violet-100/70 text-violet-800" 
                            : "bg-violet-50/40 text-violet-900/40"
                        }`}>
                          {t.milestone} {idx + 1} • {milestone.category}
                        </span>
                        <span className="text-amber-600 font-black font-mono text-xs">+{milestone.xpReward} XP</span>
                      </div>

                      <h3 className={`text-base font-black font-display ${isActive ? "text-violet-950" : "text-violet-950/60"}`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-xs leading-relaxed mt-1.5 font-semibold ${isActive ? "text-violet-900/70" : "text-violet-900/40"}`}>
                        {milestone.description}
                      </p>

                      {/* Call to Action for Active */}
                      {isActive && (
                        <div className="mt-5 flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUnlockNext(milestone.id)}
                            className="px-4.5 py-2.5 bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white font-bold rounded-xl text-xs border border-amber-400/25 shadow-lg shadow-violet-950/20 cursor-pointer flex items-center gap-1.5 transition-all premium-gradient-btn"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            {t.unlockMilestone}
                          </motion.button>
                        </div>
                      )}

                      {/* Status labels */}
                      {isCompleted && (
                        <div className="mt-3 text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.milestoneCompleted}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Badge shelf */}
        <div className="space-y-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-premium border border-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-[0.03]">
              <ElegantStar className="w-24 h-24 text-amber-500" />
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="text-base font-black text-violet-950 font-display">{t.badgeTitle}</h3>
            </div>
            <p className="text-xs text-violet-900/50 font-semibold mb-6">{t.badgeSubtitle}</p>

            {badges.length === 0 ? (
              <div className="p-6 bg-violet-50/20 border border-dashed border-violet-100 rounded-2xl text-center text-xs text-violet-900/40 font-semibold">
                {t.noBadges}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, borderColor: "#fbbf24", boxShadow: "0 10px 20px -10px rgba(245, 158, 11, 0.2)" }}
                    className="bg-gradient-to-br from-amber-50/40 via-white/80 to-white/40 border border-amber-200/35 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm relative group cursor-pointer transition-all"
                  >
                    <div className="text-3xl mb-2 filter drop-shadow animate-float group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <h4 className="text-xs font-black text-violet-950 truncate max-w-full font-display">
                      {badge.title[language] || badge.title.ar}
                    </h4>
                    <p className="text-[10px] text-violet-900/40 font-semibold leading-snug line-clamp-2 mt-1">
                      {badge.description[language] || badge.description.ar}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
