/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserState, DailyContent } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ElegantStar } from "./ArabesquePattern";
import { 
  Sparkles, 
  Trophy, 
  Flame, 
  PenTool, 
  CheckCircle, 
  Award, 
  GraduationCap, 
  Heart, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Briefcase
} from "lucide-react";

interface Props {
  state: UserState;
  onCompleteAction: (actionKey: string, xpReward: number) => void;
  onSetTab: (tab: 'home' | 'mentor' | 'journey' | 'discover' | 'profile') => void;
}

const customHomeTranslations: any = {
  ar: {
    sanaTagline: "مرشدتكِ سَنا ممتنة لمرافقتكِ اليوم 🌸",
    growthTitle: "مؤشر تقدمكِ القيادي والشخصي",
    growthSub: "مسيرتكِ التراكمية في هويتي AI",
    levelUpNotice: "رائع! اقتربتِ من المستوى التالي ✨",
    missionTitle: "مهمة التميز اليومية",
    challengeTitle: "تحدي الشجاعة والمبادرة",
    inspiringWoman: "قدوة ملهمة من تاريخنا المشرق",
    newOpportunity: "فرصة تنموية موجهة لكِ",
    claimRewardBtn: "أكملت المهمة! احصلي على المكافأة 🎉",
    challengeBtn: "تجاوزت التحدي! سجلي إنجازكِ ✨",
    reflectSuccess: "تم حفظ تأملكِ اليوم بنجاح وذكاء!",
    badgeCount: "الأوسمة الحاصلة عليها"
  },
  en: {
    sanaTagline: "Sana is here with you today 🌸",
    growthTitle: "Your Growth & Excellence Progress",
    growthSub: "Your cumulative milestones in Huwiyati AI",
    levelUpNotice: "Excellent! You are close to the next level ✨",
    missionTitle: "Today's Signature Mission",
    challengeTitle: "Daily Courage Challenge",
    inspiringWoman: "Inspiring Historical Role Model",
    newOpportunity: "Developmental Opportunity for You",
    claimRewardBtn: "Claim Milestone Reward 🎉",
    challengeBtn: "Unlock Challenge Accomplishment ✨",
    reflectSuccess: "Reflection saved beautifully!",
    badgeCount: "Earned Badges"
  },
  fr: {
    sanaTagline: "Sana est à tes côtés aujourd'hui 🌸",
    growthTitle: "Votre Progression de Croissance",
    growthSub: "Vos jalons accumulés dans Huwiyati AI",
    levelUpNotice: "Excellent ! Tu es proche du niveau suivant ✨",
    missionTitle: "Mission Signature du Jour",
    challengeTitle: "Défi Quotidien de Courage",
    inspiringWoman: "Modèle Historique Inspirant",
    newOpportunity: "Opportunité de Développement",
    claimRewardBtn: "Réclamer la récompense 🎉",
    challengeBtn: "Valider la réussite du défi ✨",
    reflectSuccess: "Réflexion enregistrée avec succès !",
    badgeCount: "Badges Obtenus"
  }
};

