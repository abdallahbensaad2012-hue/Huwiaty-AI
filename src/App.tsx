/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserState, UserProfile, Roadmap, MentorChatEntry, Language, DailyContent } from "./types";
import { translations, staticBadges } from "./translations";

import LanguageSelector from "./components/LanguageSelector";
import PersonalInfoForm from "./components/PersonalInfoForm";
import AssessmentChat from "./components/AssessmentChat";
import OnboardingWelcome from "./components/OnboardingWelcome";
import ArabesquePattern, { ElegantStar } from "./components/ArabesquePattern";

import TabHome from "./components/TabHome";
import TabMentor from "./components/TabMentor";
import TabJourney from "./components/TabJourney";
import TabDiscover from "./components/TabDiscover";
import TabProfile from "./components/TabProfile";

import { Home, Sparkles, Award, Compass, User, AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, getRedirectResult, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LOCAL_STORAGE_KEY = "huwiyati_user_state_v1";

const initialUserState: UserState = {
  profile: null,
  onboardingStep: "welcome",
  assessmentConversation: [],
  roadmap: null,
  dailyContent: null,
  mentorConversation: [],
  lastDailyUpdate: null,
  completedActions: [],
  mentorMemories: [],
};

interface RouteGuardProps {
  authUser: FirebaseUser | null;
  onboardingStep: string;
  children: React.ReactNode;
  fallbackWelcome: React.ReactNode;
  fallbackOnboarding: (step: string) => React.ReactNode;
}

function RouteGuard({
  authUser,
  onboardingStep,
  children,
  fallbackWelcome,
  fallbackOnboarding
}: RouteGuardProps) {
  if (!authUser) {
    return <>{fallbackWelcome}</>;
  }

  if (onboardingStep !== "completed") {
    return <>{fallbackOnboarding(onboardingStep)}</>;
  }

  return <>{children}</>;
}

export default function App() {
  const [state, setState] = useState<UserState>(initialUserState);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'mentor' | 'journey' | 'discover' | 'profile'>("home");
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error' | 'offline'>('saved');
  const [syncRetryCount, setSyncRetryCount] = useState<number>(0);

  // References for robust, queued, and debounced Firestore sync
  const syncQueueRef = useRef<UserState[]>([]);
  const syncTimeoutRef = useRef<any>(null);
  const isSyncingRef = useRef<boolean>(false);
  const backoffDelayRef = useRef<number>(1000); // Exponential backoff starts at 1s

  // 1. Check Authentication and Load Profile from Firestore, handling Redirect explicitly
  useEffect(() => {
    let isMounted = true;

    const handleInitialAuth = async () => {
      try {
        // Handle redirect result explicitly on boot to prevent auth/navigation race conditions
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user && isMounted) {
          console.log("Authenticated via redirect:", redirectResult.user.email);
        }
      } catch (err) {
        console.error("Redirect auth resolution failed:", err);
      }
    };

    handleInitialAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      if (user) {
        setAuthUser(user);
        setSyncStatus('saving');
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && isMounted) {
            const data = docSnap.data();
            const loadedState: UserState = {
              profile: data.profile || null,
              onboardingStep: data.onboardingStep || "language",
              assessmentConversation: data.assessmentConversation || [],
              roadmap: data.roadmap || null,
              dailyContent: data.dailyContent || null,
              mentorConversation: data.mentorConversation || [],
              lastDailyUpdate: data.lastDailyUpdate || null,
              completedActions: data.completedActions || [],
              mentorMemories: data.mentorMemories || [],
            };
            setState(loadedState);
            setSyncStatus('saved');
          } else if (isMounted) {
            // New user signed in with Google: Initialize document
            const defaultProfile: UserProfile = {
              name: user.displayName || "",
              age: 16,
              country: "",
              education: "",
              interests: [],
              dream: "",
              skills: [],
              goals: [],
              challenges: [],
              language: "ar",
            };
            const defaultState: UserState = {
              profile: defaultProfile,
              onboardingStep: "language",
              assessmentConversation: [],
              roadmap: null,
              dailyContent: null,
              mentorConversation: [],
              lastDailyUpdate: null,
              completedActions: [],
              mentorMemories: [],
            };
            setState(defaultState);
            await setDoc(docRef, {
              uid: user.uid,
              ...defaultState,
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString()
            });
            setSyncStatus('saved');
          }
        } catch (err: any) {
          console.error("Error loading user state from Firestore:", err);
          if (!navigator.onLine || err.code === 'unavailable' || err.message?.includes('offline')) {
            setSyncStatus('offline');
          } else {
            setSyncStatus('error');
          }
          
          // Fallback to local storage if network is broken on boot
          try {
            const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cached) {
              setState(JSON.parse(cached));
            }
          } catch (e) {
            console.error("Local storage fallback failed:", e);
          }
        }
      } else {
        setAuthUser(null);
        setSyncStatus('saved');
        setState({
          ...initialUserState,
          onboardingStep: "welcome"
        });
      }
      // Elegant slow fade to transition splash screen
      setTimeout(() => {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }, 1500);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Resilient Queue & Debounce State Synchronization to Firestore with Exponential Backoff
  const syncPending = async (userId: string) => {
    if (isSyncingRef.current) return;
    
    const stateToSync = syncQueueRef.current[syncQueueRef.current.length - 1];
    if (!stateToSync) {
      setSyncStatus('saved');
      setSyncRetryCount(0);
      backoffDelayRef.current = 1000;
      return;
    }

    isSyncingRef.current = true;
    setSyncStatus('saving');

    try {
      await setDoc(doc(db, "users", userId), {
        uid: userId,
        ...stateToSync,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Success! Clear completed items from queue
      syncQueueRef.current = syncQueueRef.current.filter(item => item !== stateToSync);
      
      setSyncStatus(syncQueueRef.current.length > 0 ? 'saving' : 'saved');
      setSyncRetryCount(0);
      backoffDelayRef.current = 1000; // reset backoff delay

      // If more updates were queued during the write, trigger next sync
      isSyncingRef.current = false;
      if (syncQueueRef.current.length > 0) {
        syncPending(userId);
      }
    } catch (err: any) {
      console.error("Firestore resilient sync failed:", err);
      isSyncingRef.current = false;

      const isOffline = !navigator.onLine || err.code === 'unavailable' || err.message?.includes('offline');
      if (isOffline) {
        setSyncStatus('offline');
      } else {
        setSyncStatus('error');
      }

      // Calculate exponential backoff (double the delay, capped at 30 seconds)
      const currentDelay = backoffDelayRef.current;
      backoffDelayRef.current = Math.min(currentDelay * 2, 30000);
      setSyncRetryCount(prev => prev + 1);

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Retry syncing using the current backoff delay
      syncTimeoutRef.current = setTimeout(() => {
        syncPending(userId);
      }, currentDelay);
    }
  };

  const enqueueSync = (newState: UserState, userId: string) => {
    // Append the state to our pending queue
    syncQueueRef.current.push(newState);
    setSyncStatus('saving');

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce the physical sync process by 1000ms
    syncTimeoutRef.current = setTimeout(() => {
      syncPending(userId);
    }, 1000);
  };

  const saveState = (newState: UserState) => {
    setState(newState);
    
    // Always persist to localStorage immediately as a fast local fallback
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (err) {
      console.error("Error saving state to local storage:", err);
    }

    if (authUser) {
      enqueueSync(newState, authUser.uid);
    }
  };

  const language = state.profile?.language || "ar";
  const t = translations[language];
  const isRtl = language === "ar";

  const getSyncStatusBadge = () => {
    const isAr = language === 'ar';
    switch (syncStatus) {
      case 'saving':
        return {
          text: syncRetryCount > 0 
            ? (isAr ? `إعادة محاولة الاتصال (${syncRetryCount})...` : `Retrying connection (${syncRetryCount})...`)
            : (isAr ? "جاري الحفظ..." : "Saving..."),
          color: "text-amber-600 bg-amber-50/50 border-amber-100/50 animate-pulse",
          dot: "bg-amber-500 animate-ping"
        };
      case 'offline':
        return {
          text: isAr ? "حفظ محلي (بلا اتصال)" : "Cached (Offline)",
          color: "text-gray-500 bg-gray-50/75 border-gray-100/50",
          dot: "bg-gray-400"
        };
      case 'error':
        return {
          text: syncRetryCount > 0
            ? (isAr ? `خطأ مزامنة - محاولة (${syncRetryCount})` : `Sync Error - Retry (${syncRetryCount})`)
            : (isAr ? "خطأ في المزامنة" : "Sync Error"),
          color: "text-rose-600 bg-rose-50/50 border-rose-100/50",
          dot: "bg-rose-500 animate-bounce"
        };
      case 'saved':
      default:
        return {
          text: isAr ? "تم الحفظ ✓" : "Saved ✓",
          color: "text-emerald-600 bg-emerald-50/50 border-emerald-100/30",
          dot: "bg-emerald-500"
        };
    }
  };

  // 3. Trigger Daily Content updates on load or onboarding complete
  useEffect(() => {
    if (state.onboardingStep === "completed" && state.profile) {
      const todayDate = new Date().toISOString().split("T")[0];
      const needsUpdate = !state.dailyContent || state.lastDailyUpdate !== todayDate;

      if (needsUpdate) {
        fetchDailyContent(state.profile);
      }
    }
  }, [state.onboardingStep]);

  const fetchDailyContent = async (profile: UserProfile) => {
    setIsDailyLoading(true);
    setDailyError("");
    try {
      const response = await fetch("/api/mentor/generate-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) throw new Error("Failed to retrieve daily activities");
      const dailyContent: DailyContent = await response.json();

      saveState({
        ...state,
        dailyContent,
        lastDailyUpdate: dailyContent.date,
      });
    } catch (err: any) {
      console.error("Error fetching daily content:", err);
      // Fallback elegant customized static data so the app NEVER breaks or feels blank
      const todayStr = new Date().toISOString().split("T")[0];
      const fallbackDaily: DailyContent = {
        date: todayStr,
        motivation: language === "ar"
          ? `يا بطلتي مريم، حلمكِ بأن تكوني "${profile.dream}" هو شعلة تنير مجتمعنا. آمني بقدرتكِ، واجعلي اليوم خطوة جديدة متميزة نحو التميز الفكري والأخلاقي.`
          : `My champion, your dream to become a "${profile.dream}" is a beacon for our society. Believe in your capacities, and make today a distinctive step towards excellence.`,
        mission: {
          id: `mission_${todayStr}`,
          title: language === "ar" ? "تخطيط الأهداف الأسبوعية" : "Weekly Goal Setting",
          description: language === "ar" 
            ? "اكتبي ثلاثة أهداف محددة ترغبين في إنجازها هذا الأسبوع لدعم حلمكِ وعرضيها على مرشدتكِ."
            : "Write down 3 specific milestones you wish to achieve this week supporting your dream.",
          category: language === "ar" ? "تطوير الذات" : "Self Growth",
          xpReward: 150,
          completed: false,
        },
        challenge: {
          title: language === "ar" ? "تحدي الشجاعة الإلقائية" : "Public Speech Courage Challenge",
          description: language === "ar"
            ? "سجلي رسالة صوتية دقيقة واحدة تلخصين فيها حلمكِ وقيمتكِ القيادية لمرشدتكِ هويتي للتعبير بثقة."
            : "Record a 1-minute voice pitch explaining your dream with proud confidence.",
          xpReward: 200,
          completed: false,
        },
        inspiringStory: {
          title: language === "ar" ? "الريادة العلمية الخالدة" : "Immortal Scientific Leadership",
          womanName: language === "ar" ? "فاطمة الفهرية" : "Fatima al-Fihri",
          era: language === "ar" ? "القرن التاسع الميلادي" : "9th Century",
          content: language === "ar"
            ? "أسست مدرسة وجامعة القرويين بفاس بمالها وجهدها الخاص، لتصنع أقدم صرح تعليمي مستمر في العالم، مبرهنة أن الفتاة العربية هي رائدة العلم والمعرفة دائماً."
            : "Founded the University of al-Qarawiyyin in Fez, creating the oldest continuous institution of higher learning.",
        },
        heritage: {
          title: language === "ar" ? "بيت الحكمة في بغداد" : "House of Wisdom in Baghdad",
          significance: language === "ar" ? "عاصمة العلوم العالمية" : "World Scientific Capital",
          content: language === "ar"
            ? "كان بيت الحكمة منارة العصر الذهبي الإسلامي، حيث اجتمع العلماء من كل حدب وصوب لترجمة المعارف وابتكار العلوم الرياضية والفلكية والطبية وإهدائها للبشرية."
            : "The House of Wisdom was the focal intellectual hub of the Islamic Golden Age, gathering scholars to invent algebra and advance astronomy.",
        },
        opportunity: {
          title: language === "ar" ? "معسكر القيادة وريادة الأعمال للفتيات" : "Girls Leadership & Tech Bootcamp",
          description: language === "ar"
            ? "برنامج تفاعلي مجاني لتمكين الشابات العربيات من التخطيط لمشاريعهن القيادية باستخدام التقنيات الحديثة."
            : "A free interactive virtual bootcamp to empower young Arab girls to build leadership startups.",
          type: language === "ar" ? "تدريب تفاعلي" : "Virtual Bootcamp",
        },
        reflection: language === "ar" 
          ? "ما هو القرار الإيجابي الصغير الذي اتخذتِه اليوم وجعلكِ تشعرين بالفخر بهويتكِ وعلمكِ؟"
          : "What small positive decision did you make today that made you proud of your identity?",
      };

      saveState({
        ...state,
        dailyContent: fallbackDaily,
        lastDailyUpdate: todayStr,
      });
      setDailyError(err.message || "Using customized local fallback content.");
    } finally {
      setIsDailyLoading(false);
    }
  };

  // 4. Onboarding transition handlers
  const handleSelectLanguage = (lang: Language) => {
    saveState({
      ...state,
      profile: {
        ...(state.profile || {
          name: "",
          age: 16,
          country: "",
          education: "",
          interests: [],
          dream: "",
          skills: [],
          goals: [],
          challenges: [],
          language: lang,
        }),
        language: lang,
      },
    });
  };

  const handleLanguageNext = () => {
    saveState({ ...state, onboardingStep: "info" });
  };

  const handleProfileSave = (profile: UserProfile) => {
    saveState({
      ...state,
      profile,
      onboardingStep: "assessment",
    });
  };

  const handleBackToLanguage = () => {
    saveState({ ...state, onboardingStep: "language" });
  };

  const handleBackToInfo = () => {
    saveState({ ...state, onboardingStep: "info" });
  };

  const handleRoadmapGenerated = (roadmap: Roadmap, assessmentConversation: MentorChatEntry[]) => {
    saveState({
      ...state,
      roadmap,
      assessmentConversation,
      onboardingStep: "completed",
    });
    setActiveTab("home");
  };

  // 5. Active session state modifications
  const handleCompleteAction = (actionKey: string, xpReward: number) => {
    if (state.completedActions.includes(actionKey)) return;

    const updatedActions = [...state.completedActions, actionKey];
    handleAddXp(xpReward, updatedActions);
  };

  const handleAddXp = (xp: number, updatedActions = state.completedActions) => {
    if (!state.roadmap) return;

    const currentXp = state.roadmap.totalXp + xp;
    let currentLevel = state.roadmap.currentLevel;
    const xpThreshold = currentLevel * 500;

    // Check level up
    if (currentXp >= xpThreshold) {
      currentLevel += 1;
    }

    // Check for level-up badges
    const updatedBadges = [...state.roadmap.badges];
    if (currentLevel >= 2 && !updatedBadges.some((b) => b.id === "badge_leader")) {
      const leaderBadge = staticBadges.find((b) => b.id === "badge_leader");
      if (leaderBadge) {
        updatedBadges.push({
          ...leaderBadge,
          unlockedAt: Date.now(),
        });
      }
    }

    saveState({
      ...state,
      completedActions: updatedActions,
      roadmap: {
        ...state.roadmap,
        totalXp: currentXp,
        currentLevel,
        badges: updatedBadges,
      },
    });
  };

  const handleSendMessage = (userText: string, mentorResponse: string, extractedMemories?: any[]) => {
    const userMsg: MentorChatEntry = {
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };
    const mentorMsg: MentorChatEntry = {
      sender: "mentor",
      text: mentorResponse,
      timestamp: Date.now(),
    };

    let updatedMemories = [...(state.mentorMemories || [])];
    if (extractedMemories && Array.isArray(extractedMemories)) {
      extractedMemories.forEach((mem) => {
        // Prevent duplicate memories with the exact same content to keep the memory clean
        if (!updatedMemories.some((m) => m.content.toLowerCase().trim() === mem.content.toLowerCase().trim())) {
          updatedMemories.push({
            id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            memory_type: mem.memory_type,
            content: mem.content,
            importance_level: mem.importance_level,
            createdAt: Date.now()
          });
        }
      });
    }

    saveState({
      ...state,
      mentorConversation: [...state.mentorConversation, userMsg, mentorMsg],
      mentorMemories: updatedMemories,
    });
  };

  const handleUpdateRoadmap = (updatedRoadmap: Roadmap) => {
    saveState({
      ...state,
      roadmap: updatedRoadmap,
    });
  };

  const handleSetLanguage = (lang: Language) => {
    if (state.profile) {
      saveState({
        ...state,
        profile: {
          ...state.profile,
          language: lang,
        },
      });
    }
  };

  const handleResetApp = async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const resetProfile: UserProfile = authUser ? {
      name: authUser.displayName || "",
      age: 16,
      country: "",
      education: "",
      interests: [],
      dream: "",
      skills: [],
      goals: [],
      challenges: [],
      language: language,
    } : {
      name: "",
      age: 16,
      country: "",
      education: "",
      interests: [],
      dream: "",
      skills: [],
      goals: [],
      challenges: [],
      language: "ar",
    };

    const resetState: UserState = {
      profile: resetProfile,
      onboardingStep: "language",
      assessmentConversation: [],
      roadmap: null,
      dailyContent: null,
      mentorConversation: [],
      lastDailyUpdate: null,
      completedActions: [],
    };
    saveState(resetState);
    setActiveTab("home");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      setState(initialUserState);
      setActiveTab("home");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const isArabic = language === "ar";
  const langClass = isArabic ? "lang-ar" : (language === "fr" ? "lang-fr" : "lang-en");
  const dir = isArabic ? "rtl" : "ltr";

  // 3. Render Premium Launch Loading Splash Screen
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-950 flex flex-col justify-center items-center text-white p-4 relative overflow-hidden">
        <ArabesquePattern className="opacity-10 text-amber-400" />
        <div className="relative z-10 text-center flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="w-20 h-20 mb-6 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-amber-200/50 shadow-2xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-black tracking-tight text-white flex items-center gap-2 font-display"
          >
            Huwiyati AI <span className="text-amber-400">|</span> هويتي
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xs text-amber-200 mt-2 font-sans tracking-wide"
          >
            جاري تحضير رحلتكِ المخصصة بالذكاء الاصطناعي...
          </motion.p>
          <p className="text-[10px] text-gray-400 mt-1 font-sans">
            Initializing your personal AI journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className={`min-h-screen bg-brand-bg text-violet-950 flex flex-col justify-between selection:bg-amber-100 selection:text-violet-900 ${langClass}`}>
      <RouteGuard
        authUser={authUser}
        onboardingStep={state.onboardingStep}
        fallbackWelcome={
          <div className="flex-1 flex flex-col justify-center py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <OnboardingWelcome
                  onCompleteAuth={() => {
                    // Triggers state change onAuthStateChanged auto-refresh
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        }
        fallbackOnboarding={(step) => (
          <div className="flex-1 flex flex-col justify-center py-6">
            <AnimatePresence mode="wait">
              {step === "language" && (
                <motion.div
                  key="language"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LanguageSelector
                    selectedLanguage={language}
                    onSelectLanguage={handleSelectLanguage}
                    onNext={handleLanguageNext}
                  />
                </motion.div>
              )}

              {step === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PersonalInfoForm
                    language={language}
                    onSave={handleProfileSave}
                    onBack={handleBackToLanguage}
                  />
                </motion.div>
              )}

              {step === "assessment" && state.profile && (
                <motion.div
                  key="assessment"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="px-4 text-center">
                    <button
                      onClick={handleBackToInfo}
                      className="text-xs text-violet-900 font-medium mb-4 hover:underline cursor-pointer"
                    >
                      {isRtl ? "← تعديل البيانات الشخصية" : "← Edit profile fields"}
                    </button>
                  </div>
                  <AssessmentChat
                    profile={state.profile}
                    language={language}
                    onRoadmapGenerated={handleRoadmapGenerated}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      >
        {/* Main Application Workspace (Protected & Intercepted) */}
        <div className="flex-1 flex flex-col justify-between pb-24 md:pb-28">
          {/* Top Elegant Branding Header */}
          <header className="bg-white border-b border-amber-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm relative z-20" style={{ direction: isRtl ? "rtl" : "ltr" }}>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-violet-900 to-indigo-950 p-2 rounded-xl text-white border border-amber-400/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-violet-950">{t.appName}</h1>
                <p className="text-[9px] text-gray-400 font-medium hidden sm:block">{t.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {authUser && (() => {
                const badge = getSyncStatusBadge();
                return (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] sm:text-[10px] font-bold tracking-tight transition-all duration-300 ${badge.color}`}>
                    <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.text}</span>
                  </div>
                );
              })()}

              <ElegantStar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
              <span className="text-xs font-bold text-violet-900 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
                {state.profile?.name}
              </span>
            </div>
          </header>

          {/* Sub-page Body wrapper with Animation */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "home" && (
                  <TabHome
                    state={state}
                    onCompleteAction={handleCompleteAction}
                    onSetTab={setActiveTab}
                  />
                )}

                {activeTab === "mentor" && (
                  <TabMentor
                    state={state}
                    onSendMessage={handleSendMessage}
                  />
                )}

                {activeTab === "journey" && (
                  <TabJourney
                    state={state}
                    onUpdateRoadmap={handleUpdateRoadmap}
                    onAddXp={(xp) => handleAddXp(xp)}
                  />
                )}

                {activeTab === "discover" && (
                  <TabDiscover state={state} />
                )}

                {activeTab === "profile" && (
                  <TabProfile
                    state={state}
                    onSetLanguage={handleSetLanguage}
                    onResetApp={handleResetApp}
                    onLogout={handleLogout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* 5-Tab Navigation Bar with dynamic direction support and relative indicators */}
          <nav 
            className={`fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-amber-200/40 shadow-2xl py-3 px-4 md:px-12 z-30 flex items-center justify-around ${
              isRtl ? "flex-row-reverse" : "flex-row"
            }`} 
            style={{ direction: isRtl ? "rtl" : "ltr" }}
          >
            {[
              { id: "home", label: t.tabHome, icon: Home },
              { id: "mentor", label: t.tabMentor, icon: Sparkles },
              { id: "journey", label: t.tabJourney, icon: Award },
              { id: "discover", label: t.tabDiscover, icon: Compass },
              { id: "profile", label: t.tabProfile, icon: User }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex-1 flex flex-col items-center justify-center cursor-pointer select-none group py-1"
                >
                  <motion.div
                    layoutId={isActive ? "activeTabIndicator" : undefined}
                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? "bg-violet-100/40 border border-violet-200/30 text-violet-950" 
                        : "text-gray-400 hover:text-violet-900 hover:bg-gray-50/50"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-br from-violet-900 to-indigo-950 text-amber-300 shadow shadow-violet-950/15 scale-105 border border-amber-400/25" 
                        : "text-gray-400 group-hover:text-violet-900"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight">
                      {tab.label}
                    </span>
                  </motion.div>
                </button>
              );
            })}
          </nav>
        </div>
      </RouteGuard>
    </div>
  );
}
