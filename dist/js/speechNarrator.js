/**
 * speechNarrator.js
 * Tri-lingual Voice Narration using Web Speech API (window.speechSynthesis)
 * Supports: English (en-US), Hindi (hi-IN), Gujarati (gu-IN)
 * 100% Client-side, zero external dependencies, works offline.
 */

class SpeechNarrator {
  constructor() {
    this.enabled = true;
    this.currentLang = 'en-US'; // 'en-US' | 'hi-IN' | 'gu-IN'
    this.rate = 0.95;
    this.pitch = 1.0;
    this.availableVoices = [];
    this.isSpeaking = false;
    this.onStateChange = null; // callback for UI updates

    this.scripts = {
      'en-US': {
        welcome: "Welcome to the Dining Philosophers Café! Five friends need two forks to eat noodles. Let's see what happens when concurrency goes wrong!",
        deadlock: "Look! All five friends grabbed their left fork at the exact same time. Now, everyone is waiting for their right fork. Nobody can eat, and nobody will let go. This complete freeze is called Deadlock!",
        deadlock_step: "Every single fork is now locked in someone's left hand! With everyone waiting for their right neighbor, circular wait has formed. Deadlock is now total!",
        starvation: "Watch Dev sitting at position 2! His neighbors Priya and Kabir keep sharing the forks back and forth. Even though the cafe is running, Dev gets zero noodles and is starving! In OS terms, this is starvation or livelock.",
        resource_order: "Now we apply Resource Ordering, also known as Havender's Algorithm. Watch Friend number 4, Kabir! The rule forces him to wait for Fork 0 before touching Fork 4. Because Fork 4 is left free on the table, Meera can eat noodles happily. The cycle is broken!",
        waiter: "The café waiter now limits the table to a maximum of four diners at once! Because four diners compete for five forks, by the Pigeonhole Principle at least one friend is guaranteed to get two forks. Deadlock is mathematically impossible!",
        tanenbaum: "Here is Tanenbaum's All-or-Nothing Monitor solution! A friend only touches their forks if BOTH left and right forks are completely free on the table simultaneously. If one is busy, they touch neither, preventing hold and wait!",
        manual_deadlock: "Congratulations! You manually created a Deadlock! Notice how all 5 forks are held in left hands, forming an unbreakable circular wait.",
        reset: "Table has been reset! All forks are back in the center, and all five friends are thinking peacefully.",
        fork_taken: (pName, fId, hand) => `${pName} picked up Fork ${fId} in their ${hand} hand.`,
        fork_released: (pName, fId) => `${pName} put Fork ${fId} back on the table.`,
        eating: (pName) => `${pName} now has two forks and is eating noodles!`
      },

      'hi-IN': {
        welcome: "डाइनिंग फिलॉसफर्स कैफे में आपका स्वागत है! पांच दोस्तों को नूडल्स खाने के लिए दो कांटे चाहिए। आइए देखें कि जब सिस्टम में तालमेल बिगड़ता है तो क्या होता है!",
        deadlock: "देखिए! सभी पांच दोस्तों ने एक ही समय पर अपना बायां कांटा उठा लिया। अब हर कोई अपने दाएं कांटे का इंतजार कर रहा है। कोई खा नहीं पा रहा है और कोई छोड़ भी नहीं रहा। इसे ही डेडलॉक कहते हैं!",
        deadlock_step: "टेबल का हर कांटा किसी न किसी के बाएं हाथ में फंस गया है! हर दोस्त अपने पड़ोसी के कांटे का इंतजार कर रहा है। यह पूरी तरह से सर्कुलर वेट बन गया है!",
        starvation: "दोस्त नंबर 2, देव को देखिए! उसके दोनों पड़ोसी बारी-बारी से कांटे इस्तेमाल कर रहे हैं, जिससे देव को कभी दोनों कांटे नहीं मिल पाते और वह भूखा रह जाता है। इसे स्टार्वेशन कहते हैं!",
        resource_order: "अब हमने रिसोर्स ऑर्डरिंग का नियम लागू किया है। दोस्त नंबर 4, कबीर को देखिए! नियम के कारण वह कांटा 4 छुए बिना कांटा 0 का इंतज़ार कर रहा है। कांटा 4 खाली रहने से मीरा आराम से नूडल्स खा सकी। चक्र टूट गया!",
        waiter: "कैफे वेटर ने अब टेबल पर एक बार में सिर्फ चार लोगों को कांटे उठाने की अनुमति दी है। पांच कांटों के लिए चार लोग हैं, इसलिए कम से कम एक व्यक्ति को दोनों कांटे जरूर मिलेंगे! डेडलॉक नामुमकिन है!",
        tanenbaum: "यह टेनेनबॉम का ऑल-ऑर-नथिंग मॉनिटर समाधान है! कोई भी दोस्त कांटे तभी उठाएगा जब दोनों कांटे एक साथ टेबल पर खाली हों। अगर एक भी व्यस्त है, तो वह किसी को हाथ नहीं लगाएगा!",
        manual_deadlock: "शाबाश! आपने खुद डेडलॉक बनाकर देखा। सभी पांच दोस्तों ने बायां कांटा पकड़ रखा है और पूरा सिस्टम जाम हो गया है।",
        reset: "टेबल रीसेट कर दी गई है! सारे कांटे टेबल पर वापस आ गए हैं और सभी दोस्त सोच रहे हैं।",
        fork_taken: (pName, fId, hand) => `${pName} ने अपने ${hand === 'left' ? 'बाएं' : 'दाएं'} हाथ में कांटा ${fId} उठा लिया।`,
        fork_released: (pName, fId) => `${pName} ने कांटा ${fId} वापस टेबल पर रख दिया।`,
        eating: (pName) => `${pName} को दोनों कांटे मिल गए और वह नूडल्स खा रहा है!`
      },

      'gu-IN': {
        welcome: "ડાઇનિંગ ફિલોસોફર્સ કાફેમાં તમારું સ્વાગત છે! પાંચ મિત્રોને નૂડલ્સ ખાવા માટે બે કાંટા જોઈએ છે. ચાલો જોઈએ જ્યારે સિસ્ટમમાં તાલમેલ બગડે ત્યારે શું થાય છે!",
        deadlock: "જુઓ! પાંચેય મિત્રોએ એકસાથે પોતાનો ડાબો કાંટો ઉપાડી લીધો છે. હવે બધા જમણા કાંટાની રાહ જોઈ રહ્યા છે. કોઈ જમી નથી શકતું અને કોઈ કાંટો મૂકવા પણ તૈયાર નથી. આ સંપૂર્ણ સ્થિતિને ડેડલોક કહેવાય છે!",
        deadlock_step: "ટેબલનો દરેક કાંટો કોઈકના ડાબા હાથમાં બંધાઈ ગયો છે! દરેક મિત્ર પડોશીના કાંટાની રાહ જુએ છે. આને સર્ક્યુલર વેઇટ કહેવાય છે!",
        starvation: "મિત્ર નંબર 2, દેવને જુઓ! તેના બંને પડોશીઓ વારાફરતી કાંટા વાપરી રહ્યા છે, જેથી દેવને ક્યારેય બંને કાંટા મળતા નથી અને તે ભૂખ્યો રહે છે. આને સ્ટાર્વેશન કહે છે!",
        resource_order: "હવે આપણે રિસોર્સ ઓર્ડરિંગનો નિયમ લાગુ કર્યો છે. મિત્ર નંબર 4, કબીરને જુઓ! નિયમ મુજબ તે કાંટો 4 લીધા વગર કાંટો 0 ની રાહ જુએ છે. કાંટો 4 ટેબલ પર મુક્ત હોવાથી મીરા આરામથી જમી શકે છે. આ રીતે ડેડલોક ટળી જાય છે!",
        waiter: "કાફે વેઇટરે હવે ટેબલ પર એકસાથે વધુમાં વધુ ચાર લોકોને જ પરવાનગી આપી છે. પાંચ કાંટા વચ્ચે ચાર જ લોકો હોવાથી ઓછામાં ઓછો એક મિત્ર બંને કાંટા મેળવીને જમી જ શકશે!",
        tanenbaum: "આ ટેનેનબૌમનું ઓલ-ઓર-નથિંગ મોનિટર સોલ્યુશન છે! કોઈપણ મિત્ર બંને કાંટા એકસાથે ખાલી હોય તો જ ઉપાડે છે. જો એક પણ વ્યસ્ત હોય તો તે કોઈને સ્પર્શ પણ નથી કરતો!",
        manual_deadlock: "અભિનંદન! તમે જાતે ડેડલોક બનાવીને જોયું. બધા પાંચ મિત્રોએ ડાબો કાંટો પકડી રાખ્યો છે અને ચક્ર અટકી ગયું છે.",
        reset: "ટેબલ રીસેટ થઈ ગયું છે! બધા કાંટા ટેબલ પર પાછા આવી ગયા છે અને મિત્રો શાંતિથી વિચારી રહ્યા છે.",
        fork_taken: (pName, fId, hand) => `${pName} એ પોતાના ${hand === 'left' ? 'ડાબા' : 'જમણા'} હાથમાં કાંટો ${fId} ઉપાડ્યો.`,
        fork_released: (pName, fId) => `${pName} એ કાંટો ${fId} ટેબલ પર પાછો મૂક્યો.`,
        eating: (pName) => `${pName} પાસે બંને કાંટા આવી ગયા છે અને તે નૂડલ્સ જમી રહ્યો છે!`
      }
    };

    this.initVoices();
  }

