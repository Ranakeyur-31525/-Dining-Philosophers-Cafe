/**
 * app.js
 * Master UI glue and Event Handler for Dining Philosophers Café
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const btnToggleAudio = document.getElementById('btnToggleAudio');
  const audioIcon = document.getElementById('audioIcon');
  const audioLabel = document.getElementById('audioLabel');
  const langSelect = document.getElementById('langSelect');
  const rateSelect = document.getElementById('rateSelect');
  const btnTestVoice = document.getElementById('btnTestVoice');

  const btnModeStory = document.getElementById('btnModeStory');
  const btnModeTech = document.getElementById('btnModeTech');

  const btnDeadlock = document.getElementById('btnDeadlock');
  const btnStarvation = document.getElementById('btnStarvation');
  const btnResourceOrder = document.getElementById('btnResourceOrder');
  const btnWaiter = document.getElementById('btnWaiter');
  const btnTanenbaum = document.getElementById('btnTanenbaum');

  const btnPlayPause = document.getElementById('btnPlayPause');
  const playIcon = document.getElementById('playIcon');
  const playLabel = document.getElementById('playLabel');
  const btnStep = document.getElementById('btnStep');
  const btnReset = document.getElementById('btnReset');
  const speedButtons = document.querySelectorAll('.speed-btn');

  const stageCard = document.getElementById('stageCard');
  const statusPill = document.getElementById('statusPill');
  const statusIndicatorIcon = document.getElementById('statusIndicatorIcon');
  const statusIndicatorText = document.getElementById('statusIndicatorText');
  const tableCenterHub = document.getElementById('tableCenterHub');
  const hubIcon = document.getElementById('hubIcon');
  const hubTitle = document.getElementById('hubTitle');
  const hubSub = document.getElementById('hubSub');
  const waiterBadge = document.getElementById('waiterBadge');

  const voiceWave = document.getElementById('voiceWave');
  const voiceSubtitleText = document.getElementById('voiceSubtitleText');
  const voiceLangBadge = document.getElementById('voiceLangBadge');

  // Manual panel
  const pSelectButtons = document.querySelectorAll('.p-select-pill');
  const btnPickLeft = document.getElementById('btnPickLeft');
  const btnPickRight = document.getElementById('btnPickRight');
  const btnManualRelease = document.getElementById('btnManualRelease');
  const manualLeftLabel = document.getElementById('manualLeftLabel');
  const manualRightLabel = document.getElementById('manualRightLabel');

  const logStream = document.getElementById('logStream');
  const btnClearLog = document.getElementById('btnClearLog');

  // Drawer
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.drawer-tab-content');
  const mutexTableBody = document.getElementById('mutexTableBody');
  const btnCopyCode = document.getElementById('btnCopyCode');
  const cCodeBlock = document.getElementById('cCodeBlock');

  let selectedPhilId = 0;
  let activeScenarioBtn = null;

  // ========================================================================
  // VOICE NARRATOR INTEGRATION
  // ========================================================================
  if (window.narrator) {
    window.narrator.onStateChange = ({ speaking, text, lang, enabled }) => {
      if (voiceWave) {
        if (speaking) voiceWave.classList.add('speaking');
        else voiceWave.classList.remove('speaking');
      }

      if (text && voiceSubtitleText) {
        voiceSubtitleText.textContent = text;
      }

      if (voiceLangBadge) {
        const flagMap = { 'en-US': '🇬🇧 Voice: English', 'hi-IN': '🇮🇳 Voice: हिंदी', 'gu-IN': '🇮🇳 Voice: ગુજરાતી' };
        voiceLangBadge.textContent = flagMap[lang] || '🔊 Voice Narrator';
      }

      if (audioIcon && audioLabel && btnToggleAudio) {
        if (enabled) {
          audioIcon.textContent = '🔊';
          audioLabel.textContent = 'Narrator ON';
          btnToggleAudio.classList.remove('muted');
        } else {
          audioIcon.textContent = '🔇';
          audioLabel.textContent = 'MUTE';
          btnToggleAudio.classList.add('muted');
        }
      }
    };

    // Welcome speech
    setTimeout(() => {
      window.narrator.speakKey('welcome');
    }, 800);
  }

  btnToggleAudio.addEventListener('click', () => {
    if (window.narrator) {
      window.narrator.toggleEnabled();
    }
  });

  langSelect.addEventListener('change', (e) => {
    if (window.narrator) {
      window.narrator.setLanguage(e.target.value);
      const testTexts = {
        'en-US': 'English voice narration active.',
        'hi-IN': 'हिंदी आवाज़ शुरू हो चुकी है।',
        'gu-IN': 'ગુજરાતી અવાજ સક્રિય થઈ ગયો છે.'
      };
      window.narrator.speak(testTexts[e.target.value]);
    }
  });

  rateSelect.addEventListener('change', (e) => {
    if (window.narrator) {
      window.narrator.setRate(e.target.value);
    }
  });

  btnTestVoice.addEventListener('click', () => {
    if (window.narrator) {
      const curLang = window.narrator.currentLang;
      const testTexts = {
        'en-US': 'Testing audio! The Dining Philosophers Café voice narration is crystal clear!',
        'hi-IN': 'ऑडियो टेस्ट! डाइनिंग फिलॉसफर्स कैफे में आपका स्वागत है!',
        'gu-IN': 'ઓડિયો ટેસ્ટ! ડાઇનિંગ ફિલોસોફર્સ કાફેમાં તમારું સ્વાગત છે!'
      };
      window.narrator.speak(testTexts[curLang] || testTexts['en-US']);
    }
  });

  // Mode buttons
  btnModeStory.addEventListener('click', () => {
    btnModeStory.classList.add('active');
    btnModeTech.classList.remove('active');
    switchDrawerTab('tab-story');
  });

  btnModeTech.addEventListener('click', () => {
    btnModeTech.classList.add('active');
    btnModeStory.classList.remove('active');
    switchDrawerTab('tab-coffman');
  });

  // ========================================================================
  // SCENARIO BUTTONS
  // ========================================================================
  function setActiveScenarioBtn(btn) {
    [btnDeadlock, btnStarvation, btnResourceOrder, btnWaiter, btnTanenbaum].forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    activeScenarioBtn = btn;
  }

  btnDeadlock.addEventListener('click', () => {
    setActiveScenarioBtn(btnDeadlock);
    window.sim.loadScenario('deadlock');
    window.sim.play();
  });

  btnStarvation.addEventListener('click', () => {
    setActiveScenarioBtn(btnStarvation);
    window.sim.loadScenario('starvation');
    window.sim.play();
  });

  btnResourceOrder.addEventListener('click', () => {
    setActiveScenarioBtn(btnResourceOrder);
    window.sim.loadScenario('resource_order');
    window.sim.play();
  });

  btnWaiter.addEventListener('click', () => {
    setActiveScenarioBtn(btnWaiter);
    window.sim.loadScenario('waiter');
    window.sim.play();
  });

  btnTanenbaum.addEventListener('click', () => {
    setActiveScenarioBtn(btnTanenbaum);
    window.sim.loadScenario('tanenbaum');
    window.sim.play();
  });

  // Playback Controls
  btnPlayPause.addEventListener('click', () => {
    if (window.sim.isRunning) {
      window.sim.pause();
    } else {
      window.sim.play();
    }
  });

  btnStep.addEventListener('click', () => {
    window.sim.pause();
    window.sim.stepForward();
  });

  btnReset.addEventListener('click', () => {
    setActiveScenarioBtn(null);
    window.sim.reset();
    if (window.narrator) window.narrator.speakKey('reset');
  });

  speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      speedButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.sim.setSpeed(btn.dataset.speed);
    });
  });

  // ========================================================================
  // MANUAL LAB
  // ========================================================================
  function updateManualTarget(id) {
    selectedPhilId = id;
    pSelectButtons.forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.p) === id);
    });
    manualLeftLabel.textContent = `F${id}`;
    manualRightLabel.textContent = `F${(id + 1) % 5}`;
  }

  pSelectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateManualTarget(parseInt(btn.dataset.p));
    });
  });

  // Allow clicking on any philosopher on the table directly!
  document.querySelectorAll('.philosopher-node').forEach(node => {
    node.addEventListener('click', () => {
      const id = parseInt(node.dataset.id);
      updateManualTarget(id);
      // Subtle pulse feedback
      node.style.transform = 'scale(1.15)';
      setTimeout(() => { node.style.transform = ''; }, 300);
    });
  });

  btnPickLeft.addEventListener('click', () => {
    window.sim.pause();
    window.sim.scenarioName = 'manual';
    window.sim.manualPickLeft(selectedPhilId);
  });

  btnPickRight.addEventListener('click', () => {
    window.sim.pause();
    window.sim.scenarioName = 'manual';
    window.sim.manualPickRight(selectedPhilId);
  });

  btnManualRelease.addEventListener('click', () => {
    window.sim.pause();
    window.sim.manualRelease(selectedPhilId);
  });

  btnClearLog.addEventListener('click', () => {
    logStream.innerHTML = '';
  });

  // ========================================================================
  // DRAWER TABS & CODE COPY
  // ========================================================================
  function switchDrawerTab(tabId) {
    tabButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    tabContents.forEach(c => {
      c.classList.toggle('active', c.id === tabId);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchDrawerTab(btn.dataset.tab);
    });
  });

  // Viva Accordion
  document.querySelectorAll('.viva-question').forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      parent.classList.toggle('open');
    });
  });

  // Copy C Code
  btnCopyCode.addEventListener('click', () => {
    if (cCodeBlock) {
      navigator.clipboard.writeText(cCodeBlock.textContent).then(() => {
        btnCopyCode.textContent = '✅ Copied!';
        setTimeout(() => { btnCopyCode.textContent = '📋 Copy C Code'; }, 2000);
      });
    }
  });

  // ========================================================================
  // RENDER SUBSCRIBER (MAIN VIEWPORT SYNCHRONIZATION)
  // ========================================================================
  window.sim.subscribe((sim) => {
    // 1. Play/Pause UI state
    if (sim.isRunning) {
      playIcon.textContent = '⏸';
      playLabel.textContent = 'Pause';
      btnPlayPause.classList.add('running');
    } else {
      playIcon.textContent = '▶';
      playLabel.textContent = 'Run Auto';
      btnPlayPause.classList.remove('running');
    }

    // 2. Status Pill & Table Center Hub
    if (sim.deadlockDetected) {
      stageCard.classList.add('deadlock-alert');
      statusPill.className = 'status-pill deadlock';
      statusIndicatorIcon.textContent = '🔴';
      statusIndicatorText.textContent = 'DEADLOCK: TOTAL CIRCULAR WAIT!';

      tableCenterHub.className = 'table-center-hub deadlock';
      hubIcon.textContent = '💀';
      hubTitle.textContent = 'DEADLOCK!';
      hubSub.textContent = 'P0 → P1 → P2 → P3 → P4 → P0\nRoundabout Jam!';

      // Activate all 5 wait vectors
      for (let i = 0; i < 5; i++) {
        const arc = document.getElementById(`waitArc${i}`);
        if (arc) arc.classList.add('deadlock-active');
      }
    } else if (sim.starvationDetected) {
      stageCard.classList.remove('deadlock-alert');
      statusPill.className = 'status-pill starvation';
      statusIndicatorIcon.textContent = '⚠️';
      statusIndicatorText.textContent = 'STARVATION / LIVELOCK DETECTED';

      tableCenterHub.className = 'table-center-hub';
      hubIcon.textContent = '⚠️';
      hubTitle.textContent = 'STARVATION';
      hubSub.textContent = 'Neighbors monopolizing forks\nVictim locked out!';

      for (let i = 0; i < 5; i++) {
        const arc = document.getElementById(`waitArc${i}`);
        if (arc) arc.classList.remove('deadlock-active');
      }
    } else {
      stageCard.classList.remove('deadlock-alert');
      statusPill.className = 'status-pill';
      statusIndicatorIcon.textContent = '🟢';
      statusIndicatorText.textContent = 'SAFE STATE — NO CYCLE';

      tableCenterHub.className = 'table-center-hub';
      hubIcon.textContent = '🍝';
      hubTitle.textContent = 'CAFÉ PEACEFUL';
      hubSub.textContent = '5 Friends • 5 Forks\nNeed 2 Forks to Eat';

      for (let i = 0; i < 5; i++) {
        const arc = document.getElementById(`waitArc${i}`);
        if (arc) arc.classList.remove('deadlock-active');
      }
    }

    // 3. Waiter Character visibility
    if (sim.waiterActive) {
      waiterBadge.classList.add('visible');
    } else {
      waiterBadge.classList.remove('visible');
    }

    // 4. Update Philosophers
    sim.philosophers.forEach((p, idx) => {
      const node = document.getElementById(`phil${idx}`);
      const thought = document.getElementById(`thought${idx}`);
      const meals = document.getElementById(`meals${idx}`);
      const hunger = document.getElementById(`hunger${idx}`);
      const avatar = document.getElementById(`avatar${idx}`);

      if (node) {
        node.className = `philosopher-node p-node-${idx} state-${p.state}`;
      }

      if (thought) {
        thought.textContent = p.thought;
        thought.className = 'thought-bubble';
        if (p.state === 'DEADLOCKED') thought.classList.add('deadlock-thought');
      }

      if (meals) {
        meals.textContent = `Meals: ${p.mealsEaten}`;
      }

      if (hunger) {
        hunger.style.width = `${Math.min(100, p.hunger)}%`;
        hunger.className = 'hunger-bar-fill';
        if (p.hunger > 60) hunger.classList.add('critical');
      }

      if (avatar) {
        if (p.state === 'EATING') avatar.textContent = '😋';
        else if (p.state === 'DEADLOCKED') avatar.textContent = '😱';
        else if (p.state === 'STARVING') avatar.textContent = '💀';
        else if (p.state === 'WAITING') avatar.textContent = '⏳';
        else avatar.textContent = ['👩🏽‍🎓', '👨🏻‍💻', '👨🏽‍🎨', '👩🏻‍🔬', '👨🏾‍🏫'][idx];
      }
    });

    // 5. Update Forks & Animated Positions
    sim.forks.forEach((f, idx) => {
      const forkEl = document.getElementById(`fork${idx}`);
      const forkTag = document.getElementById(`forkTag${idx}`);

      if (forkEl) {
        // Remove all held-by-pX classes
        forkEl.className = `fork-item fork-${idx}`;
        if (f.heldBy !== null) {
          forkEl.classList.add('held', `held-by-p${f.heldBy}`);
          if (forkTag) forkTag.textContent = `F${idx}: P${f.heldBy}`;
        } else {
          if (forkTag) forkTag.textContent = `F${idx}: FREE`;
        }
      }
    });

    // 6. Concurrency Log Stream
    renderLogs(sim.logs);

    // 7. Update Mutex Table & Coffman Matrix (For Engineering Mode)
    renderMutexTable(sim);
    renderCoffmanMatrix(sim);
  });

  function renderLogs(logs) {
    if (!logStream) return;
    logStream.innerHTML = '';
    logs.forEach(item => {
      const row = document.createElement('div');
      row.className = 'log-entry';
      row.innerHTML = `<span class="log-time">${item.time}</span><span class="log-text">${item.text}</span>`;
      logStream.appendChild(row);
    });
  }

  function renderMutexTable(sim) {
    if (!mutexTableBody) return;
    mutexTableBody.innerHTML = '';

    sim.forks.forEach(f => {
      const tr = document.createElement('tr');
      const isLocked = f.heldBy !== null;
      const leftPhilId = (f.id + 4) % 5;
      const rightPhilId = f.id;

      tr.innerHTML = `
        <td><strong>Fork ${f.id} (pthread_mutex_t)</strong></td>
        <td><span style="color: ${isLocked ? '#ef4444' : '#10b981'}; font-weight:700;">${isLocked ? 'LOCKED (0)' : 'UNLOCKED (1)'}</span></td>
        <td>${isLocked ? `Philosopher ${f.heldBy} (${sim.philosophers[f.heldBy].name.split(' ')[0]})` : '<span style="color:#64748b">None (Free on Table)</span>'}</td>
        <td>P${leftPhilId} (${sim.philosophers[leftPhilId].name.split(' ')[0]})</td>
        <td>P${rightPhilId} (${sim.philosophers[rightPhilId].name.split(' ')[0]})</td>
        <td>${sim.deadlockDetected ? '<span style="color:#ef4444; font-weight:700;">CIRCULAR CONFLICT</span>' : isLocked ? 'Acquired' : 'Available'}</td>
      `;
      mutexTableBody.appendChild(tr);
    });
  }

  function renderCoffmanMatrix(sim) {
    const cardME = document.getElementById('coffmanCardME');
    const cardHW = document.getElementById('coffmanCardHW');
    const cardNP = document.getElementById('coffmanCardNP');
    const cardCW = document.getElementById('coffmanCardCW');

    const badgeME = document.getElementById('badgeME');
    const badgeHW = document.getElementById('badgeHW');
    const badgeNP = document.getElementById('badgeNP');
    const badgeCW = document.getElementById('badgeCW');

    if (!cardME) return;

    // Reset classes
    [cardME, cardHW, cardNP, cardCW].forEach(c => {
      c.classList.remove('violated', 'broken');
    });

    if (sim.deadlockDetected) {
      [cardME, cardHW, cardNP, cardCW].forEach(c => c.classList.add('violated'));
      badgeME.textContent = 'FULFILLED (1/1)';
      badgeHW.textContent = 'FULFILLED (All Hold Left)';
      badgeNP.textContent = 'FULFILLED (No Preempt)';
      badgeCW.textContent = 'FULFILLED (Cycle 0-4)';
    } else if (sim.scenarioName === 'resource_order') {
      cardCW.classList.add('broken');
      badgeCW.textContent = 'BROKEN BY TOTAL ORDER';
      badgeHW.textContent = 'Active';
    } else if (sim.scenarioName === 'tanenbaum') {
      cardHW.classList.add('broken');
      badgeHW.textContent = 'BROKEN BY ATOMIC PICKUP';
      badgeCW.textContent = 'Prevented';
    } else if (sim.scenarioName === 'waiter') {
      cardCW.classList.add('broken');
      badgeCW.textContent = 'BROKEN (Pigeonhole: 4 Diners)';
    } else {
      badgeME.textContent = 'ACTIVE';
      badgeHW.textContent = 'PASSIVE';
      badgeNP.textContent = 'ACTIVE';
      badgeCW.textContent = 'NO CYCLE';
    }
  }

  // Initial render
  window.sim.notify();
});
