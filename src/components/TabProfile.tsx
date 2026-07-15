/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserState, Language } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ArabesqueBorder, ElegantStar } from "./ArabesquePattern";
import { 
  User, 
  Trophy, 
  Award, 
  Target, 
  Globe, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  FileText, 
  CheckCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  Flame,
  ArrowRight,
  LogOut
} from "lucide-react";

interface Props {
  state: UserState;
  onSetLanguage: (lang: Language) => void;
  onResetApp: () => void;
  onLogout?: () => void;
}

const avatars = [
  { id: "creative", emoji: "🎨", titleAr: "الـمُـفـكّـرة الـمُـبـدعـة", titleEn: "Creative Thinker", bg: "from-amber-400 to-yellow-600" },
  { id: "tech", emoji: "💻", titleAr: "رائــدة الـتـكـنـولـوجـيـا", titleEn: "Tech Pioneer", bg: "from-purple-600 to-indigo-950" },
  { id: "leader", emoji: "👑", titleAr: "الـقـائـدة الـمُـسـتـقـبـلـيـة", titleEn: "Future Leader", bg: "from-violet-900 to-purple-950" },
  { id: "science", emoji: "🌌", titleAr: "الـعـالـمـة الـمُـلـهـمـة", titleEn: "Inspiring Scientist", bg: "from-teal-600 to-cyan-900" }
];