export default function TabHome({ state, onCompleteAction, onSetTab }: Props) {
  const language = state.profile?.language || 'ar';
  const t = translations[language];
  const cht = customHomeTranslations[language] || customHomeTranslations['ar'];
  const isRtl = language === 'ar';

  const [reflectionInput, setReflectionInput] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const profile = state.profile!;
  const daily: DailyContent | null = state.dailyContent;

  const currentLevel = state.roadmap?.currentLevel || 1;
  const currentXp = state.roadmap?.totalXp || 100;
  const xpThreshold = currentLevel * 500;
  const progressPercent = Math.min(100, Math.floor((currentXp / xpThreshold) * 100));

  const isMissionCompleted = state.completedActions.includes(`mission_${daily?.date}`);
  const isChallengeCompleted = state.completedActions.includes(`challenge_${daily?.date}`);
  const isReflectionCompleted = state.completedActions.includes(`reflection_${daily?.date}`);

  const handleSaveReflection = () => {
    if (!reflectionInput.trim()) return;
    onCompleteAction(`reflection_${daily?.date}`, 75);
    setReflectionSaved(true);
  };

  const activeMilestone = state.roadmap?.milestones?.find(m => m.status === 'active');
  const unlockedBadgesCount = state.roadmap?.badges?.length || 0;

  // Personalized dynamic Greeting based on time
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (isRtl) {
      if (hour < 12) return "صباح الخير";
      return "مساء الخير";
    } else {
      if (hour < 12) return "Good morning";
      return "Good evening";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen py-6 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      <ArabesquePattern className="opacity-[0.06] text-violet-950" />

      {/* Premium ambient glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-rose-200/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-violet-200/20 rounded-full blur-[120px] pointer-events-none animate-float" />

      {/* 1. PERSONALIZED LUXURY GREETING & ALIVE SANA PRESENCE */}
      <motion.div 
        whileHover={{ y: -4, boxShadow: "0 30px 60px -15px rgba(109, 40, 217, 0.22)" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950 border border-amber-400/25 text-white p-7 md:p-9 rounded-3xl shadow-2xl shadow-violet-950/20 overflow-hidden mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        <ArabesquePattern className="opacity-[0.12] text-amber-300" />
        
        {/* Subtle decorative background gradient circles */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-teal-500/15 rounded-full blur-2xl" />

        {/* User Info & Mentor status */}
        <div className="relative z-10 text-center md:text-right flex-1">
          <div className="flex items-center gap-2 justify-center md:justify-start text-amber-300 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-sans font-extrabold tracking-wide">{cht.sanaTagline}</span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-black tracking-tight text-white mb-2.5 font-display leading-tight">
            {getGreeting()}، <span className="text-amber-300">{profile.name}</span> 🌸
          </h1>
          <p className="text-xs md:text-sm text-violet-100/90 leading-relaxed max-w-xl font-medium">
            {isRtl 
              ? `أهلاً بكِ في مساحتكِ الشخصية للتنمية والتأثير. اليوم فرصة رائعة للعمل على حلمكِ المشرق لتكوني "${profile.dream}".` 
              : `Welcome to your personal growth space. Today is a beautiful opportunity to advance your dream of becoming "${profile.dream}".`}
          </p>
        </div>

        {/* Sana Visual Avatar Interaction (Alive glowing orb with premium hover) */}
        <motion.div 
          whileHover={{ scale: 1.05, borderColor: "rgba(251, 191, 36, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSetTab('mentor')}
          className="relative z-10 bg-white/5 border border-white/10 p-4.5 rounded-2xl flex items-center gap-4.5 cursor-pointer hover:bg-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-inner shrink-0 group"
        >
          <div className="relative w-14 h-14 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-violet-950 shadow-lg border border-white/20">
            <ElegantStar className="w-7 h-7 text-white animate-spin-slow group-hover:scale-110 transition-transform duration-350" />
            <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
          </div>
          <div className="text-right">
            <h4 className="text-sm font-black text-amber-300 font-display">سَنا | Sana AI</h4>
            <p className="text-[10px] text-violet-200/90 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isRtl ? "تستمع لكِ الآن بشغف" : "Listening to you with care"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. MAIN BENTO GRID ARCHITECTURE (GROWTH, MISSIONS, HIGHLIGHTS) */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        
        {/* CARD A: PERSONAL GROWTH PROGRESS (Level, XP, Badges) */}
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.12)" }}
          className="lg:col-span-1 glass-premium rounded-3xl p-6 shadow-xl border border-white relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -top-10 -left-10 opacity-[0.04]">
            <Trophy className="w-32 h-32 text-amber-600" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-violet-950 font-black text-xs uppercase mb-1">
              <Trophy className="w-4 h-4 text-amber-600 shrink-0 animate-wiggle" />
              <span className="font-display">{cht.growthTitle}</span>
            </div>
            <p className="text-[11px] text-violet-900/50 mb-4 font-sans font-semibold">{cht.growthSub}</p>

            {/* Level badge and percentage circle */}
            <div className="flex items-center gap-5 bg-gradient-to-br from-violet-50/70 to-indigo-50/30 border border-violet-100/50 p-4 rounded-2xl mb-4">
              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-full flex flex-col items-center justify-center border-2 border-amber-400 shadow shadow-violet-950/20 shrink-0">
                <span className="text-[9px] font-bold text-amber-300 uppercase leading-none">{t.level}</span>
                <span className="text-xl font-black leading-tight font-sans mt-0.5">{currentLevel}</span>
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between font-bold text-violet-950 mb-1.5">
                  <span className="text-violet-900">{progressPercent}% {t.progressCircle}</span>
                  <span className="font-sans text-violet-900/70">{currentXp}/{xpThreshold} XP</span>
                </div>
                <div className="w-full bg-violet-100/40 rounded-full h-2 overflow-hidden border border-violet-200/10">
                  <div 
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Badges and milestone snippet */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-violet-900/70 font-semibold">
                <span>{cht.badgeCount}:</span>
                <span className="font-bold text-violet-900 bg-violet-100/60 border border-violet-200/25 px-2.5 py-0.5 rounded-full">{unlockedBadgesCount} / 5</span>
              </div>
              
              {activeMilestone && (
                <div className="bg-amber-50/65 border border-amber-200/30 p-3 rounded-xl flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 block leading-none">{isRtl ? "الخطوة النشطة" : "Active step"}</span>
                    <span className="text-[11px] font-bold text-violet-950 line-clamp-1 mt-0.5">{activeMilestone.title}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSetTab('journey')}
            className="w-full py-3.5 mt-6 bg-gradient-to-r from-violet-900 to-indigo-950 text-white text-xs font-bold rounded-2xl hover:opacity-95 shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-amber-400/20"
          >
            <span>{isRtl ? "تصفح خريطة الطريق كاملة" : "View Entire Roadmap"}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
          </motion.button>
        </motion.div>

        {/* CARD B: TODAY'S SIGNATURE MISSION */}
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.12)" }}
          className="lg:col-span-1 glass-premium rounded-3xl p-6 shadow-xl border border-white relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 opacity-[0.03]">
            <Award className="w-24 h-24 text-violet-950" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] uppercase font-bold text-violet-900 bg-violet-100/60 px-3 py-1 rounded-full border border-violet-200/35">
                📌 {cht.missionTitle}
              </span>
              <span className="text-emerald-600 text-xs font-bold font-sans">+{daily?.mission.xpReward || 150} XP</span>
            </div>

            <h3 className="text-base font-black text-violet-950 mb-2 font-display">
              {daily?.mission.title || (isRtl ? "تخطيط أولى الخطوات" : "Planning first steps")}
            </h3>
            <p className="text-xs text-violet-900/60 font-medium leading-relaxed mb-4">
              {daily?.mission.description || (isRtl ? "اكتبي ثلاثة أهداف داعمة لحلمكِ اليوم لعرضها على سَنا." : "Write 3 key milestones.")}
            </p>

            <div className="bg-violet-50/60 p-3 rounded-xl border border-violet-100/30 mb-2">
              <span className="text-[9px] uppercase font-bold text-violet-900/40 block">{isRtl ? "الفئة المستهدفة" : "Category"}</span>
              <span className="text-xs font-bold text-violet-900">{daily?.mission.category || "Self Growth"}</span>
            </div>
          </div>

          <div className="mt-4">
            {isMissionCompleted ? (
              <div className="flex items-center justify-center py-3.5 bg-emerald-50 border border-emerald-200/50 rounded-2xl text-emerald-700 text-xs font-bold gap-2 shadow-inner">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{t.completedAction}</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCompleteAction(`mission_${daily?.date}`, daily?.mission.xpReward || 150)}
                className="w-full py-3.5 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg premium-gradient-btn border border-amber-400/25"
              >
                <span>{cht.claimRewardBtn}</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* CARD C: DAILY COURAGE CHALLENGE */}
        <motion.div 
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.12)" }}
          className="lg:col-span-1 glass-premium rounded-3xl p-6 shadow-xl border border-white relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-4 right-4 opacity-[0.03]">
            <Flame className="w-24 h-24 text-amber-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-100">
                🔥 {cht.challengeTitle}
              </span>
              <span className="text-amber-600 text-xs font-bold font-sans">+{daily?.challenge.xpReward || 200} XP</span>
            </div>

            <h3 className="text-base font-black text-violet-950 mb-2 font-display">
              {daily?.challenge.title || (isRtl ? "تحدي الشجاعة الإلقائية" : "Speech Courage Challenge")}
            </h3>
            <p className="text-xs text-violet-900/60 font-medium leading-relaxed mb-6">
              {daily?.challenge.description || (isRtl ? "سجلي فكرة حلمكِ بثقة تامة أمام المرشدة." : "Pitch your dream.")}
            </p>
          </div>

          <div className="mt-4">
            {isChallengeCompleted ? (
              <div className="flex items-center justify-center py-3.5 bg-emerald-50 border border-emerald-200/50 rounded-2xl text-emerald-700 text-xs font-bold gap-2 shadow-inner">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{t.completedAction}</span>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCompleteAction(`challenge_${daily?.date}`, daily?.challenge.xpReward || 200)}
                className="w-full py-3.5 text-white text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg premium-gradient-btn border border-amber-400/25"
              >
                <span>{cht.challengeBtn}</span>
              </motion.button>
            )}
          </div>
        </motion.div>

      </div>

      {/* 3. HIGHLIGHTS & REFLECTION GRID */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        
        {/* CARD D: INSPIRING WOMAN */}
        {daily?.inspiringStory && (
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.15)", borderColor: "#f59e0b" }}
            onClick={() => onSetTab('discover')}
            className="lg:col-span-1 bg-gradient-to-br from-amber-50/80 to-amber-100/20 border border-amber-200/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group relative overflow-hidden hover:shadow-lg"
          >
            <ElegantStar className="absolute top-2 left-2 w-12 h-12 text-amber-500/10" />
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 block mb-2 tracking-wider">
                🌟 {cht.inspiringWoman}
              </span>
              <h4 className="font-extrabold text-violet-950 text-base mb-1.5 flex items-center gap-1.5 font-display">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {daily.inspiringStory.womanName}
              </h4>
              <p className="text-[11px] text-gray-400 mb-3 font-sans font-medium">{daily.inspiringStory.era}</p>
              <p className="text-xs text-violet-950 font-medium leading-relaxed italic line-clamp-4">
                "{daily.inspiringStory.content}"
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] font-extrabold text-violet-900 pt-3 border-t border-amber-200/30">
              <span>{isRtl ? "اقرئي قصتها العظيمة كاملة" : "Read Full Story"}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 ${isRtl ? "rotate-180" : ""}`} />
            </div>
          </motion.div>
        )}

        {/* CARD E: NEW OPPORTUNITY */}
        {daily?.opportunity && (
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.15)", borderColor: "#14b8a6" }}
            onClick={() => onSetTab('discover')}
            className="lg:col-span-1 bg-gradient-to-br from-teal-50/80 to-emerald-50/20 border border-teal-200/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 shadow-md flex flex-col justify-between group relative overflow-hidden hover:shadow-lg"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <GraduationCap className="w-16 h-16 text-teal-600" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-800 block mb-2 tracking-wider">
                🎓 {cht.newOpportunity}
              </span>
              <h4 className="font-extrabold text-violet-950 text-base mb-1.5 flex items-center gap-1.5 font-display">
                <Briefcase className="w-4 h-4 text-teal-600" />
                {daily.opportunity.title}
              </h4>
              <p className="text-[11px] text-teal-600 font-extrabold mb-3 font-sans">{daily.opportunity.type}</p>
              <p className="text-xs text-violet-950 font-medium leading-relaxed line-clamp-4">
                {daily.opportunity.description}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center text-[10px] font-extrabold text-teal-900 pt-3 border-t border-teal-200/30">
              <span>{isRtl ? "استكشفي تفاصيل الفرصة" : "Explore Opportunity"}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 ${isRtl ? "rotate-180" : ""}`} />
            </div>
          </motion.div>
        )}

        {/* CARD F: EVENING REFLECTION JOURNAL */}
        {daily?.reflection && (
          <motion.div 
            whileHover={{ y: -5 }}
            className={`lg:col-span-1 relative rounded-3xl p-6 border shadow-xl flex flex-col justify-between backdrop-blur-md ${
              isReflectionCompleted ? "bg-emerald-50/50 border-emerald-200" : "glass-premium border-white"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900 mb-2">
                <PenTool className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-display">{t.eveningReflection}</span>
              </div>
              <p className="text-xs text-violet-950 font-bold leading-relaxed mb-3">
                {daily.reflection}
              </p>

              {!isReflectionCompleted && (
                <textarea
                  rows={2}
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder={isRtl ? "اكتبي مشاعركِ أو تأملكِ للمساء هنا..." : "Write your thoughts here..."}
                  className="w-full px-3.5 py-2.5 border border-violet-200/50 bg-white/70 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-800 resize-none text-right"
                />
              )}
            </div>

            <div className="mt-4">
              {isReflectionCompleted ? (
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold py-2 shadow-inner bg-emerald-50/40 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  <span>{cht.reflectSuccess} (+75 XP)</span>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveReflection}
                  disabled={!reflectionInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-violet-900 to-indigo-950 text-white font-bold rounded-2xl text-xs hover:opacity-95 border border-amber-400/20 transition-all cursor-pointer disabled:opacity-40"
                >
                  {t.submitReflection}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

      </div>

    </motion.div>
  );
}
