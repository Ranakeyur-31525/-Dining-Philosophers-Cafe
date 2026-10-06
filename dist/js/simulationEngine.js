/**
 * simulationEngine.js
 * State Machine and Controller for the Dining Philosophers Café
 */

class SimulationEngine {
  constructor() {
    this.numPhilosophers = 5;
    this.listeners = [];
    this.isRunning = false;
    this.runInterval = null;
    this.speed = 1.0; // 0.5x, 1x, 2x
    this.scenarioName = 'idle';
    this.activeScenarioObj = null;
    this.currentStep = 0;
    this.deadlockDetected = false;
    this.starvationDetected = false;
    this.waiterActive = false;
    this.statusMessage = 'Welcome to Dining Philosophers Café! Select a scenario or click any friend to begin.';
    this.logs = [];

    this.reset();
  }

  reset() {
    this.pause();
    this.scenarioName = 'idle';
    this.activeScenarioObj = null;
    this.currentStep = 0;
    this.deadlockDetected = false;
    this.starvationDetected = false;
    this.waiterActive = false;
    this.statusMessage = 'Table reset. All friends are thinking, and all 5 forks are on the table.';

    const names = ['Priya (P0)', 'Arjun (P1)', 'Dev (P2)', 'Meera (P3)', 'Kabir (P4)'];
    const emojis = ['👩🏽‍🎓', '👨🏻‍💻', '👨🏽‍🎨', '👩🏻‍🔬', '👨🏾‍🏫'];

    this.philosophers = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: names[i],
      avatar: emojis[i],
      state: 'THINKING', // THINKING, HUNGRY, WAITING, EATING, STARVING, DEADLOCKED
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      hasLeft: false,
      hasRight: false,
      mealsEaten: 0,
      hunger: 0,
      thought: 'Thinking deeply about operating systems...'
    }));

    this.forks = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: null // null or philosopher index 0..4
    }));

    this.addLog('Reset simulation table to initial state.');
    this.notify();
  }

  addLog(msg) {
    const time = new Date().toLocaleTimeString();
    this.logs.unshift({ time, text: msg });
    if (this.logs.length > 80) this.logs.pop();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  loadScenario(key) {
    this.pause();
    this.reset();
    this.scenarioName = key;
    this.currentStep = 0;

    switch (key) {
      case 'deadlock':
        this.activeScenarioObj = window.DeadlockScenario;
        break;
      case 'starvation':
        this.activeScenarioObj = window.StarvationScenario;
        break;
      case 'resource_order':
        this.activeScenarioObj = window.ResourceOrderScenario;
        break;
      case 'waiter':
        this.activeScenarioObj = window.WaiterScenario;
        break;
      case 'tanenbaum':
        this.activeScenarioObj = window.TanenbaumScenario;
        break;
      default:
        this.activeScenarioObj = null;
    }

    if (this.activeScenarioObj && typeof this.activeScenarioObj.init === 'function') {
      this.activeScenarioObj.init(this);
    }

    this.notify();
  }

  stepForward() {
    if (!this.activeScenarioObj) {
      this.statusMessage = 'Please select a scenario above (e.g. Deadlock, Waiter, Resource Ordering) to step through.';
      this.notify();
      return;
    }

    if (this.currentStep >= this.activeScenarioObj.totalSteps) {
      this.statusMessage = `Scenario completed! Click [↺ Reset Table] or select another mode.`;
      this.pause();
      this.notify();
      return;
    }

    this.activeScenarioObj.executeStep(this, this.currentStep);
    this.currentStep++;
    this.checkSystemState();
    this.notify();
  }

  play() {
    if (this.isRunning) return;
    if (!this.activeScenarioObj) {
      this.loadScenario('deadlock');
    }

    this.isRunning = true;
    const baseDelay = 2200;
    const delay = Math.max(600, Math.floor(baseDelay / this.speed));

    this.runInterval = setInterval(() => {
      if (this.activeScenarioObj && this.currentStep >= this.activeScenarioObj.totalSteps) {
        if (this.scenarioName === 'starvation') {
          // Loop starvation to continue demonstrating the tragedy
          this.activeScenarioObj.executeStep(this, this.currentStep);
          this.currentStep++;
          this.notify();
          return;
        }
        this.pause();
        return;
      }
      this.stepForward();
    }, delay);

    this.notify();
  }

  pause() {
    this.isRunning = false;
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    this.notify();
  }

  setSpeed(multiplier) {
    this.speed = parseFloat(multiplier) || 1.0;
    if (this.isRunning) {
      this.pause();
      this.play();
    } else {
      this.notify();
    }
  }

  // Helper actions
  takeForks(pId, leftFId, rightFId) {
    this.forks[leftFId].heldBy = pId;
    this.forks[rightFId].heldBy = pId;
    this.philosophers[pId].hasLeft = true;
    this.philosophers[pId].hasRight = true;
  }

  releaseForks(pId) {
    const p = this.philosophers[pId];
    if (p.hasLeft) {
      this.forks[p.leftForkId].heldBy = null;
      p.hasLeft = false;
    }
    if (p.hasRight) {
      this.forks[p.rightForkId].heldBy = null;
      p.hasRight = false;
    }
  }

  releaseAllForks() {
    this.forks.forEach(f => (f.heldBy = null));
    this.philosophers.forEach(p => {
      p.hasLeft = false;
      p.hasRight = false;
    });
  }

  // Interactive Manual Actions
  manualPickLeft(pId) {
    const p = this.philosophers[pId];
    const fId = p.leftForkId;
    if (this.forks[fId].heldBy !== null) {
      this.statusMessage = `Fork F${fId} is already held by ${this.philosophers[this.forks[fId].heldBy].name}!`;
      this.notify();
      return false;
    }

    this.forks[fId].heldBy = pId;
    p.hasLeft = true;
    if (p.hasRight) {
      p.state = 'EATING';
      p.mealsEaten++;
      p.thought = 'Yum! Slurping noodles with both forks! 🍜';
      if (window.audioSynth) window.audioSynth.playEatingSound();
      if (window.narrator) window.narrator.speakKey('eating', p.name);
    } else {
      p.state = 'WAITING';
      p.thought = `Holding left Fork F${fId}. Looking for right Fork F${p.rightForkId}...`;
      if (window.audioSynth) window.audioSynth.playForkClink();
      if (window.narrator) window.narrator.speakKey('fork_taken', p.name, fId, 'left');
    }

    this.addLog(`${p.name} picked up left Fork F${fId}.`);
    this.checkSystemState();
    this.notify();
    return true;
  }

  manualPickRight(pId) {
    const p = this.philosophers[pId];
    const fId = p.rightForkId;
    if (this.forks[fId].heldBy !== null) {
      this.statusMessage = `Fork F${fId} is already held by ${this.philosophers[this.forks[fId].heldBy].name}!`;
      this.notify();
      return false;
    }

    this.forks[fId].heldBy = pId;
    p.hasRight = true;
    if (p.hasLeft) {
      p.state = 'EATING';
      p.mealsEaten++;
      p.thought = 'Yum! Slurping noodles with both forks! 🍜';
      if (window.audioSynth) window.audioSynth.playEatingSound();
      if (window.narrator) window.narrator.speakKey('eating', p.name);
    } else {
      p.state = 'WAITING';
      p.thought = `Holding right Fork F${fId}. Looking for left Fork F${p.leftForkId}...`;
      if (window.audioSynth) window.audioSynth.playForkClink();
      if (window.narrator) window.narrator.speakKey('fork_taken', p.name, fId, 'right');
    }

    this.addLog(`${p.name} picked up right Fork F${fId}.`);
    this.checkSystemState();
    this.notify();
    return true;
  }

  manualRelease(pId) {
    const p = this.philosophers[pId];
    let releasedCount = 0;
    if (p.hasLeft) {
      this.forks[p.leftForkId].heldBy = null;
      p.hasLeft = false;
      releasedCount++;
    }
    if (p.hasRight) {
      this.forks[p.rightForkId].heldBy = null;
      p.hasRight = false;
      releasedCount++;
    }

    p.state = 'THINKING';
    p.thought = 'Put forks down and thinking again.';
    this.statusMessage = `${p.name} put down forks and returned to thinking.`;
    this.addLog(`${p.name} released ${releasedCount} fork(s).`);

    if (window.narrator) window.narrator.speakKey('fork_released', p.name, p.leftForkId);
    this.checkSystemState();
    this.notify();
  }

  checkSystemState() {
    // Check Deadlock: all 5 hold exactly left fork and none hold right fork
    const allHoldLeft = this.philosophers.every((p, i) => this.forks[i].heldBy === i);
    const noneHoldRight = this.philosophers.every(p => !p.hasRight);

    if (allHoldLeft && noneHoldRight) {
      this.deadlockDetected = true;
      this.statusMessage = '🔴 DEADLOCK CONFIRMED! Circular wait condition active across all 5 friends!';
      if (window.audioSynth) window.audioSynth.playDeadlockAlarm();
      if (this.scenarioName === 'idle' || this.scenarioName === 'manual') {
        if (window.narrator) window.narrator.speakKey('manual_deadlock');
      }
    } else {
      this.deadlockDetected = false;
    }
  }
}

window.sim = new SimulationEngine();
