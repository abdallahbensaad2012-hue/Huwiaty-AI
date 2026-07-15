/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, MentorChatEntry, Roadmap, Language } from "../types";
import { translations } from "../translations";
import ArabesquePattern, { ArabesqueBorder, ElegantStar } from "./ArabesquePattern";
import { Send, Sparkles, Volume2, VolumeX, MessageCircleCode, CheckCircle2 } from "lucide-react";

interface Props {
  profile: UserProfile;
  language: Language;
  onRoadmapGenerated: (roadmap: Roadmap, assessmentChat: MentorChatEntry[]) => void;
}

export default function AssessmentChat({ profile, language, onRoadmapGenerated }: Props) {
  const t = translations[language];
  const isRtl = language === "ar";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MentorChatEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMsg: MentorChatEntry = {
      sender: "mentor",
      text: t.assessmentIntro,
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
    
    // Auto-TTS for welcome message
    if (voiceEnabled) {
      handleTTS(t.assessmentIntro, 0);
    }
  }, [language]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // TTS handler
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
      
      // Call TTS API
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: MentorChatEntry = {
      sender: "user",
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mentor/assessment-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, conversation: updatedMessages }),
      });

      if (!response.ok) throw new Error("Chat server error");
      const data = await response.json();

      const mentorMsg: MentorChatEntry = {
        sender: "mentor",
        text: data.text || "أنا هنا دائماً لدعمكِ يا عزيزتي.",
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const next = [...prev, mentorMsg];
        // Automatically play TTS if voice is enabled
        if (voiceEnabled) {
          handleTTS(mentorMsg.text, next.length - 1);
        }
        return next;
      });
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMsg: MentorChatEntry = {
        sender: "mentor",
        text: language === "ar" ? "أنا آسفة يا عزيزتي، حدث خطأ تقني بسيط بالاتصال. هل يمكننا المحاولة مرة أخرى؟" : "I am sorry, there was a minor technical issue. Can we try again?",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const response = await fetch("/api/mentor/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, conversation: messages }),
      });

      if (!response.ok) throw new Error("Roadmap generation failed");
      const data = await response.json();

      if (data.milestones && Array.isArray(data.milestones)) {
        // Construct standard roadmap structure
        const roadmap: Roadmap = {
          milestones: data.milestones,
          currentLevel: 1,
          totalXp: 100, // starting gift
          badges: [
            {
              id: "badge_welcome",
              title: { ar: "بداية المجد", en: "Dawn of Glory", fr: "Aube de la Gloire" },
              description: { ar: "الانضمام إلى هويتي والبدء في تشكيل المستقبل.", en: "Joined Huwiyati and began carving your future path.", fr: "A rejoint Huwiyati et a commencé à tracer son avenir." },
              icon: "🌸",
              unlockedAt: Date.now()
            }
          ]
        };
        onRoadmapGenerated(roadmap, messages);
      } else {
        throw new Error("Invalid milestones format");
      }
    } catch (err) {
      console.error("Error in generating roadmap:", err);
      alert(language === "ar" ? "حدث خطأ أثناء إعداد خريطة طريقكِ المخصصة، يرجى إعادة المحاولة." : "Roadmap generation failed, please try again.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Only allow generating roadmap after at least 3 messages
  const canGenerate = messages.length >= 3;

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between py-6 px-4 md:px-8 max-w-4xl mx-auto overflow-hidden">
      <ArabesquePattern className="opacity-5 text-indigo-900" />

      {/* Main Header */}
      <div className="relative z-10 text-center mb-4" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        <h2 className="text-2xl font-extrabold text-violet-950 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          {t.assessmentTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          {t.assessmentSubtitle}
        </p>
        <ArabesqueBorder />
      </div>

      {/* Chat Area */}
      <div 
        className="relative z-10 flex-1 bg-white/70 backdrop-blur-md border border-amber-100 rounded-3xl p-4 md:p-6 mb-4 overflow-y-auto h-[55vh] shadow-inner flex flex-col"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex-1 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isMentor = msg.sender === "mentor";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isMentor ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex ${isMentor ? "justify-start" : "justify-end"}`}
                >
                  <div className={`relative max-w-[80%] rounded-2xl p-4 ${
                    isMentor 
                      ? "bg-gradient-to-br from-violet-50 to-indigo-50/50 border border-violet-100 text-violet-950 rounded-tl-none" 
                      : "bg-violet-900 text-white rounded-tr-none shadow-md shadow-violet-950/10"
                  }`}>
                    {/* Speaker buttons for mentor */}
                    {isMentor && (
                      <button
                        onClick={() => handleTTS(msg.text, index)}
                        className={`absolute -top-2 ${isRtl ? "-left-2" : "-right-2"} bg-white border border-violet-200 rounded-full p-1 shadow hover:bg-violet-50 cursor-pointer ${
                          playingAudioId === index ? "text-amber-500 animate-bounce" : "text-violet-600"
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block text-right ${isMentor ? "text-violet-400" : "text-violet-200"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 border border-violet-100 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input and Roadmap Controller */}
      <div className="relative z-10" style={{ direction: isRtl ? "rtl" : "ltr" }}>
        {/* Onboarding roadmap generator triggers once conversation is deep enough */}
        {canGenerate && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              <span className="text-xs text-amber-900 font-semibold">
                {isRtl ? "جهاز الاستشعار كافٍ لبناء خريطة طريقكِ!" : "Enough context gathered to build your personalized roadmap!"}
              </span>
            </div>
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-900 to-indigo-950 rounded-xl shadow border border-amber-400/40 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {t.generateRoadmapBtn}
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          {/* TTS voice globally switch */}
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-4 rounded-2xl border transition-all flex items-center justify-center cursor-pointer ${
              voiceEnabled ? "border-amber-400 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-400 hover:bg-gray-50"
            }`}
            title={voiceEnabled ? t.mentorVoiceOn : t.mentorVoiceOff}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.typePlaceholder}
            className="flex-1 px-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-900 bg-white shadow-sm"
            disabled={isLoading || isGeneratingRoadmap}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || isGeneratingRoadmap}
            className="px-5 bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-2xl hover:opacity-90 transition-all flex items-center justify-center border border-amber-400/30 disabled:opacity-40 cursor-pointer shadow-lg"
          >
            <Send className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </form>
      </div>

      {/* Generating Roadmap Fullscreen overlay */}
      {isGeneratingRoadmap && (
        <div className="fixed inset-0 bg-violet-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white px-6">
          <ArabesquePattern className="opacity-15 text-amber-300" />
          <div className="relative flex flex-col items-center max-w-md text-center z-10">
            <div className="relative mb-6">
              {/* Spinner Arabic themed */}
              <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <ElegantStar className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-amber-300">
              {isRtl ? "تصميم خريطة طريقكِ المتميزة..." : "Drafting your custom roadmap..."}
            </h3>
            <p className="text-sm text-violet-200/90 leading-relaxed animate-pulse">
              {t.roadmapGenerating}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
