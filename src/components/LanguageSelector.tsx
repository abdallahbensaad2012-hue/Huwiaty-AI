/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Language } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ElegantStar } from "./ArabesquePattern";
import { Globe } from "lucide-react";

interface Props {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onNext: () => void;
}

export default function LanguageSelector({ selectedLanguage, onSelectLanguage, onNext }: Props) {
  const t = translations[selectedLanguage];

  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 overflow-hidden">
      <ArabesquePattern className="opacity-10 text-violet-950" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md glass-premium shadow-2xl rounded-3xl p-8 text-center border border-white"
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-25 animate-pulse-gentle">
          <ElegantStar className="w-8 h-8 text-amber-500" />
        </div>

        <div className="flex justify-center mb-6 mt-4">
          <div className="bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 p-4 rounded-2xl shadow-xl border border-amber-400/40 relative">
            <div className="absolute inset-0 bg-violet-500/10 rounded-2xl blur-lg" />
            <Globe className="w-10 h-10 text-amber-400 animate-spin-slow relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-violet-950 tracking-tight mb-2 font-display">
          Huwiyati AI <span className="text-amber-500">|</span> <span className="gradient-text-premium font-extrabold">هويتي</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8 font-sans">
          {t.selectLang}
        </p>

        {/* Language Options */}
        <div className="space-y-4 mb-8">
          {[
            { code: "ar", label: "العربية", desc: "لغتنا وهويتنا الجميلة" },
            { code: "en", label: "English", desc: "Global reach & growth" },
            { code: "fr", label: "Français", desc: "Clarté et innovation" }
          ].map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02, x: lang.code === 'ar' ? -4 : 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectLanguage(lang.code as Language)}
                className={`w-full flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                  isSelected
                    ? "border-amber-400/80 bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white shadow-xl shadow-violet-950/25 relative overflow-hidden"
                    : "border-violet-100/40 bg-white/65 text-gray-700 hover:border-violet-300 hover:bg-violet-50/50"
                }`}
                style={{ direction: lang.code === 'ar' ? 'rtl' : 'ltr' }}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-amber-400/5 blur-xl pointer-events-none" />
                )}
                <div className="relative z-10">
                  <div className={`font-bold text-base ${isSelected ? "text-amber-300" : "text-violet-950"}`}>
                    {lang.label}
                  </div>
                  <div className={`text-xs ${isSelected ? "text-violet-200" : "text-gray-400 font-medium"}`}>
                    {lang.desc}
                  </div>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 relative z-10 shadow shadow-amber-400"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="w-full py-4.5 text-white font-bold rounded-2xl shadow-xl border border-amber-400/45 transition-all cursor-pointer flex items-center justify-center gap-2 premium-gradient-btn"
        >
          <span className="font-display tracking-wide">{t.getStarted}</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
