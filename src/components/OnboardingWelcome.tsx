/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import ArabesquePattern, { ElegantStar } from "./ArabesquePattern";
import { 
  Sparkles, 
  Lock, 
  Compass, 
  BookOpen, 
  Activity, 
  Award,
  Check,
  AlertCircle
} from "lucide-react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface Props {
  onCompleteAuth: () => void;
}

interface ArabGirlProfile {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  country: string;
  countryAr: string;
  tag: string;
  tagAr: string;
  color: string;
  icon: React.ComponentType<any>;
}

export default function OnboardingWelcome({ onCompleteAuth }: Props) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState("");

  const profiles: ArabGirlProfile[] = [
    {
      name: "Mariam",
      nameAr: "مريم",
      role: "Future Aerospace Engineer",
      roleAr: "مهندسة فضاء المستقبل",
      country: "UAE",
      countryAr: "الإمارات",
      tag: "Technology & Space",
      tagAr: "التكنولوجيا والفضاء",
      color: "from-purple-600 to-indigo-900",
      icon: Compass
    },
    {
      name: "Fatima",
      nameAr: "فاطمة",
      role: "Creative Cultural Historian",
      roleAr: "مؤرخة ثقافية وأديبة إبداعية",
      country: "Morocco",
      countryAr: "المغرب",
      tag: "Heritage & Literature",
      tagAr: "التراث والأدب",
      color: "from-amber-600 to-yellow-800",
      icon: BookOpen
    },
    {
      name: "Amina",
      nameAr: "أمينة",
      role: "AI Healthcare Pioneer",
      roleAr: "رائدة الذكاء الاصطناعي الطبي",
      country: "Egypt",
      countryAr: "مصر",
      tag: "Leadership & Health",
      tagAr: "القيادة والعلوم الطبية",
      color: "from-teal-600 to-cyan-900",
      icon: Activity
    },
    {
      name: "Sama",
      nameAr: "سما",
      role: "Sustainable Urban Architect",
      roleAr: "مهندسة معمارية بيئية",
      country: "Levant",
      countryAr: "بلاد الشام",
      tag: "Design & Innovation",
      tagAr: "التصميم والابتكار",
      color: "from-indigo-600 to-emerald-950",
      icon: Award
    }
  ];

  const handleGoogleAuth = async () => {
    setIsAuthenticating(true);
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthSuccess(true);
      setTimeout(() => {
        onCompleteAuth();
      }, 1000);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setAuthError("الرجاء السماح بالنافذة المنبثقة لإتمام الدخول. / Please allow popups to sign in.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setAuthError("تم إغلاق نافذة الدخول قبل إتمام العملية. / Sign-in popup was closed.");
      } else {
        setAuthError(err.message || "An error occurred during Google sign-in.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg flex flex-col justify-between items-center py-8 px-4 overflow-hidden glow-bg-radial">
      <ArabesquePattern className="opacity-[0.08] text-violet-950" />

      {/* Premium glowing feminine background blobs for warmth and emotional connection */}
      <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-rose-200/35 rounded-full blur-[100px] pointer-events-none animate-pulse-gentle" />
      <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] bg-violet-200/25 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute top-10 right-1/4 w-[250px] h-[250px] bg-amber-100/25 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-teal-100/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="relative z-10 text-center mb-4 mt-2">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="text-2xl animate-wiggle inline-block">🌸</span>
          <h1 className="text-2xl font-black tracking-tight text-violet-950 flex items-center gap-1.5 font-display">
            Huwiyati AI <span className="text-amber-500">|</span> <span className="gradient-text-premium font-extrabold">هويتي</span>
          </h1>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 my-auto">
        {/* Left Column: Inspiration & Slogan & Diverse Girls Cards */}
        <div className="flex-1 max-w-md text-center lg:text-right flex flex-col justify-center order-2 lg:order-1">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-600 bg-gradient-to-r from-amber-50 to-rose-50/50 border border-amber-200/40 px-4.5 py-2 rounded-full inline-block self-center lg:self-end mb-5 font-sans shadow-sm">
            ✨ بداية رحلتكِ الجميلة / Your Beautiful Journey Begins
          </span>
          <h2 className="text-2xl lg:text-3.5xl font-black text-violet-950 leading-tight mb-4 font-display">
            رفيقكِ الذكي لاكتشاف <span className="gradient-text-premium">ذاتكِ</span>، تطوير <span className="gradient-text-premium">مهاراتكِ</span>، وتحقيق <span className="text-amber-600">أحلامكِ</span>.
          </h2>
          <p className="text-sm text-gray-500 font-sans leading-relaxed mb-6">
            Your intelligent AI companion for personal growth, Arab identity, and high aspirations.
          </p>

          {/* Inspiring Intro Phrase with elegant Arabic/rose border */}
          <div className="glass-premium border border-white/60 p-6 rounded-3xl shadow-lg mb-8 relative overflow-hidden text-right animate-float">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/10 rounded-full blur-2xl pointer-events-none" />
            <ElegantStar className="absolute top-3 left-3 w-8 h-8 text-amber-500/15" />
            <p className="text-sm font-semibold text-violet-900 leading-relaxed italic mb-1">
              "كل فتاة عربية تملك قصة فريدة، هويتي AI يساعدها على كتابة الفصل القادم لتشرق في سماء التميز والريادة بمزيج من التراث والمستقبل."
            </p>
            <p className="text-[11px] text-gray-400 font-sans leading-normal">
              "Every Arab girl carries a unique light. Huwiyati AI is here to help you amplify your voice and design a tomorrow you are proud of."
            </p>
          </div>

          {/* Diverse Arab Girls representation - beautifully illustrated cards */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            {profiles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.04, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative overflow-hidden bg-gradient-to-br ${p.color} text-white p-4 rounded-2xl border border-white/20 shadow-lg text-right group`}
                >
                  <div className="absolute top-3 left-3 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm flex items-center gap-1.5 justify-end font-sans">
                    <span>{p.nameAr}</span>
                    <span className="text-[10px] opacity-75 font-sans">({p.name})</span>
                  </div>
                  <div className="text-[11px] font-medium text-white/95 mt-1.5 leading-snug">{p.roleAr}</div>
                  <div className="text-[9px] text-white/70 mt-2.5 flex justify-between items-center border-t border-white/10 pt-1.5">
                    <span className="font-sans uppercase tracking-wider font-semibold opacity-95">{p.countryAr}</span>
                    <span className="text-amber-200/90 text-[8px] font-semibold">{p.tagAr}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Premium Authentication Card with elegant glassmorphism and subtle gold borders */}
        <div className="w-full max-w-sm glass-premium rounded-3xl p-8 shadow-2xl border border-white/80 flex flex-col justify-between order-1 lg:order-2 relative overflow-hidden">
          {/* Subtle gold glow line at the top of the card */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-600 via-amber-400 to-rose-500" />
          
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-5">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 p-4 rounded-full shadow-xl border-2 border-amber-400/40 relative"
              >
                <div className="absolute inset-0 rounded-full bg-amber-400/15 animate-ping pointer-events-none" />
                <Sparkles className="w-8 h-8 text-amber-400" />
              </motion.div>
            </div>
            
            <h2 className="text-2xl font-black text-violet-950 mb-1 font-display tracking-tight">Huwiyati AI</h2>
            <p className="text-xs text-amber-600 font-extrabold mt-1 mb-4 font-sans uppercase tracking-wider">
              Empowering Arab Girls With Intelligence
            </p>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300 to-transparent my-3" />
            <p className="text-xs text-violet-900 font-bold leading-relaxed mb-6">
              مرحبًا بكِ في بوابتكِ المخصصة لتحقيق طموحاتكِ وصقل مهاراتكِ في بيئة إيجابية ملهمة.
            </p>
          </div>

          {/* Primary OAuth Button: Continue with Google with elegant custom styles */}
          <div className="space-y-4 relative z-10">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              disabled={isAuthenticating || authSuccess}
              className="w-full py-4.5 px-4 bg-white hover:bg-violet-50/50 border-2 border-violet-100 rounded-2xl shadow-md text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-3 text-violet-950 relative overflow-hidden font-sans hover:border-amber-300"
            >
              {isAuthenticating && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-violet-900/30 border-t-violet-900 rounded-full animate-spin" />
                  <span className="text-[10px] text-violet-950 font-bold">جاري الاتصال الآمن...</span>
                </div>
              )}

              {authSuccess && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-extrabold">تم تسجيل الدخول بنجاح! 🌸</span>
                </div>
              )}

              {/* High Quality SVG Google Logo */}
              <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </motion.button>

            {authError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-[10px] rounded-xl flex items-center gap-2 font-sans text-center justify-center leading-relaxed border border-rose-100 shadow-sm animate-wiggle">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Secure note */}
          <div className="text-center mt-8 pt-4 border-t border-violet-100/40 text-[10px] text-gray-400 leading-normal flex items-center justify-center gap-1.5 font-sans relative z-10">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium text-violet-900/60">نظام مشفر آمن بالكامل هويتي AI</span>
          </div>
        </div>
      </div>

      {/* Elegant Footer branding */}
      <div className="relative z-10 text-center text-[10px] text-gray-400 leading-normal max-w-xs mt-4 font-sans">
        Huwiyati AI © 2026. All rights reserved.<br />
        <span className="text-violet-900/40">صُمم بعناية وفخر لتمكين رائدات المستقبل في العالم العربي.</span>
      </div>
    </div>
  );
}
