/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserState } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ArabesqueBorder, ElegantStar } from "./ArabesquePattern";
import { Sparkles, Library, Award, Compass, Star, Calendar, ArrowUpRight } from "lucide-react";

interface Props {
  state: UserState;
}

export default function TabDiscover({ state }: Props) {
  const language = state.profile?.language || 'ar';
  const t = translations[language];
  const isRtl = language === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'women' | 'heritage' | 'opportunities'>('women');

  const daily = state.dailyContent;

  // Rich static fallback assets for Arab women
  const fallbackWomen = [
    {
      name: { ar: "فاطمة الفهرية", en: "Fatima al-Fihri", fr: "Fatima al-Fihri" },
      era: { ar: "القرن التاسع الميلادي", en: "9th Century", fr: "9ème Siècle" },
      achieve: {
        ar: "مؤسسة جامعة القرويين في المغرب، أقدم جامعة مستمرة ومستقلة للتعليم العالي في العالم.",
        en: "Founder of University of al-Qarawiyyin in Morocco, the world's oldest continuously operating university.",
        fr: "Fondatrice de l'Université Al-Qarawiyyin au Maroc, la plus ancienne université au monde."
      },
      image: "🎓"
    },
    {
      name: { ar: "زها حديد", en: "Zaha Hadid", fr: "Zaha Hadid" },
      era: { ar: "العصر الحديث", en: "Modern Era", fr: "Ère Moderne" },
      achieve: {
        ar: "واحدة من أعظم مهندسي المعمار في العالم، وأول امرأة تفوز بجائزة بريتزكر المرموقة.",
        en: "One of the greatest modern architects, and the first woman to win the prestigious Pritzker Architecture Prize.",
        fr: "L'une des plus grandes architectes modernes, première femme à remporter le prix Pritzker."
      },
      image: "📐"
    },
    {
      name: { ar: "مريم شديد", en: "Meriem Chadid", fr: "Meriem Chadid" },
      era: { ar: "العصر الحديث", en: "Modern Era", fr: "Ère Moderne" },
      achieve: {
        ar: "عالمة فلك ومستكشفة مغربية، كانت أول عالمة عربية تصل إلى القطب الجنوبي لتركيب مرصد تلسكوبي.",
        en: "Moroccan astronomer and explorer. First Arab scientist to reach Antarctica to install a telescopic observatory.",
        fr: "Astronome et exploratrice marocaine. Première scientifique arabe en Antarctique pour installer un observatoire."
      },
      image: "🌌"
    }
  ];

  // Rich static fallback assets for Arab heritage
  const fallbackHeritage = [
    {
      title: { ar: "علم الجبر - الخوارزمي", en: "Algebra - Al-Khwarizmi", fr: "L'Algèbre - Al-Khwarizmi" },
      significance: { ar: "ثورة في الرياضيات", en: "Mathematical Revolution", fr: "Révolution Mathématique" },
      desc: {
        ar: "طور العالم العربي محمد بن موسى الخوارزمي علم الجبر كعلم مستقل، وهو الاسم المشتق من كتابه 'الكتاب المختصر في حساب الجبر والمقابلة'. كما اشتق مفهوم الخوارزميات من اسمه نفسه.",
        en: "Developed by the Arab scientist Al-Khwarizmi, algebra revolutionized mathematics. The term 'algorithm' is derived directly from his Latinized name.",
        fr: "Développé par le savant arabe Al-Khwarizmi. Le mot algèbre vient de son ouvrage, et 'algorithme' dérive de son propre nom."
      },
      icon: "🧮"
    },
    {
      title: { ar: "علم البصريات - ابن الهيثم", en: "Optics - Ibn al-Haytham", fr: "Optique - Ibn al-Haytham" },
      significance: { ar: "المنهج العلمي الحديث", en: "Modern Scientific Method", fr: "Méthode Scientifique Moderne" },
      desc: {
        ar: "أثبت العالم الحسن بن الهيثم أن الضوء ينعكس من الأشياء إلى العينين، واضعاً أسس اختراع الكاميرا عبر 'الغرفة المظلمة' وممهداً الطريق للمنهج العلمي التجريبي.",
        en: "Ibn al-Haytham proved that light reflects from objects into the eyes, founding modern optics, inventing the camera obscura (Al-Bayt al-Muzlim), and establishing the experimental method.",
        fr: "Ibn al-Haytham a prouvé que la lumière se reflète sur les objets vers les yeux, fondant l'optique moderne et inventant la chambre noire."
      },
      icon: "👁️"
    }
  ];

  // Rich static fallback opportunities
  const fallbackOpportunities = [
    {
      title: { ar: "ورشة ريادة الأعمال للفتيات العربيات", en: "Arab Girls Entrepreneurship Workshop", fr: "Atelier Entrepreneuriat pour Filles Arabes" },
      type: { ar: "ورشة تدريبية", en: "Training Workshop", fr: "Atelier de formation" },
      desc: {
        ar: "برنامج تدريبي مخصص لتعليم الفتيات أساسيات التخطيط للمشاريع وبناء نموذج العمل القيادي.",
        en: "A customized training program to teach young women project planning and leadership business models.",
        fr: "Un programme de formation pour enseigner la planification de projets et les modèles d'affaires."
      },
      actionText: { ar: "سجلي اهتمامكِ", en: "Register Interest", fr: "S'inscrire" }
    },
    {
      title: { ar: "منحة هويتي للبرمجة والذكاء الاصطناعي", en: "Huwiyati Coding & AI Scholarship", fr: "Bourse de Codage & IA Huwiyati" },
      type: { ar: "منحة تعليمية", en: "Educational Scholarship", fr: "Bourse éducative" },
      desc: {
        ar: "منحة كاملة تمنح للفتيات المميزات من جميع الدول العربية لتلقي تدريب معتمد في البرمجيات.",
        en: "A full scholarship awarded to outstanding young Arab women for certified training in software engineering.",
        fr: "Une bourse complète attribuée aux filles arabes pour une formation certifiée en ingénierie logicielle."
      },
      actionText: { ar: "قدمي الآن", en: "Apply Now", fr: "Postuler" }
    }
  ];

  return (
    <div className="relative min-h-screen py-6 px-4 md:px-8 max-w-4xl mx-auto overflow-hidden" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <ArabesquePattern className="opacity-[0.06] text-violet-950" />

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h2 className="text-2xl font-black text-violet-950 flex items-center justify-center gap-2 font-display">
          <Compass className="w-7 h-7 text-amber-500 animate-pulse" />
          {t.discoverTitle}
        </h2>
        <p className="text-xs text-violet-900/50 mt-1.5 max-w-md mx-auto font-semibold">
          {t.discoverSubtitle}
        </p>
        <ArabesqueBorder />
      </div>

      {/* Sub-tab selection menu */}
      <div className="relative z-10 flex border border-violet-200/40 bg-white/60 p-1.5 rounded-2xl mb-8 max-w-md mx-auto shadow-inner">
        {[
          { id: 'women', label: t.womenHistoryTab },
          { id: 'heritage', label: t.heritageTab },
          { id: 'opportunities', label: t.opportunitiesTab }
        ].map((subTab) => {
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setActiveSubTab(subTab.id as any)}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                isActive 
                  ? "bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-amber-300 shadow-md border border-amber-400/20" 
                  : "text-violet-900/60 hover:text-violet-900 hover:bg-violet-50/50"
              }`}
            >
              {subTab.label}
            </button>
          );
        })}
      </div>

      {/* Render Sub-Tab content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeSubTab === "women" && (
            <motion.div
              key="women"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Daily dynamic story card */}
              {daily?.inspiringStory && (
                <motion.div 
                  whileHover={{ y: -4, boxShadow: "0 30px 60px -15px rgba(109, 40, 217, 0.25)" }}
                  className="bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-amber-400/25 relative overflow-hidden shadow-2xl"
                >
                  <ArabesquePattern className="opacity-[0.14] text-amber-400" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-3 tracking-widest uppercase">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="font-display">{isRtl ? "سيرة ملهمة حصرية اليوم" : "Today's Exclusive Inspiring Profile"}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl filter drop-shadow animate-float">👑</div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-black font-display text-white">{daily.inspiringStory.womanName}</h3>
                        <p className="text-xs text-amber-300 mt-0.5 font-semibold font-sans">{daily.inspiringStory.era}</p>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-violet-100 mb-2 font-display">{daily.inspiringStory.title}</h4>
                    <p className="text-xs md:text-sm text-violet-100/90 leading-relaxed font-semibold">
                      {daily.inspiringStory.content}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Gallery of fallback iconic Arab women */}
              <div>
                <h3 className="text-base font-black text-violet-950 mb-4 px-2 font-display">
                  {isRtl ? "أيقونات خالدة في تاريخنا" : "Timeless Icons in Our History"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {fallbackWomen.map((woman, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -6, borderColor: "#fbbf24", boxShadow: "0 20px 40px -15px rgba(245, 158, 11, 0.12)" }}
                      className="bg-white/75 border border-violet-150/40 rounded-3xl p-5 shadow-md flex flex-col justify-between transition-all duration-300"
                    >
                      <div>
                        <div className="text-3xl mb-3 animate-float" style={{ animationDelay: `${idx * 200}ms` }}>{woman.image}</div>
                        <h4 className="font-black text-violet-950 text-sm font-display">{woman.name[language] || woman.name.ar}</h4>
                        <span className="text-[10px] text-amber-600 font-bold block mb-2">{woman.era[language] || woman.era.ar}</span>
                        <p className="text-xs text-violet-950/60 leading-relaxed font-semibold">
                          {woman.achieve[language] || woman.achieve.ar}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-violet-100/35 text-[10px] text-violet-900 font-bold flex items-center gap-1 font-display">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{t.readStory}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "heritage" && (
            <motion.div
              key="heritage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Daily dynamic heritage card */}
              {daily?.heritage && (
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-3xl p-6 border border-amber-200/50 shadow-lg relative overflow-hidden"
                >
                  <ArabesquePattern className="opacity-15 text-amber-500 animate-pulse-gentle" />
                  
                  <div className="relative z-10">
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 font-black px-3 py-1 rounded-full uppercase tracking-wider font-display">
                      {isRtl ? "علم وحضارة" : "Science & Civilization"}
                    </span>

                    <h3 className="text-lg font-black text-violet-950 mt-4 mb-2 font-display">{daily.heritage.title}</h3>
                    <span className="text-xs text-amber-700 font-bold block mb-3 font-sans">{t.significanceLabel} {daily.heritage.significance}</span>
                    <p className="text-xs md:text-sm text-violet-950/70 leading-relaxed font-semibold">
                      {daily.heritage.content}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Gallery of static heritage contributions */}
              <div>
                <h3 className="text-base font-black text-violet-950 mb-4 px-2 font-display">
                  {isRtl ? "منارات المعرفة والتراث" : "Beacons of Knowledge & Heritage"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fallbackHeritage.map((h, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -5, borderColor: "rgba(109, 40, 217, 0.25)" }}
                      className="bg-white/75 border border-violet-150/40 rounded-3xl p-6 shadow-md transition-all duration-300 relative overflow-hidden"
                    >
                      <ArabesquePattern className="opacity-[0.02] text-amber-500 animate-pulse" />
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-4xl bg-violet-50/80 p-2.5 rounded-2xl border border-violet-100">
                          {h.icon}
                        </div>
                        <div>
                          <h4 className="font-black text-violet-950 text-sm md:text-base font-display">{h.title[language] || h.title.ar}</h4>
                          <span className="text-[10px] text-amber-600 font-bold font-sans">{h.significance[language] || h.significance.ar}</span>
                        </div>
                      </div>

                      <p className="text-xs text-violet-950/60 leading-relaxed font-semibold">
                        {h.desc[language] || h.desc.ar}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "opportunities" && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Daily dynamic opportunity card */}
              {daily?.opportunity && (
                <motion.div 
                  whileHover={{ y: -4, boxShadow: "0 30px 60px -15px rgba(109, 40, 217, 0.25)" }}
                  className="bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-amber-400/25 relative overflow-hidden shadow-2xl"
                >
                  <ArabesquePattern className="opacity-12 text-amber-400" />

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] text-amber-300 font-bold border border-amber-400/40 px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                        {daily.opportunity.type}
                      </span>
                      <h3 className="text-lg md:text-xl font-black mt-3 mb-2 font-display text-white">{daily.opportunity.title}</h3>
                      <p className="text-xs text-violet-100/90 leading-relaxed max-w-xl font-semibold">
                        {daily.opportunity.description}
                      </p>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-violet-950 font-black rounded-xl text-xs transition-all shadow-lg shrink-0 flex items-center gap-1 cursor-pointer font-display premium-gradient-btn border border-amber-300/40"
                    >
                      <span>{t.opportunityApply}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Static opportunities list */}
              <div>
                <h3 className="text-base font-black text-violet-950 mb-4 px-2 font-display">
                  {isRtl ? "فرص وورش تهمكِ" : "Opportunities & Workshops of Interest"}
                </h3>

                <div className="space-y-4">
                  {fallbackOpportunities.map((op, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -3, borderColor: "rgba(109, 40, 217, 0.2)", boxShadow: "0 15px 30px -10px rgba(109, 40, 217, 0.1)" }}
                      className="bg-white/75 border border-violet-150/40 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300"
                    >
                      <div>
                        <span className="text-[10px] bg-violet-100/70 text-violet-800 font-bold px-2.5 py-1 rounded-full font-sans">
                          {t.opportunityType} {op.type[language] || op.type.ar}
                        </span>
                        <h4 className="font-black text-violet-950 text-sm md:text-base mt-2 mb-1 font-display">
                          {op.title[language] || op.title.ar}
                        </h4>
                        <p className="text-xs text-violet-950/60 font-semibold max-w-xl leading-relaxed">
                          {op.desc[language] || op.desc.ar}
                        </p>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-4.5 py-2.5 bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 border border-amber-400/25 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1 shrink-0 premium-gradient-btn"
                      >
                        <span>{op.actionText[language] || op.actionText.ar}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
