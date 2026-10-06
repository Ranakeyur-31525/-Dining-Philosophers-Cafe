/**
 * speechNarrator.js
 * Tri-lingual Voice Narration using Web Speech API (window.speechSynthesis)
 * Supports: English (en-US), Hindi (hi-IN), Gujarati (gu-IN)
 * 100% Client-side, zero external API keys required, works completely offline.
 */

class SpeechNarrator {
  constructor() {
    this.enabled = true;
    this.currentLang = 'en-US'; // 'en-US' | 'hi-IN' | 'gu-IN'
    this.rate = 0.95;
    this.pitch = 1.0;
    this.availableVoices = [];
    this.isSpeaking = false;
    this.listeners = [];

    this.scripts = {
      'en-US': {
        welcome: "Welcome to the Dining Philosophers Café! Five friends need two forks to eat noodles. Let's see what happens when concurrency goes wrong!",
        deadlock: "Look! All five friends grabbed their left fork at the exact same time. Now, everyone is waiting for their right fork. Nobody can eat, and nobody will let go. This complete freeze is called Deadlock!",
        deadlock_step: "Every single fork is now locked in someone's left hand! With everyone waiting for their right neighbor, circular wait has formed. Deadlock is now total!",
        starvation: "Watch Philosopher P3! The aggressive neighbors P2 and P4 keep sharing the forks back and forth. Even though the cafe is running, P3 gets zero food and is starving! In OS terms, this is Starvation or Livelock.",
        starvation_fixed: "FIFO queue arbitration is now applied! Waiting times are strictly bounded, ensuring Philosopher P3 is guaranteed a turn to eat.",
        resource_order: "Now we apply Resource Ordering, also known as Havender's Algorithm. Watch Philosopher 5! The rule forces them to wait for Fork 1 before touching Fork 5. Because Fork 5 is left free on the table, Philosopher 4 can eat noodles happily. The cycle is broken!",
        waiter: "The café waiter limits the table to a maximum of four diners at once! By the Pigeonhole Principle, at least one friend is guaranteed to get two forks. Deadlock is impossible!",
        tanenbaum: "Tanenbaum's All-or-Nothing Monitor is active! A diner only touches forks if BOTH left and right forks are completely free, eliminating Hold-and-Wait!",
        mutex_acquired: (thread) => `${thread} acquired the mutual exclusion lock on the shared plate.`,
        mutex_blocked: (thread) => `${thread} attempted to acquire the lock but was blocked and put to sleep.`,
        semaphore_signal: "The semaphore signaled an available permit, waking up the queued thread.",
        reset: "Table reset! All forks are back in the center, and all philosophers are thinking peacefully."
      },

      'hi-IN': {
        welcome: "डाइनिंग फिलॉसफर्स कैफे में आपका स्वागत है! पांच दोस्तों को नूडल्स खाने के लिए दो कांटे चाहिए। आइए देखें जब सिस्टम में तालमेल बिगड़ता है तो क्या होता है!",
        deadlock: "देखिए! सभी पांच दोस्तों ने एक ही समय पर अपना बायां कांटा उठा लिया। अब हर कोई अपने दाएं कांटे का इंतजार कर रहा है। कोई खा नहीं पा रहा है और कोई छोड़ भी नहीं रहा। इसे ही डेडलॉक कहते हैं!",
        deadlock_step: "टेबल का हर कांटा किसी न किसी के हाथ में फंस गया है! हर दोस्त अपने पड़ोसी के कांटे का इंतजार कर रहा है। यह पूरी तरह से सर्कुलर वेट बन गया है!",
        starvation: "फिलॉसफर P3 को देखिए! उसके दोनों पड़ोसी P2 और P4 बारी-बारी से कांटे इस्तेमाल कर रहे हैं, जिससे P3 को कभी दोनों कांटे नहीं मिल पाते और वह भूखा रह जाता है। इसे स्टार्वेशन कहते हैं!",
        starvation_fixed: "फीफो फेयरनेस लागू कर दी गई है! अब हर दार्शनिक को बारी-बारी से खाना मिलने की गारंटी है।",
        resource_order: "अब हमने रिसोर्स ऑर्डरिंग का नियम लागू किया है। फिलॉसफर 5 को देखिए! नियम के कारण वह कांटा 5 छुए बिना कांटा 1 का इंतज़ार कर रहा है। कांटा 5 खाली रहने से फिलॉसफर 4 आराम से नूडल्स खा सका। चक्र टूट गया!",
        waiter: "कैफे वेटर ने अब टेबल पर एक बार में सिर्फ चार लोगों को अनुमति दी है। पांच कांटों के लिए चार लोग हैं, इसलिए कम से कम एक व्यक्ति को दोनों कांटे जरूर मिलेंगे!",
        tanenbaum: "यह टेनेनबॉम का ऑल-ऑर-नथिंग मॉनिटर समाधान है! कोई भी दोस्त कांटे तभी उठाएगा जब दोनों कांटे एक साथ टेबल पर खाली हों।",
        mutex_acquired: (thread) => `${thread} ने प्लेट का म्युटेक्स लॉक सफलतापूर्वक प्राप्त कर लिया।`,
        mutex_blocked: (thread) => `${thread} लॉक पाने में विफल रहा और ब्लॉक अवस्था में चला गया।`,
        semaphore_signal: "सेमाफोर ने परमिट जारी किया और कतार में इंतज़ार कर रहे थ्रेड को जगाया।",
        reset: "टेबल रीसेट कर दी गई है! सारे कांटे टेबल पर वापस आ गए हैं।"
      },

      'gu-IN': {
        welcome: "ડાઇનિંગ ફિલોસોફર્સ કાફેમાં તમારું સ્વાગત છે! પાંચ મિત્રોને નૂડલ્સ ખાવા માટે બે કાંટા જોઈએ છે. ચાલો જોઈએ જ્યારે સિસ્ટમમાં તાલમેલ બગડે ત્યારે શું થાય છે!",
        deadlock: "જુઓ! પાંચેય મિત્રોએ એકસાથે પોતાનો ડાબો કાંટો ઉપાડી લીધો છે. હવે બધા જમણા કાંટાની રાહ જોઈ રહ્યા છે. કોઈ જમી નથી શકતું અને કોઈ કાંટો મૂકવા પણ તૈયાર નથી. આ સંપૂર્ણ સ્થિતિને ડેડલોક કહેવાય છે!",
        deadlock_step: "ટેબલનો દરેક કાંટો કોઈકના ડાબા હાથમાં બંધાઈ ગયો છે! દરેક મિત્ર પડોશીના કાંટાની રાહ જુએ છે. આને સર્ક્યુલર વેઇટ કહેવાય છે!",
        starvation: "ફિલોસોફર P3 ને જુઓ! તેના બંને પડોશીઓ P2 અને P4 વારાફરતી કાંટા વાપરી રહ્યા છે, જેથી P3 ને ક્યારેય બંને કાંટા મળતા નથી અને તે ભૂખ્યો રહે છે. આને સ્ટાર્વેશન કહે છે!",
        starvation_fixed: "ફીફો કતાર લાગુ કરવામાં આવી છે! હવે P3 ને પણ જમવાનો ચોક્કસ વારો મળશે.",
        resource_order: "હવે આપણે રિસોર્સ ઓર્ડરિંગનો નિયમ લાગુ કર્યો છે. ફિલોસોફર 5 ને જુઓ! નિયમ મુજબ તે કાંટો 5 લીધા વગર કાંટો 1 ની રાહ જુએ છે. કાંટો 5 ટેબલ પર મુક્ત હોવાથી ફિલોસોફર 4 આરામથી જમી શકે છે. આ રીતે ડેડલોક ટળી જાય છે!",
        waiter: "કાફે વેઇટરે હવે ટેબલ પર એકસાથે વધુમાં વધુ ચાર લોકોને જ પરવાનગી આપી છે. પાંચ કાંટા વચ્ચે ચાર જ લોકો હોવાથી ઓછામાં ઓછો એક મિત્ર જમી જ શકશે!",
        tanenbaum: "આ ટેનેનબૌમનું ઓલ-ઓર-નથિંગ મોનિટર સોલ્યુશન છે! બંને કાંટા ખાલી હોય તો જ ઉપાડે છે.",
        mutex_acquired: (thread) => `${thread} એ મ્યુટેક્સ લોક મેળવી લીધું છે.`,
        mutex_blocked: (thread) => `${thread} લોક ના મળવાથી બ્લોક થઈ ગયો છે.`,
        semaphore_signal: "સેમાફોરે પરમિટ સિગ્નલ આપીને રાહ જોતા થ્રેડને સક્રિય કર્યો.",
        reset: "ટેબલ રીસેટ થઈ ગયું છે! બધા કાંટા ટેબલ પર પાછા આવી ગયા છે."
      }
    };

    this.initVoices();
  }

  initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(state) {
    this.listeners.forEach(cb => cb(state));
  }

  setLanguage(lang) {
    if (this.scripts[lang]) {
      this.currentLang = lang;
      this.notify({ lang: this.currentLang, enabled: this.enabled, isSpeaking: this.isSpeaking });
      return true;
    }
    return false;
  }

  setRate(val) {
    this.rate = Math.max(0.5, Math.min(2.0, parseFloat(val) || 1.0));
  }

  toggleEnabled() {
    this.enabled = !this.enabled;
    if (!this.enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
    this.notify({ lang: this.currentLang, enabled: this.enabled, isSpeaking: this.isSpeaking });
    return this.enabled;
  }

  getBestVoiceForLang(langCode) {
    if (!this.availableVoices.length && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    const prefix = langCode.slice(0, 2);
    let match = this.availableVoices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
    if (match) return match;

    match = this.availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    if (prefix === 'gu') {
      match = this.availableVoices.find(v => v.lang.toLowerCase().startsWith('hi'));
      if (match) return match;
    }

    return this.availableVoices.find(v => v.lang.toLowerCase().startsWith('en')) || this.availableVoices[0] || null;
  }

  speakKey(key, ...args) {
    const langScripts = this.scripts[this.currentLang] || this.scripts['en-US'];
    const textOrFn = langScripts[key];
    if (!textOrFn) return;

    const text = typeof textOrFn === 'function' ? textOrFn(...args) : textOrFn;
    this.speak(text);
  }

  speak(text) {
    if (!text || typeof window === 'undefined') return;

    this.notify({ text, lang: this.currentLang, enabled: this.enabled, isSpeaking: true });

    if (!this.enabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLang;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    const voice = this.getBestVoiceForLang(this.currentLang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify({ text, lang: this.currentLang, enabled: this.enabled, isSpeaking: true });
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify({ text, lang: this.currentLang, enabled: this.enabled, isSpeaking: false });
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify({ text, lang: this.currentLang, enabled: this.enabled, isSpeaking: false });
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.notify({ text: '', lang: this.currentLang, enabled: this.enabled, isSpeaking: false });
    }
  }
}

export const speechNarrator = new SpeechNarrator();
export default speechNarrator;