  initVoices() {
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  setLanguage(lang) {
    if (this.scripts[lang]) {
      this.currentLang = lang;
      return true;
    }
    return false;
  }

  setRate(val) {
    this.rate = Math.max(0.5, Math.min(2.0, parseFloat(val) || 1.0));
  }

  toggleEnabled() {
    this.enabled = !this.enabled;
    if (!this.enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.notifyState(false, '');
    }
    return this.enabled;
  }

  getBestVoiceForLang(langCode) {
    if (!this.availableVoices.length && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }

    const prefix = langCode.slice(0, 2); // 'en', 'hi', 'gu'
    
    // Direct match (e.g. 'gu-IN' or 'hi-IN')
    let match = this.availableVoices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
    if (match) return match;

    // Prefix match (e.g. starts with 'hi' or 'gu')
    match = this.availableVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    // In case Gujarati voice is not locally installed on Windows, fallback to Hindi voice
    // since Hindi voices can often pronounce Devnagari / Indic phonetic scripts cleanly
    if (prefix === 'gu') {
      match = this.availableVoices.find(v => v.lang.toLowerCase().startsWith('hi'));
      if (match) return match;
    }

    // Default to en-US or first available
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
    if (!text) return;

    // Always update subtitle ticker regardless of mute toggle so users can see the transcript!
    this.notifyState(this.enabled, text);

    if (!this.enabled || !('speechSynthesis' in window)) {
      return;
    }

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
      this.notifyState(true, text);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.notifyState(false, text);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.notifyState(false, text);
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.notifyState(false, '');
    }
  }

  notifyState(speaking, text) {
    if (typeof this.onStateChange === 'function') {
      this.onStateChange({ speaking, text, lang: this.currentLang, enabled: this.enabled });
    }
  }
}

// Global instance
window.narrator = new SpeechNarrator();
