/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { UserProfile, Language } from "../types";
import { translations, defaultInterests, countriesList } from "../translations";
import ArabesquePattern, { ArabesqueBorder, ElegantStar } from "./ArabesquePattern";
import { User, Sparkles, BookOpen, MapPin, Award, ShieldAlert } from "lucide-react";

interface Props {
  language: Language;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

export default function PersonalInfoForm({ language, onSave, onBack }: Props) {
  const t = translations[language];
  const isRtl = language === "ar";

  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(16);
  const [country, setCountry] = useState(countriesList[0].code);
  const [education, setEducation] = useState("");
  const [dream, setDream] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState("");
  const [customGoals, setCustomGoals] = useState("");
  const [customChallenges, setCustomChallenges] = useState("");

  const [validationError, setValidationError] = useState("");

  // Toggle interest selection
  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError(t.invalidName);
      return;
    }
    if (age < 10 || age > 25) {
      setValidationError(t.invalidAge);
      return;
    }
    if (!dream.trim()) {
      setValidationError(t.invalidDream);
      return;
    }
    if (selectedInterests.length < 2) {
      setValidationError(language === "ar" ? "يرجى تحديد اهتمامين على الأقل لتتمكن المرشدة من فهمكِ." : "Please select at least 2 interests.");
      return;
    }

    // Process free form texts into arrays
    const skills = customSkills
      .split(/[,،\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const goals = customGoals
      .split(/[,،\n]/)
      .map((g) => g.trim())
      .filter(Boolean);
    const challenges = customChallenges
      .split(/[,،\n]/)
      .map((c) => c.trim())
      .filter(Boolean);

    // Get selected interest labels
    const interestLabels = defaultInterests
      .filter((i) => selectedInterests.includes(i.id))
      .map((i) => i.label[language]);

    const profile: UserProfile = {
      name: name.trim(),
      age,
      country: countriesList.find((c) => c.code === country)?.label[language] || country,
      education: education.trim() || (language === "ar" ? "ثانوي" : "High School"),
      interests: interestLabels,
      dream: dream.trim(),
      skills: skills.length > 0 ? skills : [language === "ar" ? "التواصل والعمل الجماعي" : "Communication & teamwork"],
      goals: goals.length > 0 ? goals : [language === "ar" ? "التفوق الدراسي والابتكار" : "Academic excellence & innovation"],
      challenges: challenges.length > 0 ? challenges : [language === "ar" ? "إدارة الوقت والتركيز" : "Time management"],
      language,
    };

    onSave(profile);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-8 flex flex-col items-center overflow-hidden glow-bg-radial">
      <ArabesquePattern className="opacity-[0.07] text-violet-950" />

      {/* Premium glowing background blobs for deep emotional warmth */}
      <div className="absolute top-1/4 -left-10 w-80 h-80 bg-rose-200/30 rounded-full blur-[100px] pointer-events-none animate-pulse-gentle" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-[120px] pointer-events-none animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl glass-premium border border-white rounded-3xl shadow-2xl p-6 md:p-10"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={onBack}
            className="text-sm text-violet-900 hover:text-rose-600 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors duration-200"
          >
            {isRtl ? "← رجوع" : "← Back"}
          </button>
          <div className="flex items-center gap-1">
            <ElegantStar className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-amber-600 font-black text-xs tracking-wider uppercase font-sans">Huwiyati</span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-violet-950 mb-2 font-display">
          {t.personalInfoTitle}
        </h2>
        <p className="text-sm text-violet-900/60 font-medium mb-6">
          {t.personalInfoSubtitle}
        </p>

        <ArabesqueBorder />

        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-50/80 border-r-4 border-rose-500 rounded-2xl flex items-start gap-3 shadow-sm border border-rose-100"
          >
            <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <span className="text-sm text-rose-700 font-bold">{validationError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-violet-950 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" /> {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4.5 py-3 border border-violet-100 bg-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-sm font-semibold text-violet-950"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-violet-950 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> {t.ageLabel}
              </label>
              <input
                type="number"
                required
                min={10}
                max={25}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                className="w-full px-4.5 py-3 border border-violet-100 bg-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-sm font-semibold text-violet-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-violet-950 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" /> {t.countryLabel}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4.5 py-3 border border-violet-100 bg-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-sm font-semibold text-violet-950 cursor-pointer"
              >
                {countriesList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label[language]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-violet-950 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" /> {t.educationLabel}
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder={isRtl ? "مثال: الصف الحادي عشر، أو طالبة هندسة برمجيات" : "e.g. 11th Grade, Software Engineering Student"}
                className="w-full px-4.5 py-3 border border-violet-100 bg-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-sm font-semibold text-violet-950"
              />
            </div>
          </div>

          {/* Section 2: The Dream */}
          <div>
            <label className="block text-sm font-bold text-violet-950 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> {t.dreamLabel}
            </label>
            <textarea
              required
              rows={2}
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder={t.dreamPlaceholder}
              className="w-full px-4.5 py-3 border border-violet-100 bg-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-sm font-semibold text-violet-950 resize-none"
            />
          </div>

          {/* Section 3: Interests Pillbox */}
          <div>
            <label className="block text-sm font-bold text-violet-950 mb-2">
              {t.interestsLabel}
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleToggleInterest(interest.id)}
                    className={`px-4.5 py-2.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-violet-900 to-indigo-950 text-amber-300 border-violet-900 shadow-md scale-105"
                        : "bg-white/60 text-gray-700 border-violet-100/50 hover:border-violet-300 hover:bg-violet-50/30"
                    }`}
                  >
                    {interest.label[language]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Optional Rich Details */}
          <div className="border-t border-violet-100/60 pt-6 space-y-4">
            <h3 className="text-base font-extrabold text-violet-950">
              {isRtl ? "خطوات لتفصيل خريطة الطريق (اختياري)" : "Extra details for roadmap tuning (Optional)"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-violet-900/70 mb-1.5">
                  {t.skillsLabel}
                </label>
                <input
                  type="text"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  placeholder={isRtl ? "فوتوشوب، برمجة، إلقاء" : "design, coding, speech"}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-violet-100 bg-white/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-violet-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-violet-900/70 mb-1.5">
                  {t.goalsLabel}
                </label>
                <input
                  type="text"
                  value={customGoals}
                  onChange={(e) => setCustomGoals(e.target.value)}
                  placeholder={isRtl ? "إنشاء مشروعي الأول، تعلم لغة" : "launch first project, learn language"}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-violet-100 bg-white/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-violet-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-violet-900/70 mb-1.5">
                  {t.challengesLabel}
                </label>
                <input
                  type="text"
                  value={customChallenges}
                  onChange={(e) => setCustomChallenges(e.target.value)}
                  placeholder={isRtl ? "الخوف من الفشل، تشتت الانتباه" : "fear of failure, lack of focus"}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold border border-violet-100 bg-white/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-900/30 focus:border-violet-850 transition-all text-violet-950"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 mt-4 text-white font-bold rounded-2xl shadow-xl border border-amber-400/40 transition-all cursor-pointer flex items-center justify-center gap-2 premium-gradient-btn"
          >
            <span>{t.saveProfile}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
