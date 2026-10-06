/**
 * algorithms/deadlock.js
 * Demonstrates the classic Deadlock situation:
 * All 5 philosophers become hungry simultaneously and grab their left fork.
 * Then all 5 wait forever for their right fork.
 */

window.DeadlockScenario = {
  name: 'Deadlock (The Circular Wait Freeze)',
  totalSteps: 4,

  init(sim) {
    sim.reset();
    sim.scenarioName = 'deadlock';
    sim.statusMessage = 'Mode: Deadlock Induction — Watch all 5 friends grab left forks simultaneously!';
    sim.addLog('Initiating Deadlock Scenario: Simultaneous greedy pickup.');
  },

  executeStep(sim, stepIndex) {
    switch (stepIndex) {
      case 0:
        // All 5 get hungry
        sim.philosophers.forEach(p => {
          p.state = 'HUNGRY';
          p.hunger = 40;
          p.thought = 'I am suddenly starving! Let me grab a fork! 😋';
        });
        sim.statusMessage = 'Step 1/3: All five friends get hungry at the exact same second!';
        sim.addLog('All 5 philosophers transitioned from THINKING to HUNGRY.');
        break;

      case 1:
        // All 5 grab their left fork simultaneously!
        sim.philosophers.forEach((p, idx) => {
          const leftForkId = p.leftForkId;
          sim.forks[leftForkId].heldBy = idx;
          p.hasLeft = true;
          p.state = 'WAITING';
          p.hunger = 60;
          p.thought = `Grabbed left Fork F${leftForkId}! Reaching for right Fork F${p.rightForkId}... 🍴`;
          if (window.audioSynth) window.audioSynth.playForkClink();
        });
        sim.statusMessage = 'Step 2/3: Every friend grabbed their LEFT fork! Every fork is now taken!';
        sim.addLog('F0..F4 locked in left hands of P0..P4. Mutual Exclusion + Hold & Wait active.');
        break;

      case 2:
        // All 5 attempt to grab right fork and find it locked by their neighbor!
        sim.philosophers.forEach((p, idx) => {
          const rightForkId = p.rightForkId;
          const neighbor = sim.forks[rightForkId].heldBy;
          p.state = 'DEADLOCKED';
          p.hunger = 85;
          p.thought = `Hey ${sim.philosophers[neighbor].name.split(' ')[0]}! Please give me Fork F${rightForkId}! I can't eat! 😠`;
        });
        sim.deadlockDetected = true;
        sim.statusMessage = '🔴 DEADLOCK! Total Stalemate! All 5 friends are waiting for each other in a circle!';
        sim.addLog('🔴 DEADLOCK FORMED: P0 -> P1 -> P2 -> P3 -> P4 -> P0 circular dependency cycle detected.');
        if (window.audioSynth) window.audioSynth.playDeadlockAlarm();
        if (window.narrator) window.narrator.speakKey('deadlock');
        break;

      case 3:
        // Deadlock persists, hunger rises, extreme freeze
        sim.philosophers.forEach(p => {
          p.hunger = 100;
          p.thought = 'Stuck forever! Nobody lets go, nobody can eat noodles! 😱💀';
        });
        sim.statusMessage = '🔴 TOTAL SYSTEM FREEZE: 4 Coffman conditions fulfilled. Zero CPU progress!';
        sim.addLog('Deadlock persists indefinitely. Manual intervention or OS preemptive abort required.');
        break;
    }
  }
};
