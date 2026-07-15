/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserState, MentorChatEntry } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ElegantStar } from "./ArabesquePattern";
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  MessageSquare, 
  Brain, 
  MailOpen, 
  Compass, 
  TrendingUp, 
  Flame, 
  Activity, 
  Heart, 
  ShieldAlert,
  Award,
  ChevronRight,
  Smile
} from "lucide-react";

interface Props {
  state: UserState;
  onSendMessage: (text: string, mentorResponse: string, extractedMemories?: any[]) => void;
}

interface AnalysisData {
  confidence: { level: string; percentage: number; description: string };
  creativity: { level: string; percentage: number; description: string };
  leadership: { level: string; percentage: number; description: string };
  communicationStyle: { title: string; description: string };
  learningPreference: { title: string; description: string };
  problemSolving: { title: string; description: string };
  overallReflection: string;
  disclaimer: string;
}

interface FutureSelfData {
  letter: string;
  futureYear: string;
  achievedTitle: string;
  keyEncouragement: string;
}

const subTranslations: any = {
  ar: {
    tabChat: "الحديث مع سَنا",
    tabAnalysis: "تحليل شخصيتي 🧠",
    tabFutureSelf: "رسالة المستقبل ✉️",
    tabMemories: "ذاكرة سَنا 🌸",
    memoriesTitle: "دفتر ذكريات سَنا عنكِ",
    memoriesSubtitle: "هنا تحفظ مرشدتكِ سَنا ملامح طموحاتكِ وإنجازاتكِ التي شاركتِها معها لتبني مسيرتكِ بذكاء.",
    noMemories: "لا توجد ذكريات محفوظة بعد. تحدثي مع سَنا في المتصفح لتكتشف ملامح طموحكِ وتحفظها لكِ هنا! 🌸",
    btnGenerateAnalysis: "تحليل شخصيتي بالذكاء الاصطناعي ✨",
    btnGenerateFutureSelf: "افتحي رسالة ذاتكِ المستقبلية ✉️",
    analysisTitle: "لوحة تقدير ملامح الشخصية والنمو",
    analysisSubtitle: "انعكاس مخصص بالذكاء الاصطناعي لمساعدتكِ على اكتشاف مكامن قوتكِ القيادية والإبداعية.",
    analysisDisclaimer: "تنبيه توجيهي: هذا الانعكاس مبني على الذكاء الاصطناعي لمساعدتكِ على فهم نفسكِ بشكل أفضل والاعتزاز بقدراتكِ، وليس تقييماً نفسياً أو فحصاً طبياً متخصصاً.",
    analysisConfidence: "مستوى الثقة بالنفس والاعتزاز بالذات",
    analysisCreativity: "النزعة الإبداعية والابتكار الفكري",
    analysisLeadership: "القدرة القيادية الكامنة وقوة المبادرة",
    commStyle: "أسلوب التواصل اللغوي والتعبير عن الذات",
    learnStyle: "تفضيل التعلم واكتساب المعرفة",
    solveStyle: "منهجية حل المشكلات واتخاذ القرار",
    overallRef: "إلهام وتوجيه مخصص من مرشدتكِ سَنا:",
    futureSelfTitle: "خطاب وارد من ذاتكِ المستقبلية المشرقة",
    futureSelfSubtitle: "تخيلي نفسكِ بعد عدة سنوات وقد تغلبتِ على الصعاب وحققتِ حلمكِ. ماذا ستقول لكِ ذاتكِ الناجحة اليوم؟ دعينا نستدعي هذا الإلهام.",
    futureSelfYear: "العام المتوقع للرسالة:",
    futureSelfBanner: "خطاب الاستباق القيادي والتمكين",
    keyAdviceLabel: "الوصية الذهبية لمسيرتكِ اليوم:",
  },
  en: {
    tabChat: "Chat with Sana",
    tabAnalysis: "Personality Analysis 🧠",
    tabFutureSelf: "Future Self Letter ✉️",
    tabMemories: "Sana's Memories 🌸",
    memoriesTitle: "Sana's Memories of You",
    memoriesSubtitle: "Here your mentor Sana stores key aspirations and milestones you've shared to guide your journey dynamically.",
    noMemories: "No memories saved yet. Start chatting with Sana and she will capture and preserve your growth details here! 🌸",
    btnGenerateAnalysis: "Generate My AI Analysis ✨",
    btnGenerateFutureSelf: "Open Future Self Letter ✉️",
    analysisTitle: "AI Growth & Personality Insights",
    analysisSubtitle: "A customized guidance reflection to discover your unique leadership and creative strengths.",
    analysisDisclaimer: "Guidance Notice: This is an AI-based reflection to help you understand yourself better and embrace your potential, not a professional psychological assessment or diagnosis.",
    analysisConfidence: "Self-Confidence & Self-Pride Level",
    analysisCreativity: "Creativity & Intellectual Innovation",
    analysisLeadership: "Potential Leadership & Initiative Power",
    commStyle: "Communication & Self-Expression Style",
    learnStyle: "Learning & Knowledge Acquisition Preference",
    solveStyle: "Problem-Solving & Decision-Making Approach",
    overallRef: "Personalized Guidance & Inspiration from Sana:",
    futureSelfTitle: "A Message from Your Successful Future Self",
    futureSelfSubtitle: "Imagine yourself years into the future, having overcome challenges and achieved your ultimate dream. Read what your future self wants to share with you today.",
    futureSelfYear: "Projected Year:",
    futureSelfBanner: "Future Vision & Empowerment Letter",
    keyAdviceLabel: "Golden Advice for Your Journey Today:",
  },
  fr: {
    tabChat: "Parler avec Sana",
    tabAnalysis: "Analyse de Personnalité 🧠",
    tabFutureSelf: "Lettre du Futur Moi ✉️",
    tabMemories: "Souvenirs de Sana 🌸",
    memoriesTitle: "Souvenirs de Sana sur Toi",
    memoriesSubtitle: "Ici, ton mentor Sana conserve tes aspirations et jalons partagés pour guider ton parcours de manière dynamique.",
    noMemories: "Aucun souvenir enregistré pour l'instant. Parle avec Sana pour qu'elle capture et préserve tes accomplissements ici ! 🌸",
    btnGenerateAnalysis: "Analyser ma personnalité ✨",
    btnGenerateFutureSelf: "Ouvrir la lettre du futur moi ✉️",
    analysisTitle: "Perspectives de Croissance et Personnalité",
    analysisSubtitle: "Une réflexion d'orientation IA pour découvrir vos forces uniques de leadership et de créativité.",
    analysisDisclaimer: "Avis d'orientation : Il s'agit d'une réflexion basée sur l'IA pour vous aider à mieux vous comprendre, et non d'une évaluation psychologique ou d'un diagnostic professionnel.",
    analysisConfidence: "Niveau de Confiance en Soi et d'Estime",
    analysisCreativity: "Créativité et Innovation Intellectuelle",
    analysisLeadership: "Potentiel de Leadership et d'Initiative",
    commStyle: "Style de Communication et d'Expression",
    learnStyle: "Préférence d'Apprentissage et d'Acquisition",
    solveStyle: "Approche de Résolution de Problèmes",
    overallRef: "Conseils et Inspiration Personnalisés de Sana :",
    futureSelfTitle: "Lettre de Votre Futur Moi Accompli",
    futureSelfSubtitle: "Imaginez-vous dans plusieurs années, ayant surmonté les défis et réalisé votre rêve ultime. Lisez ce que votre futur moi veut partager avec vous aujourd'hui.",
    futureSelfYear: "Année Projetée :",
    futureSelfBanner: "Lettre de Vision et d'Autonomisation",
    keyAdviceLabel: "Le Conseil d'Or pour Votre Parcours Aujourd'hui :",
  }
};

