// src/hooks/useSpeechNarrator.js
// Tri-Lingual Web Speech API Narrator (English, Hindi, Gujarati) + Web Audio Synthesizer

import { useState, useEffect, useCallback, useRef } from 'react';

export const NARRATION_SCRIPTS = {
  deadlock: {
    en: "Look! All five friends picked up their left fork at the exact same moment. Now everyone is waiting for their right fork. Nobody can eat, and nobody will let go. This complete freeze is called Deadlock!",
    hi: "देखिए! सभी पांच दोस्तों ने एक ही समय पर अपना बायां कांटा उठा लिया। अब हर कोई अपने दाएं कांटे का इंतजार कर रहा है। कोई खा नहीं पा रहा है और कोई छोड़ भी नहीं रहा। इसे ही डेडलॉक कहते हैं!",
    gu: "જુઓ! પાંચેય મિત્રોએ એકસાથે પોતાનો ડાબો કાંટો ઉપાડી લીધો છે. હવે બધા જમણા કાંટાની રાહ જોઈ રહ્યા છે. કોઈ જમી નથી શકતું અને કોઈ કાંટો મૂકવા તૈયાર નથી. આ સંપૂર્ણ સ્થિતિને ડેડલોક કહેવાય છે!"
  },
  resource_ordering: {
    en: "Now we apply Resource Ordering. Watch Friend number 4! The rule forces them to wait for Fork 0 without touching Fork 4. Because Fork 4 is left free on the table, Friend 3 can eat noodles happily. The deadlock cycle is broken!",
    hi: "अब हमने रिसोर्स ऑर्डरिंग का नियम लागू किया है। दोस्त नंबर 4 को देखिए! नियम के कारण वह कांटा 4 छुए बिना कांटा 0 का इंतज़ार कर रहा है। कांटा 4 खाली रहने से दोस्त नंबर 3 आराम से नूडल्स खा सका। चक्र टूट गया!",
    gu: "હવે આપણે રિસોર્સ ઓર્ડરિંગનો નિયમ લાગુ કર્યો છે. મિત્ર નંબર 4 ને જુઓ! નિયમ મુજબ તે કાંટો 4 લીધા વગર કાંટો 0 ની રાહ જુએ છે. કાંટો 4 ટેબલ પર મુક્ત હોવાથી મિત્ર નંબર 3 આરામથી જમી શકે છે. આ રીતે ડેડલોક ટળી જાય છે!"
  },
  starvation: {
    en: "Notice how Friend 0 and Friend 2 are greedily alternating meals. Friend 1 is trapped in between and starving! This is Starvation.",
    hi: "ध्यान दें कि कैसे दोस्त 0 और दोस्त 2 बारी-बारी से खाना खा रहे हैं। बीच में फंसा दोस्त 1 भूखा मर रहा है! इसे स्टार्वेशन कहते हैं।",
    gu: "ધ્યાનથી જુઓ, મિત્ર 0 અને મિત્ર 2 વારાફરતી જમી રહ્યા છે. વચ્ચે ફસાયેલો મિત્ર 1 ભૂખ્યો રહી જાય છે! આને સ્ટાર્વેશન કહેવાય છે."
  },
  fifo_solution: {
    en: "With the FIFO aging queue in place, Friend 1 receives priority ticket number 1. Friends 0 and 2 politely wait until Friend 1 has eaten. Fairness is restored!",
    hi: "फीफो एजिंग कतार के लागू होने से दोस्त 1 को प्राथमिकता टिकट नंबर 1 मिलता है। दोस्त 0 और 2 तब तक इंतज़ार करते हैं जब तक दोस्त 1 खा न ले। निष्पक्षता बहाल हो गई!",
    gu: "ફિફો એજિંગ કતાર લાગુ પડતાં મિત્ર 1 ને પ્રાથમિકતા ટિકિટ નંબર 1 મળે છે. મિત્ર 0 અને 2 મિત્ર 1 જમી લે ત્યાં સુધી રાહ જુએ છે. સંપૂર્ણ ન્યાય પુનઃસ્થાપિત થયો!"
  },
  waiter_solution: {
    en: "The Café Waiter allows at most 4 friends at the table. By the Pigeonhole Principle, at least one philosopher is always guaranteed to get both forks and eat noodles smoothly!",
    hi: "कैफे वेटर एक बार में केवल 4 दोस्तों को मेज पर आने देता है। कबूतर-खाने (पिजनहोल) सिद्धांत के अनुसार, कम से कम एक व्यक्ति को हमेशा दोनों कांटे मिलेंगे और वह नूडल्स खा सकेगा!",
    gu: "કાફે વેઇટર એક સમયે વધુમાં વધુ 4 મિત્રોને જ ટેબલ પર આવવા દે છે. કબૂતર-ખાના સિદ્ધાંત મુજબ, ઓછામાં ઓછા એક મિત્રને ચોક્કસપણે બંને કાંટા મળી જ જશે અને તે જમી શકશે!"
  }
};

// Web Audio API Sound Synthesizer (Zero External Assets)
export class SoundSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playForkClink() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (_) {}
  }

  playEatMunch() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch (_) {}
  }

  playDeadlockAlarm() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.setValueAtTime(180, this.ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(140, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (_) {}
  }

  playVictoryFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.2);
      });
    } catch (_) {}
  }
}

export const soundSynth = new SoundSynthesizer();

export function useSpeechNarrator() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState('en'); // 'en', 'hi', 'gu'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((textOrKey, explicitLang = null) => {
    const langToUse = explicitLang || language;
    let textToSpeak = textOrKey;

    if (NARRATION_SCRIPTS[textOrKey]) {
      textToSpeak = NARRATION_SCRIPTS[textOrKey][langToUse] || NARRATION_SCRIPTS[textOrKey].en;
    }

    setCurrentSubtitle(textToSpeak);

    if (!voiceEnabled || !synthRef.current) {
      return;
    }

    try {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95; // Natural, clear tempo as requested
      utterance.pitch = 1.0;

      // Select voice matching language
      const langCode = langToUse === 'hi' ? 'hi-IN' : langToUse === 'gu' ? 'gu-IN' : 'en-US';
      utterance.lang = langCode;

      const voices = synthRef.current.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (_) {
      setIsSpeaking(false);
    }
  }, [language, voiceEnabled]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(prev => {
      if (prev && synthRef.current) {
        synthRef.current.cancel();
      }
      return !prev;
    });
  }, []);

  return {
    voiceEnabled,
    language,
    isSpeaking,
    currentSubtitle,
    setLanguage,
    toggleVoice,
    speak,
    stop,
    soundSynth
  };
}