export default function TabProfile({ state, onSetLanguage, onResetApp, onLogout }: Props) {
  const language = state.profile?.language || 'ar';
  const t = translations[language];
  const isRtl = language === 'ar';

  const profile = state.profile!;
  const roadmap = state.roadmap;

  const currentLevel = roadmap?.currentLevel || 1;
  const currentXp = roadmap?.totalXp || 100;
  const completedTasksCount = state.completedActions.length;
  const badgesEarnedCount = roadmap?.badges?.length || 0;

  const [selectedAvatar, setSelectedAvatar] = useState(avatars[1]);
  const [showCvModal, setShowCvModal] = useState(false);
  const [showCertificate, setShowCertificate] = useState<any | null>(null);

  const handleResetConfirm = () => {
    if (confirm(t.resetConfirm)) {
      onResetApp();
    }
  };

  // Generate dynamic Future CV milestones based on dream and interests
  const generateFutureCV = () => {
    const startYear = 2026;
    const targetYear = 2031;
    
    if (isRtl) {
      return {
        title: `ملف القيادة المستقبلية لعام ${targetYear} 🌸`,
        tagline: `رائدة أعمال متميزة ومبتكرة تسعى للتأثير الإيجابي وصناعة التغيير`,
        professionalSummary: `مخطط مهني مستقبلي تم تصميمه بالذكاء الاصطناعي لـ ${profile.name} بناءً على اهتمامها الكبير بـ (${profile.interests.join("، ")}) وحلمها الملهم بأن تصبح "${profile.dream}". يمثل هذا المستند خريطة طريق مهنية وتأثيرية طموحة ومحققة بإذن الله بحلول عام ${targetYear}.`,
        education: [
          { degree: `ماجستير القيادة والابتكار والحلول الذكية`, institution: `جامعة الملك عبد الله للعلوم والتقنية (أو ما يعادلها)`, year: "2030" },
          { degree: `بكالوريوس في التخصص الداعم لـ ${profile.dream}`, institution: `الجامعة الرائدة الوطنية للعلوم والتكنولوجيا`, year: "2028" }
        ],
        experience: [
          { role: `مؤسسة وقائدة مبادرة "تأثير ${profile.name}" للتطوير التكنولوجي والاجتماعي`, period: `2029 - مستمر`, desc: `قيادة فريق عمل إقليمي لتصميم وتنفيذ مبادرات مبتكرة تدعم رؤية تمكين الفتيات العربيات في مجالات العلوم وريادة الأعمال.` },
          { role: `مبتكرة وباحثة معتمدة في حلول ${profile.interests[0] || "التنمية الذكية"}`, period: `2027 - 2029`, desc: `تطوير أربعة مشاريع إبداعية متميزة حازت على جوائز ابتكار ريادية في الوطن العربي.` }
        ],
        achievements: [
          `الحصول على وسام "${roadmap?.badges?.[0]?.title?.ar || "بداية المجد"}" كأحد أفضل الكفاءات الشابة الواعدة في هويتي AI.`,
          `المشاركة كمتحدثة رئيسية في مؤتمر القيادة العربي للشباب لعرض قصة نجاحها في تحقيق حلم "${profile.dream}".`,
          `تصميم وإطلاق نظام ذكي يدعم المعرفة والتراث العربي ويوظفه في خدمة التنمية المستدامة.`
        ]
      };
    } else {
      return {
        title: `Future Leadership Portfolio — Year ${targetYear} 🌸`,
        tagline: `Distinguished pioneer dedicated to innovation, empowerment, and global influence`,
        professionalSummary: `An AI-projected professional profile curated for ${profile.name} based on her key interests in (${profile.interests.join(", ")}) and her inspiring dream of becoming "${profile.dream}". This represents her forecasted trajectory and developmental milestones successfully reached by ${targetYear}.`,
        education: [
          { degree: `M.Sc. in Innovation, Leadership & Applied Sciences`, institution: `Top Tier Global & Arab Universities`, year: "2030" },
          { degree: `B.Sc. in Field supporting "${profile.dream}"`, institution: `Prestigious Institute of Technology & Arts`, year: "2028" }
        ],
        experience: [
          { role: `Founder & Executive Director of "${profile.name} Growth Initiative"`, period: `2029 - Present`, desc: `Leading regional programs leveraging ${profile.interests[0] || "creative sciences"} to support next-generation developmental ecosystems across the Arab world.` },
          { role: `Lead Specialist & Innovation Fellow`, period: `2027 - 2029`, desc: `Authored three national award-winning youth papers on integration of modern technologies with cultural heritage preservation.` }
        ],
        achievements: [
          `Awarded the coveted "${roadmap?.badges?.[0]?.title?.en || "Dawn of Glory"}" badge by Huwiyati AI developmental program.`,
          `Featured in 'Arab Women in Science & Business' global journal as an influential future pioneer.`,
          `Successfully orchestrated a youth delegation to global leadership summits advocating for sustainable communities.`
        ]
      };
    }
  };

  const futureCv = generateFutureCV();

  // Get active or completed milestones to present as formal certificates
  const certMilestones = roadmap?.milestones?.filter(m => m.status === 'completed') || [];

  return (
    <div className="relative min-h-screen py-6 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden animate-fade-in" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <ArabesquePattern className="opacity-[0.03] text-indigo-950" />

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-2xl font-black text-violet-950 flex items-center justify-center gap-2 font-display">
          <User className="w-7 h-7 text-amber-500" />
          {t.profileTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          {isRtl ? "تتويج مسيرتكِ القيادية وإنجازاتكِ وتأطير طموحاتكِ" : "Celebrate your milestones, achievements, and future roadmap"}
        </p>
        <ArabesqueBorder />
      </div>

      {/* Top Banner: Interactive Avatar & Quick statistics */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Interactive Avatar Maker Column */}
        <motion.div 
          whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.12)" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-premium border border-white rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl"
        >
          <div className="absolute top-3 left-3">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>

          {/* Glowing Ring Avatar */}
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${selectedAvatar.bg} text-white flex items-center justify-center text-4xl shadow-lg ring-4 ring-amber-400/30 mb-4 transition-all duration-300 animate-float`}>
            <span>{selectedAvatar.emoji}</span>
            <div className="absolute -bottom-1 -right-1 bg-violet-950 text-white rounded-full p-1.5 border border-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>

          <h3 className="text-base font-black text-violet-950 mb-0.5">{profile.name}</h3>
          <span className="text-xs font-bold text-amber-700 bg-amber-50/80 px-3 py-1 rounded-full border border-amber-200/40 mb-4">
            {isRtl ? selectedAvatar.titleAr : selectedAvatar.titleEn}
          </span>

          {/* Avatar Options Picker */}
          <div className="flex gap-2.5 mt-2 bg-gray-50/75 p-2 rounded-2xl border border-gray-100">
            {avatars.map((av) => (
              <motion.button
                key={av.id}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAvatar(av)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all cursor-pointer ${
                  selectedAvatar.id === av.id ? "border-amber-400 bg-white shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {av.emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Statistics Column */}
        <motion.div 
          whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(109, 40, 217, 0.25)" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2 bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 md:p-8 border border-amber-400/20 shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <ArabesquePattern className="opacity-10 text-amber-400" />
          
          <div className="relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-3">
              👑 {isRtl ? "مؤشرات التميز المتراكمة" : "Excellence Metrics"}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <motion.div whileHover={{ scale: 1.04 }} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-amber-300 mx-auto mb-1 animate-wiggle" />
                <span className="text-[9px] text-violet-200 uppercase block">{t.statXp}</span>
                <span className="text-base font-black font-mono text-amber-300">{currentXp}</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                <Award className="w-5 h-5 text-violet-300 mx-auto mb-1" />
                <span className="text-[9px] text-violet-200 uppercase block">{t.statLevel}</span>
                <span className="text-base font-black text-white">{currentLevel}</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                <Target className="w-5 h-5 text-teal-300 mx-auto mb-1" />
                <span className="text-[9px] text-violet-200 uppercase block">{isRtl ? "مهمات منجزة" : "Completed"}</span>
                <span className="text-base font-black text-white">{completedTasksCount}</span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center backdrop-blur-sm">
                <Layers className="w-5 h-5 text-pink-300 mx-auto mb-1" />
                <span className="text-[9px] text-violet-200 uppercase block">{isRtl ? "أوسمة مستحقة" : "Badges"}</span>
                <span className="text-base font-black text-white">{badgesEarnedCount}</span>
              </motion.div>
            </div>
          </div>

          {/* Interactive Action: Generate CV */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-violet-200/80 leading-normal max-w-md text-center sm:text-right">
              {isRtl 
                ? "هل تودين رؤية مستقبلكِ المهني القيادي؟ دعي هويتي AI تصمم سيرتكِ الذاتية المبتكرة لعام 2031 الآن!"
                : "Want to visualize your professional leadership future? Generate your interactive AI Portfolio for Year 2031 now!"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCvModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-violet-950 font-bold rounded-2xl text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0 border border-amber-300/40"
            >
              <FileText className="w-4 h-4" />
              <span>{isRtl ? "توليد السيرة الذاتية لعام 2031" : "Generate 2031 AI CV"}</span>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Details, Certificates and Language Settings */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Profile details & Certificates list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity details Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-premium border border-white rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-base font-black text-violet-950 mb-6 flex items-center gap-2 border-b border-violet-100/40 pb-3 font-display">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              {t.personalDetails}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs md:text-sm">
              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.nameLabel}</span>
                <span className="font-extrabold text-violet-950 bg-white/70 px-3 py-2.5 rounded-xl block border border-violet-100/40 shadow-sm">{profile.name}</span>
              </div>

              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.ageLabel}</span>
                <span className="font-extrabold text-violet-950 bg-white/70 px-3 py-2.5 rounded-xl block border border-violet-100/40 shadow-sm">{profile.age}</span>
              </div>

              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.countryLabel}</span>
                <span className="font-extrabold text-violet-950 bg-white/70 px-3 py-2.5 rounded-xl block border border-violet-100/40 shadow-sm">{profile.country}</span>
              </div>

              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.educationLabel}</span>
                <span className="font-extrabold text-violet-950 bg-white/70 px-3 py-2.5 rounded-xl block border border-violet-100/40 shadow-sm">{profile.education}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-violet-900/40 block mb-1 font-bold">{t.dreamLabel}</span>
                <span className="font-extrabold text-violet-950 bg-gradient-to-r from-amber-50 to-amber-100/30 px-4 py-3 rounded-2xl block border border-amber-200/40 italic shadow-sm">
                  "{profile.dream}"
                </span>
              </div>

              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.skillsLabel}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.skills.map((s, i) => (
                    <motion.span 
                      whileHover={{ scale: 1.05 }} 
                      key={i} 
                      className="px-2.5 py-1 bg-violet-100/60 text-violet-900 border border-violet-100 rounded-full text-[10px] font-extrabold shadow-sm"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-violet-900/40 block mb-1 font-bold">{t.goalsLabel}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.goals.map((g, i) => (
                    <motion.span 
                      whileHover={{ scale: 1.05 }} 
                      key={i} 
                      className="px-2.5 py-1 bg-amber-50/80 text-amber-900 border border-amber-200/40 rounded-full text-[10px] font-extrabold shadow-sm"
                    >
                      {g}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active / Earned Certificates Shelf */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-premium border border-white rounded-3xl p-6 md:p-8 shadow-xl"
          >
            <h3 className="text-base font-black text-violet-950 mb-4 flex items-center gap-2 font-display">
              <Award className="w-5 h-5 text-amber-500" />
              {isRtl ? "لوحة الشهادات والاعتمادات القيادية" : "My Leadership Certificates & Credentials"}
            </h3>
            <p className="text-xs text-violet-900/50 mb-6 font-semibold">
              {isRtl 
                ? "تُمنح هذه الشهادات والاعتمادات تقديراً لاجتيازكِ بنجاح مراحل خريطة طريقكِ القيادية بالذكاء الاصطناعي." 
                : "These verified micro-credentials recognize your successful progression on your AI Roadmap."}
            </p>

            {certMilestones.length === 0 ? (
              <div className="p-8 bg-white/40 border border-dashed border-violet-100/60 rounded-2xl text-center text-xs text-violet-900/40 font-bold shadow-inner">
                {isRtl 
                  ? "أكملي المرحلة الأولى في خريطة طريقكِ (من علامة تبويب رحلتي) لتحصلي على أول شهادة اعتماد موثقة! 🎓"
                  : "Complete your first milestone (in Journey tab) to earn your first certified credential! 🎓"}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certMilestones.map((m: any, idx: number) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2, borderColor: "#fbbf24" }}
                    whileTap={{ scale: 0.98 }}
                    key={m.id}
                    onClick={() => setShowCertificate(m)}
                    className="bg-white/80 border border-amber-200/40 p-4 rounded-2xl shadow-sm transition-all cursor-pointer flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100/60 text-amber-700 p-2.5 rounded-xl group-hover:scale-105 transition-transform">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-violet-950 line-clamp-1 font-display">{m.title}</h4>
                        <span className="text-[9px] text-emerald-600 font-extrabold block mt-0.5">✓ {isRtl ? "مكتملة ومصدقة" : "Verified & Earned"}</span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-violet-900/40 group-hover:translate-x-1 transition-transform ${isRtl ? "rotate-180" : ""}`} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>

        {/* Right Column: App Settings / Language switcher / Hard reset */}
        <div className="space-y-6">
          
          {/* Settings Panel */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-premium border border-white rounded-3xl p-6 shadow-xl"
          >
            <h3 className="text-base font-black text-violet-950 mb-4 flex items-center gap-2 border-b border-violet-100/40 pb-3 font-display">
              <Globe className="w-5 h-5 text-amber-500" />
              {isRtl ? "اللغة والمظهر" : "Language & Settings"}
            </h3>

            {/* Language Selection Row */}
            <div className="space-y-2 mt-4">
              {[
                { code: 'ar', label: t.langAr },
                { code: 'en', label: t.langEn },
                { code: 'fr', label: t.langFr }
              ].map((lang) => {
                const isActive = language === lang.code;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={lang.code}
                    onClick={() => onSetLanguage(lang.code as Language)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isActive 
                        ? "border-amber-400 bg-violet-950 text-white font-bold shadow-md" 
                        : "border-violet-100 bg-white/70 text-gray-600 hover:bg-gray-100/80"
                    }`}
                  >
                    <span className="text-xs font-bold">{lang.label}</span>
                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="border-t border-violet-100/40 my-6" />

            {/* Log Out Trigger */}
            {onLogout && (
              <div className="mb-6">
                <p className="text-[10px] text-violet-900/50 leading-relaxed mb-4 font-semibold">
                  {isRtl 
                    ? "لتسجيل الخروج بأمان والعودة لاحقاً لمتابعة رحلتك القيادية مع سَنا."
                    : "Log out safely to pause your learning session and return later."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(124, 58, 237, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onLogout}
                  className="w-full py-3.5 bg-violet-50 hover:bg-violet-100/80 text-violet-900 font-extrabold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-violet-100 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRtl ? "تسجيل الخروج من الحساب" : "Log Out from Account"}</span>
                </motion.button>
              </div>
            )}

            {/* Reset App Trigger */}
            <div>
              <p className="text-[10px] text-violet-900/50 leading-relaxed mb-4 font-semibold">
                {isRtl 
                  ? "إعادة ضبط التطبيق ستؤدي لمسح خريطة الطريق الحالية، السيرة الذاتية، وإعادة البدء مع سَنا مجدداً."
                  : "Resetting will clear your generated roadmap, certificate data, and welcome chats."}
              </p>
              <button
                onClick={handleResetConfirm}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-rose-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.resetApp}</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 2031 DYNAMIC AI CV MODAL OVERLAY */}
      <AnimatePresence>
        {showCvModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-violet-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#faf9f6] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-amber-300"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {/* Modal Top bar */}
              <div className="bg-violet-950 text-white px-6 py-4 flex justify-between items-center border-b border-amber-400/20 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold">{isRtl ? "سيرتكِ الذاتية المبتكرة للمستقبل" : "Your Dynamic AI Future Portfolio"}</h3>
                </div>
                <button 
                  onClick={() => setShowCvModal(false)}
                  className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                >
                  {isRtl ? "إغلاق" : "Close"}
                </button>
              </div>

              {/* CV Document Content */}
              <div className="p-6 md:p-10 overflow-y-auto flex-1 space-y-8 text-violet-950">
                <div className="border-2 border-amber-300/40 p-6 md:p-8 bg-white rounded-2xl relative overflow-hidden shadow-sm">
                  <ArabesquePattern className="opacity-[0.03] text-amber-500" />
                  
                  {/* Top Branding Frame */}
                  <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                    <div>
                      <h4 className="text-2xl font-black tracking-tight text-violet-950 font-display">{profile.name}</h4>
                      <p className="text-xs text-amber-600 font-bold mt-1 uppercase tracking-wide">
                        {isRtl ? selectedAvatar.titleAr : selectedAvatar.titleEn}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile.country}</span>
                      </p>
                    </div>

                    <div className="text-center bg-violet-950 text-white py-2 px-3 rounded-xl border border-amber-400">
                      <span className="text-[8px] uppercase tracking-wider block text-amber-300 leading-none">PROJECTED YEAR</span>
                      <span className="text-xl font-black font-sans leading-none">2031</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <h5 className="text-xs uppercase font-bold text-amber-600 tracking-wider">
                      {isRtl ? "نبذة مهنية قيادية" : "Professional Slogan & Impact"}
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      "{futureCv.professionalSummary}"
                    </p>
                  </div>

                  <div className="border-t border-gray-100 my-6" />

                  {/* Experience Grid */}
                  <div className="space-y-4">
                    <h5 className="text-xs uppercase font-bold text-amber-600 tracking-wider flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      {isRtl ? "الخبرات والابتكارات العملية (2026 - 2031)" : "Experience & Innovations"}
                    </h5>
                    
                    <div className="space-y-4">
                      {futureCv.experience.map((exp, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex justify-between font-bold text-violet-950 mb-1">
                            <span>{exp.role}</span>
                            <span className="text-gray-400 font-mono text-[10px]">{exp.period}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            {exp.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-6" />

                  {/* Education Grid */}
                  <div className="space-y-4">
                    <h5 className="text-xs uppercase font-bold text-amber-600 tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-amber-500" />
                      {isRtl ? "التعليم الأكاديمي والشهادات" : "Education & Academic Honors"}
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {futureCv.education.map((edu, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="font-bold text-violet-950 block">{edu.degree}</span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">{edu.institution}</span>
                          <span className="text-[9px] text-amber-600 font-bold block mt-1">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-6" />

                  {/* Key Projected Achievements */}
                  <div className="space-y-2">
                    <h5 className="text-xs uppercase font-bold text-amber-600 tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-amber-500" />
                      {isRtl ? "إنجازات قيادية مصدقة بالذكاء الاصطناعي" : "AI-Projected Milestones"}
                    </h5>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600 pl-2 rtl:pl-0 rtl:pr-2 leading-relaxed">
                      {futureCv.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 mt-8 pt-4 flex justify-between items-center text-[9px] text-gray-400">
                    <span>Huwiyati AI Future Credentials Engine © 2026 - 2031</span>
                    <span className="text-amber-500 font-bold uppercase tracking-wider">PREMIUM VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* CV Action Bar */}
              <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-gray-400">{isRtl ? "تم إعداده خصيصاً لمشاركتكِ الطموحة." : "Generated exclusively for your journey."}</span>
                <button
                  onClick={() => alert(isRtl ? "تم تجهيز المستند للطباعة بنجاح! 🌸" : "Document ready for PDF export! 🌸")}
                  className="px-4 py-2 bg-gradient-to-r from-violet-900 to-indigo-950 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all cursor-pointer flex items-center gap-1.5 shadow border border-amber-400/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isRtl ? "طباعة أو تصدير PDF" : "Print / PDF Export"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED EARNED CERTIFICATE DIALOG */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-violet-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-amber-300 text-center"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <ArabesquePattern className="opacity-10 text-amber-500" />
              
              <div className="relative z-10 space-y-6">
                {/* Certificate Frame/Seal */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-amber-200/50 shadow-md">
                    <ElegantStar className="w-8 h-8 text-white animate-spin-slow" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest block">CERTIFICATE OF RECOGNITION</span>
                  <h3 className="text-xl font-black text-violet-950 font-display">{isRtl ? "شهادة اجتياز وتميز قيادي" : "Leadership Accomplishment"}</h3>
                  <p className="text-[10px] text-gray-400">Huwiyati AI Personalized Growth Pathway</p>
                </div>

                <div className="border-t border-amber-200/40 my-4" />

                <p className="text-xs text-gray-600 leading-relaxed px-4">
                  {isRtl 
                    ? `تُشهد مرشدة الذكاء الاصطناعي "سَنا" بفخر بأن الفتاة الطموحة الرائدة `
                    : `This official micro-credential confirms that the outstanding scholar `}
                  <strong className="text-violet-950 block text-sm font-black my-2 underline decoration-amber-400 decoration-2">{profile.name}</strong>
                  {isRtl 
                    ? `قد اجتازت بنجاح كامل متطلبات ومهام المرحلة المتميزة:`
                    : `has successfully accomplished all challenges and requirements of:`}
                  <strong className="text-amber-700 block text-xs font-bold my-1">"{showCertificate.title}" ({showCertificate.category})</strong>
                  {isRtl 
                    ? `وأثبتت جدارة ومبادرة وشجاعة تستحق عليها هذا الاعتماد لتمكين هويتها ومهاراتها.`
                    : `demonstrating exceptional leadership initiative, courage, and commitment to personal growth.`}
                </p>

                <div className="border-t border-amber-200/40 my-4" />

                <div className="flex justify-between items-center text-[10px] text-gray-400 px-4">
                  <div className="text-right">
                    <span className="block">{isRtl ? "التوقيع:" : "Signature:"}</span>
                    <span className="font-bold text-amber-600 italic">سَنا | Sana AI Mentor</span>
                  </div>
                  <div>
                    <span className="block">{isRtl ? "التاريخ:" : "Date:"}</span>
                    <span className="font-bold text-violet-950 font-mono">{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => alert(isRtl ? "تم إرسال نسخة من الشهادة لبريدكِ بنجاح!" : "Certificate shared to your email!")}
                    className="flex-1 py-3 bg-gradient-to-r from-violet-900 to-indigo-950 border border-amber-400/20 text-white font-bold rounded-2xl text-xs hover:opacity-95 cursor-pointer shadow transition-all"
                  >
                    {isRtl ? "مشاركة الشهادة الموثقة" : "Share Certificate"}
                  </button>
                  <button 
                    onClick={() => setShowCertificate(null)}
                    className="py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl text-xs cursor-pointer transition-all"
                  >
                    {isRtl ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