export default function TabMentor({ state, onSendMessage }: Props) {
  const language = state.profile?.language || 'ar';
  const t = translations[language];
  const st = subTranslations[language] || subTranslations['ar'];
  const isRtl = language === 'ar';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [subTab, setSubTab] = useState<'chat' | 'analysis' | 'futureself' | 'memories'>('chat');
  const [localMessages, setLocalMessages] = useState<MentorChatEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Future Self state
  const [futureSelf, setFutureSelf] = useState<FutureSelfData | null>(null);
  const [isFutureSelfLoading, setIsFutureSelfLoading] = useState(false);
  const [futureSelfError, setFutureSelfError] = useState("");

  // Sync state conversation log or load initial welcoming question
  useEffect(() => {
    if (state.mentorConversation && state.mentorConversation.length > 0) {
      setLocalMessages(state.mentorConversation);
    } else {
      // Set default mentor welcome question based on profile and language
      const intro = language === "ar" 
        ? `أهلاً بكِ مجدداً يا عزيزتي ${state.profile?.name} 🌸 أنا مرشدتكِ سَنا (Sana). أنا ممتنة للغاية للحديث معكِ اليوم. كيف تسير استعداداتكِ للوصول لحلمكِ في أن تصبحي "${state.profile?.dream}"؟ أخبريني بما يواجهكِ اليوم لنفكر معاً بذكاء وعزيمة، ونخطو خطوة واثقة نحو مستقبلكِ.`
        : language === "fr"
        ? `Rebonjour ma chère ${state.profile?.name} 🌸 Je suis ton mentor, Sana. Je suis tellement reconnaissante de parler avec toi aujourd'hui. Comment se déroulent tes préparatifs pour réaliser ton rêve de devenir "${state.profile?.dream}" ? Raconte-moi ce qui te préoccupe aujourd'hui, et réfléchissons ensemble avec sagesse et détermination.`
        : `Welcome back, my dear ${state.profile?.name} 🌸 I am your mentor, Sana. I am so grateful to converse with you today. How are your preparations going to achieve your dream of becoming "${state.profile?.dream}"? Tell me what is on your mind today, and let us think together with wisdom and resolve.`;
      
      const welcomeMsg: MentorChatEntry = {
        sender: "mentor",
        text: intro,
        timestamp: Date.now(),
      };
      setLocalMessages([welcomeMsg]);
      if (voiceEnabled) {
        handleTTS(intro, 0);
      }
    }
  }, [state.mentorConversation, language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleTTS = async (text: string, index: number) => {
    const fallbackSpeechSynthesis = (speechText: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          // Strip basic markdown formatting for a natural spoken voice
          const cleanText = speechText
            .replace(/[*#_`~]/g, "")
            .replace(/\[.*?\]\(.*?\)/g, "");

          const utterance = new SpeechSynthesisUtterance(cleanText);
          
          let langCode = "ar-EG";
          if (language === "en") langCode = "en-US";
          else if (language === "fr") langCode = "fr-FR";
          
          utterance.lang = langCode;
          
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(
            (v) => v.lang.startsWith(langCode) || v.lang.replace("_", "-").startsWith(langCode)
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          utterance.onend = () => setPlayingAudioId(null);
          utterance.onerror = (e) => {
            console.error("SpeechSynthesisUtterance error:", e);
            setPlayingAudioId(null);
          };
          
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("Browser speech synthesis failed:", err);
          setPlayingAudioId(null);
        }
      } else {
        setPlayingAudioId(null);
      }
    };

    try {
      setPlayingAudioId(index);
      
      // Stop any current browser-level voice before speaking
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      const response = await fetch("/api/mentor/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error("TTS server endpoint returned non-OK status");
      }
      const data = await response.json();
      
      if (data.base64Audio) {
        const audioMime = data.mimeType || "audio/wav";
        const audioSrc = `data:${audioMime};base64,${data.base64Audio}`;
        const audio = new Audio(audioSrc);
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => {
          console.warn("Audio element playback failed, falling back to Web Speech API");
          fallbackSpeechSynthesis(text);
        };
        await audio.play();
      } else {
        throw new Error("No audio data returned");
      }
    } catch (err) {
      console.warn("Gemini TTS API failed, using fallback Web Speech API:", err);
      fallbackSpeechSynthesis(text);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    const userMsg: MentorChatEntry = {
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };

    const updated = [...localMessages, userMsg];
    setLocalMessages(updated);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          profile: state.profile, 
          conversation: updated,
          roadmap: state.roadmap 
        }),
      });

      if (!response.ok) throw new Error("Mentor connection error");
      const data = await response.json();

      const mentorResponseText = data.text || (language === "ar" ? "أنا معكِ يا عزيزتي دائماً." : "I am always with you, my dear.");
      const mentorMsg: MentorChatEntry = {
        sender: "mentor",
        text: mentorResponseText,
        timestamp: Date.now(),
      };

      setLocalMessages((prev) => {
        const next = [...prev, mentorMsg];
        if (voiceEnabled) {
          handleTTS(mentorMsg.text, next.length - 1);
        }
        return next;
      });

      // Synchronize with parent state
      onSendMessage(userText, mentorResponseText, data.extractedMemories);
    } catch (err) {
      console.error("Error in active mentor chat:", err);
      const errorMsg: MentorChatEntry = {
        sender: "mentor",
        text: language === "ar" 
          ? "أنا هنا دائماً للاستماع لكِ، ولكن يبدو أن هناك عطلاً بسيطاً في شبكة الاتصال بقلبي. دعينا نجرب مجدداً يا بطلتي!" 
          : "I am always here to listen, but there is a slight connection issue. Let's try again, my champion!",
        timestamp: Date.now(),
      };
      setLocalMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestTopic = (topicText: string) => {
    setInputText(topicText);
  };

  // Fetch personality analysis
  const handleFetchAnalysis = async () => {
    setIsAnalysisLoading(true);
    setAnalysisError("");
    try {
      const response = await fetch("/api/mentor/analyze-personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: state.profile,
          conversation: localMessages
        }),
      });
      if (!response.ok) throw new Error("Failed to load personality insights.");
      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "An error occurred.");
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Fetch Future Self Message
  const handleFetchFutureSelf = async () => {
    setIsFutureSelfLoading(true);
    setFutureSelfError("");
    try {
      const response = await fetch("/api/mentor/future-self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: state.profile,
          roadmap: state.roadmap
        }),
      });
      if (!response.ok) throw new Error("Failed to load letter from future self.");
      const data = await response.json();
      setFutureSelf(data);
    } catch (err: any) {
      console.error(err);
      setFutureSelfError(err.message || "An error occurred.");
    } finally {
      setIsFutureSelfLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between py-4 px-4 md:px-8 max-w-4xl mx-auto overflow-hidden">
      <ArabesquePattern className="opacity-[0.06] text-violet-950" />

      {/* Header bar with Sana Identity & Voice */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center glass-premium border border-white rounded-3xl p-5 shadow-xl mb-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 bg-gradient-to-br from-violet-900 to-indigo-950 rounded-full border border-amber-400 flex items-center justify-center text-white shadow shadow-violet-950/20 shrink-0">
            <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse-gentle" />
          </div>
          <div>
            <h2 className="text-lg font-black text-violet-950 flex items-center gap-1 font-display">
              <span>سَنا</span>
              <span className="text-xs font-bold text-violet-900/40 font-sans">(Sana AI)</span>
            </h2>
            <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              {st.tabChat} - {t.mentorStatusActive}
            </p>
          </div>
        </div>

        {/* Global Voice Controls */}
        <div className="mt-4 sm:mt-0 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-4.5 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              voiceEnabled 
                ? "border-amber-400/80 bg-amber-50 text-amber-800 shadow-sm" 
                : "border-violet-100 bg-white/60 text-violet-900/40 hover:bg-violet-50/50"
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-500 animate-bounce" />
                <span>{t.mentorVoiceOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t.mentorVoiceOff}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Sub-tab Navigation (Conversations, Personality Insights, Future Self Letter) */}
      <div className="relative z-10 flex border border-violet-250/45 mb-6 font-bold text-xs md:text-sm bg-white/70 p-1.5 rounded-2xl gap-2" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <button
          onClick={() => setSubTab('chat')}
          className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'chat' 
              ? "bg-gradient-to-br from-violet-900 to-indigo-950 text-white shadow-md border border-amber-400/20" 
              : "text-violet-900/60 hover:text-violet-900 hover:bg-violet-50/50"
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span className="font-display">{st.tabChat}</span>
        </button>

        <button
          onClick={() => {
            setSubTab('analysis');
            if (!analysis) handleFetchAnalysis();
          }}
          className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'analysis' 
              ? "bg-gradient-to-br from-violet-900 to-indigo-950 text-white shadow-md border border-amber-400/20" 
              : "text-violet-900/60 hover:text-violet-900 hover:bg-violet-50/50"
          }`}
        >
          <Brain className="w-4 h-4 shrink-0" />
          <span className="font-display">{st.tabAnalysis}</span>
        </button>

        <button
          onClick={() => {
            setSubTab('futureself');
            if (!futureSelf) handleFetchFutureSelf();
          }}
          className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'futureself' 
              ? "bg-gradient-to-br from-violet-900 to-indigo-950 text-white shadow-md border border-amber-400/20" 
              : "text-violet-900/60 hover:text-violet-900 hover:bg-violet-50/50"
          }`}
        >
          <MailOpen className="w-4 h-4 shrink-0" />
          <span className="font-display">{st.tabFutureSelf}</span>
        </button>

        <button
          onClick={() => setSubTab('memories')}
          className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
            subTab === 'memories' 
              ? "bg-gradient-to-br from-violet-900 to-indigo-950 text-white shadow-md border border-amber-400/20" 
              : "text-violet-900/60 hover:text-violet-900 hover:bg-violet-50/50"
          }`}
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span className="font-display">{st.tabMemories}</span>
        </button>
      </div>

      {/* Main Panel Body */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Chat Conversation */}
          {subTab === 'chat' && (
            <motion.div
              key="chat_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              {/* Conversation list box */}
              <div 
                className="flex-1 glass-premium border border-white rounded-3xl p-4 md:p-6 mb-4 overflow-y-auto h-[48vh] shadow-xl flex flex-col justify-between"
                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
              >
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {localMessages.map((msg, index) => {
                    const isMentor = msg.sender === "mentor";
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${isMentor ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                          isMentor 
                            ? "bg-gradient-to-br from-violet-50/90 to-indigo-50/50 border border-violet-100 text-violet-950 rounded-tl-none" 
                            : "bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white border border-amber-400/25 rounded-tr-none shadow-md shadow-violet-950/15"
                        }`}>
                          {isMentor && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleTTS(msg.text, index)}
                              className={`absolute -top-2 ${isRtl ? "-left-2" : "-right-2"} bg-white border border-violet-200 rounded-full p-1.5 shadow hover:bg-violet-50 cursor-pointer ${
                                playingAudioId === index ? "text-amber-500 animate-bounce" : "text-violet-600"
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                          <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>
                          <span className={`text-[9px] mt-1.5 block text-right ${isMentor ? "text-violet-400 font-medium" : "text-violet-200/80 font-mono"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-violet-50/80 to-indigo-50/40 border border-violet-100 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggested Topic Chips & Input Area */}
              <div style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <div className="mb-3">
                  <p className="text-[10px] text-violet-900/50 font-bold mb-1.5 uppercase tracking-wide">
                    {t.suggestedTopics}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { text: t.topicIdentity, label: isRtl ? "الهوية والثقافة" : "Identity & Culture" },
                      { text: t.topicConfidence, label: isRtl ? "بناء الثقة" : "Build Confidence" },
                      { text: t.topicLeadership, label: isRtl ? "القيادة والنهوض" : "Leadership Role" },
                      { text: t.topicDream, label: isRtl ? "مستقبلي وحلمي" : "My Future Goal" }
                    ].map((chip, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestTopic(chip.text)}
                        className="px-3.5 py-2 text-[11px] md:text-xs font-bold rounded-full bg-white/70 hover:bg-violet-100/55 border border-violet-100/40 text-violet-900 transition-all cursor-pointer shadow-sm"
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.speakToMentorPrompt}
                    className="flex-1 px-4.5 py-4 border border-violet-200 bg-white/70 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900/30 text-sm font-semibold shadow-inner"
                    disabled={isLoading}
                  />

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!inputText.trim() || isLoading}
                    className="px-6 bg-gradient-to-br from-violet-900 via-violet-950 to-indigo-950 text-white rounded-2xl hover:opacity-95 transition-all flex items-center justify-center border border-amber-400/25 disabled:opacity-40 cursor-pointer shadow-lg premium-gradient-btn"
                  >
                    <Send className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Personality Analysis Engine */}
          {subTab === 'analysis' && (
            <motion.div
              key="analysis_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 glass-premium border border-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div className="text-center md:text-right">
                <h3 className="text-lg md:text-xl font-black text-violet-950 flex items-center gap-2 justify-center md:justify-start font-display">
                  <Brain className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />
                  {st.analysisTitle}
                </h3>
                <p className="text-xs text-violet-900/50 mt-1 font-semibold">{st.analysisSubtitle}</p>
              </div>

              {isAnalysisLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-violet-900/10 border-t-violet-900 rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-violet-950 animate-pulse">{st.btnGenerateAnalysis}...</p>
                </div>
              ) : analysisError ? (
                <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl text-rose-700 text-xs flex flex-col gap-2">
                  <p className="font-bold">{analysisError}</p>
                  <button onClick={handleFetchAnalysis} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 font-bold rounded-xl self-start transition-all cursor-pointer">
                    {isRtl ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              ) : !analysis ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
                  <Brain className="w-12 h-12 text-violet-200 mb-4 animate-bounce" />
                  <p className="text-xs text-violet-900/50 leading-relaxed mb-6 font-semibold">
                    {st.analysisSubtitle}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFetchAnalysis}
                    className="px-6 py-3.5 text-white border border-amber-400/25 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg premium-gradient-btn"
                  >
                    {st.btnGenerateAnalysis}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6 flex-1 overflow-y-auto max-h-[50vh] pr-2">
                  
                  {/* Progress Sliders meters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Confidence Meter */}
                    <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/30 p-4 rounded-2xl border border-violet-100/50 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2 font-bold text-xs">
                        <span className="text-violet-950 flex items-center gap-1 font-display">
                          <Smile className="w-4 h-4 text-violet-700" />
                          {st.analysisConfidence}
                        </span>
                        <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {analysis.confidence.level}
                        </span>
                      </div>
                      <div className="w-full bg-violet-100/40 rounded-full h-2 mb-3 overflow-hidden border border-violet-200/10">
                        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-rose-400 h-full rounded-full" style={{ width: `${analysis.confidence.percentage}%` }} />
                      </div>
                      <p className="text-[11px] text-violet-950/70 font-semibold leading-relaxed">{analysis.confidence.description}</p>
                    </div>

                    {/* Creativity Meter */}
                    <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/30 p-4 rounded-2xl border border-violet-100/50 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2 font-bold text-xs">
                        <span className="text-violet-950 flex items-center gap-1 font-display">
                          <Compass className="w-4 h-4 text-violet-700" />
                          {st.analysisCreativity}
                        </span>
                        <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {analysis.creativity.level}
                        </span>
                      </div>
                      <div className="w-full bg-violet-100/40 rounded-full h-2 mb-3 overflow-hidden border border-violet-200/10">
                        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-rose-400 h-full rounded-full" style={{ width: `${analysis.creativity.percentage}%` }} />
                      </div>
                      <p className="text-[11px] text-violet-950/70 font-semibold leading-relaxed">{analysis.creativity.description}</p>
                    </div>

                    {/* Leadership Meter */}
                    <div className="bg-gradient-to-br from-violet-50/70 to-indigo-50/30 p-4 rounded-2xl border border-violet-100/50 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2 font-bold text-xs">
                        <span className="text-violet-950 flex items-center gap-1 font-display">
                          <TrendingUp className="w-4 h-4 text-violet-700" />
                          {st.analysisLeadership}
                        </span>
                        <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {analysis.leadership.level}
                        </span>
                      </div>
                      <div className="w-full bg-violet-100/40 rounded-full h-2 mb-3 overflow-hidden border border-violet-200/10">
                        <div className="bg-gradient-to-r from-violet-600 via-purple-500 to-rose-400 h-full rounded-full" style={{ width: `${analysis.leadership.percentage}%` }} />
                      </div>
                      <p className="text-[11px] text-violet-950/70 font-semibold leading-relaxed">{analysis.leadership.description}</p>
                    </div>
                  </div>

                  {/* Dynamic Traits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Comm Style */}
                    <div className="bg-white/75 border border-violet-100/40 p-4 rounded-2xl shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-violet-900/40 block mb-1 font-sans">{st.commStyle}</span>
                      <h4 className="font-extrabold text-violet-950 text-xs mb-1.5 font-display">{analysis.communicationStyle.title}</h4>
                      <p className="text-[11px] text-violet-950/60 font-semibold leading-relaxed">{analysis.communicationStyle.description}</p>
                    </div>

                    {/* Learn style */}
                    <div className="bg-white/75 border border-violet-100/40 p-4 rounded-2xl shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-violet-900/40 block mb-1 font-sans">{st.learnStyle}</span>
                      <h4 className="font-extrabold text-violet-950 text-xs mb-1.5 font-display">{analysis.learningPreference.title}</h4>
                      <p className="text-[11px] text-violet-950/60 font-semibold leading-relaxed">{analysis.learningPreference.description}</p>
                    </div>

                    {/* Problem solve */}
                    <div className="bg-white/75 border border-violet-100/40 p-4 rounded-2xl shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-violet-900/40 block mb-1 font-sans">{st.solveStyle}</span>
                      <h4 className="font-extrabold text-violet-950 text-xs mb-1.5 font-display">{analysis.problemSolving.title}</h4>
                      <p className="text-[11px] text-violet-950/60 font-semibold leading-relaxed">{analysis.problemSolving.description}</p>
                    </div>
                  </div>

                  {/* Overall reflection */}
                  <div className="bg-amber-50/65 border border-amber-100 p-5 rounded-2xl relative overflow-hidden">
                    <ElegantStar className="absolute top-2 left-2 w-8 h-8 text-amber-500/10" />
                    <h4 className="font-black text-violet-950 text-xs mb-2 flex items-center gap-1.5 font-display">
                      <Heart className="w-4 h-4 text-amber-500 shrink-0" />
                      {st.overallRef}
                    </h4>
                    <p className="text-xs text-violet-900 font-bold leading-relaxed whitespace-pre-line">{analysis.overallReflection}</p>
                  </div>

                  {/* Mandatory Psychological Disclaimer */}
                  <div className="bg-violet-50/40 border border-violet-100/40 p-4 rounded-2xl flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-violet-900/40 shrink-0 mt-0.5" />
                    <p className="text-[10px] md:text-xs text-violet-900/45 font-semibold leading-relaxed">
                      {analysis.disclaimer || st.analysisDisclaimer}
                    </p>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Future Self Letter */}
          {subTab === 'futureself' && (
            <motion.div
              key="futureself_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 glass-premium border border-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div className="text-center md:text-right">
                <h3 className="text-lg md:text-xl font-black text-violet-950 flex items-center gap-2 justify-center md:justify-start font-display">
                  <MailOpen className="w-6 h-6 text-amber-500 shrink-0" />
                  {st.futureSelfTitle}
                </h3>
                <p className="text-xs text-violet-900/50 mt-1 font-semibold">{st.futureSelfSubtitle}</p>
              </div>

              {isFutureSelfLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-violet-900/10 border-t-violet-900 rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-violet-950 animate-pulse">{st.btnGenerateFutureSelf}...</p>
                </div>
              ) : futureSelfError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex flex-col gap-2">
                  <p className="font-bold">{futureSelfError}</p>
                  <button onClick={handleFetchFutureSelf} className="px-4 py-2 bg-rose-100 hover:bg-rose-200 font-bold rounded-xl self-start transition-all cursor-pointer">
                    {isRtl ? "إعادة المحاولة" : "Retry"}
                  </button>
                </div>
              ) : !futureSelf ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
                  <MailOpen className="w-12 h-12 text-violet-200 mb-4 animate-bounce" />
                  <p className="text-xs text-violet-900/50 leading-relaxed mb-6 font-semibold">
                    {st.futureSelfSubtitle}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFetchFutureSelf}
                    className="px-6 py-3.5 text-white border border-amber-400/25 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-lg premium-gradient-btn"
                  >
                    {st.btnGenerateFutureSelf}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6 flex-1 overflow-y-auto max-h-[50vh] pr-2">
                  
                  {/* Future Self Banner and Key Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-amber-50/70 to-amber-100/30 border border-amber-200/50 p-4 rounded-2xl text-center md:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-amber-750 block mb-1 font-sans">{st.futureSelfBanner}</span>
                      <h4 className="font-black text-violet-950 text-sm md:text-base font-display">
                        {futureSelf.achievedTitle}
                      </h4>
                    </div>
                    <div className="bg-violet-50/80 border border-violet-100/50 p-4 rounded-2xl text-center">
                      <span className="text-[10px] uppercase font-bold text-violet-400 block mb-1 font-sans">{st.futureSelfYear}</span>
                      <h4 className="font-mono font-black text-violet-950 text-base">
                        {futureSelf.futureYear}
                      </h4>
                    </div>
                  </div>

                  {/* Letter Box (Styled as beautiful parchment) */}
                  <div className="relative bg-amber-50/40 border border-amber-250/60 rounded-3xl p-6 md:p-8 shadow-inner overflow-hidden">
                    <ArabesquePattern className="absolute inset-0 opacity-[0.04] text-amber-900 pointer-events-none" />
                    <div className="relative z-10 text-xs md:text-sm text-violet-950 leading-relaxed whitespace-pre-line font-serif italic text-justify select-none font-medium">
                      {futureSelf.letter}
                    </div>
                  </div>

                  {/* Key Advice */}
                  <div className="bg-gradient-to-r from-violet-900 to-indigo-950 text-white border border-amber-400/20 p-5 rounded-3xl shadow-md relative overflow-hidden">
                    <ElegantStar className="absolute right-3 bottom-3 w-16 h-16 text-white/5" />
                    <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1 tracking-wider">{st.keyAdviceLabel}</span>
                    <p className="text-xs md:text-sm font-bold italic text-amber-100">
                      "{futureSelf.keyEncouragement}"
                    </p>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Sana's Memories */}
          {subTab === 'memories' && (
            <motion.div
              key="memories_panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 glass-premium border border-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-6"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div className="text-center md:text-right">
                <h3 className="text-lg md:text-xl font-black text-violet-950 flex items-center gap-2 justify-center md:justify-start font-display">
                  <Heart className="w-6 h-6 text-amber-500 shrink-0 animate-pulse" />
                  {st.memoriesTitle}
                </h3>
                <p className="text-xs text-violet-900/50 mt-1 font-semibold">{st.memoriesSubtitle}</p>
              </div>

              {!state.mentorMemories || state.mentorMemories.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4 border border-amber-200/55 animate-pulse">
                    <Heart className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-xs text-violet-900/50 leading-relaxed font-semibold">
                    {st.noMemories}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto max-h-[50vh] pr-2">
                  {state.mentorMemories.map((mem) => {
                    // Type-specific styles
                    const typeStyles: Record<string, { bg: string, text: string, border: string, icon: string }> = {
                      Goal: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/50', icon: '🎯' },
                      Preference: { bg: 'bg-violet-50/80', text: 'text-violet-700', border: 'border-violet-200/50', icon: '🌟' },
                      Skill: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/50', icon: '⚡' },
                      Achievement: { bg: 'bg-cyan-50/80', text: 'text-cyan-700', border: 'border-cyan-200/50', icon: '🏆' },
                      Milestone: { bg: 'bg-rose-50/80', text: 'text-rose-700', border: 'border-rose-200/50', icon: '📍' },
                    };
                    const style = typeStyles[mem.memory_type] || { bg: 'bg-gray-50/85', text: 'text-gray-700', border: 'border-gray-200/40', icon: '📝' };

                    return (
                      <motion.div 
                        key={mem.id}
                        whileHover={{ y: -3, borderColor: "rgba(109, 40, 217, 0.2)" }}
                        className="bg-white/75 border border-violet-100/45 rounded-2xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between gap-3 group transition-all"
                      >
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-violet-950 to-indigo-950 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} flex items-center gap-1`}>
                              <span>{style.icon}</span>
                              <span className="font-display">{isRtl ? (
                                mem.memory_type === 'Goal' ? 'هدف' :
                                mem.memory_type === 'Preference' ? 'تفضيل' :
                                mem.memory_type === 'Skill' ? 'مهارة' :
                                mem.memory_type === 'Achievement' ? 'إنجاز' : 'محطة'
                              ) : mem.memory_type}</span>
                            </span>
                            {mem.importance_level === 'high' && (
                              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/55 uppercase font-sans">
                                {isRtl ? "هام للغاية" : "Highly Important"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-violet-950 leading-relaxed font-bold">
                            "{mem.content}"
                          </p>
                        </div>
                        <div className="text-[9px] text-violet-900/40 font-semibold font-sans border-t border-violet-100/30 pt-2 flex justify-between">
                          <span>{isRtl ? "مستخلص بالذكاء الاصطناعي" : "AI Cognitive Extraction"}</span>
                          <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
