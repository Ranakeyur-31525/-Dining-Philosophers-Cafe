/**
 * algorithms/starvation.js
 * Demonstrates Starvation / Livelock:
 * System progress IS occurring (neighbors P0 & P2 alternate eating),
 * but P1 is perpetually starved of having both forks available.
 */

window.StarvationScenario = {
  name: 'Starvation (Livelock on Dev P2 / Arjun P1)',
  totalSteps: 6,

  init(sim) {
    sim.reset();
    sim.scenarioName = 'starvation';
    sim.statusMessage = 'Mode: Starvation Lab — Observe how Arjun (P1) is starved while neighbors alternate!';
    sim.addLog('Initiating Starvation Scenario: Asymmetric neighbor monopolization.');
    if (window.narrator) window.narrator.speakKey('starvation');
  },

  executeStep(sim, stepIndex) {
    const p0 = sim.philosophers[0]; // Priya
    const p1 = sim.philosophers[1]; // Arjun (Victim)
    const p2 = sim.philosophers[2]; // Dev
    const p3 = sim.philosophers[3]; // Meera
    const p4 = sim.philosophers[4]; // Kabir

    switch (stepIndex % 4) {
      case 0:
        // Round A: P0 (Priya) and P3 (Meera) eat
        sim.releaseAllForks();
        sim.takeForks(0, 0, 1);
        sim.takeForks(3, 3, 4);

        p0.state = 'EATING';
        p0.mealsEaten++;
        p0.hunger = 10;
        p0.thought = 'Yum! Slurping hot noodles with Forks 0 & 1! 🍜';

        p3.state = 'EATING';
        p3.mealsEaten++;
        p3.hunger = 10;
        p3.thought = 'Delicious bowl with Forks 3 & 4! 🍜';

        // P1 wants to eat, but Fork 1 is taken by P0!
        p1.state = 'STARVING';
        p1.hunger = Math.min(100, p1.hunger + 25);
        p1.thought = 'I am hungry! But Priya holds Fork 1, so I cannot eat! 🥺';

        p2.state = 'THINKING';
        p2.thought = 'Thinking peacefully...';
        p4.state = 'THINKING';
        p4.thought = 'Reading a book...';

        sim.starvationDetected = true;
        sim.statusMessage = `Cycle ${Math.floor(stepIndex / 2) + 1}: P0 & P3 are eating! Arjun (P1) is waiting... Hunger: ${p1.hunger}%`;
        sim.addLog(`P0 & P3 eating. P1 requests F1 & F2, but F1 is locked by P0.`);
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 1:
        // Round B: P0 finishes, but immediately P2 (Dev) grabs F1 & F2 before P1 gets a chance!
        sim.releaseAllForks();
        sim.takeForks(2, 2, 3);
        sim.takeForks(4, 4, 0);

        p2.state = 'EATING';
        p2.mealsEaten++;
        p2.hunger = 10;
        p2.thought = 'My turn to eat! Grabbing Forks 2 & 3! 🍜';

        p4.state = 'EATING';
        p4.mealsEaten++;
        p4.hunger = 10;
        p4.thought = 'Eating noodles with Forks 4 & 0! 🍜';

        // P1 tries again, but Fork 2 is taken by P2!
        p1.state = 'STARVING';
        p1.hunger = Math.min(100, p1.hunger + 25);
        p1.thought = 'Argh! Dev grabbed Fork 2 right as Priya put down Fork 1! I am still starving! 💀';

        p0.state = 'THINKING';
        p0.thought = 'Just finished eating, resting.';
        p3.state = 'THINKING';
        p3.thought = 'Resting.';

        sim.starvationDetected = true;
        sim.statusMessage = `⚠️ STARVATION: System is active, but Arjun (P1) is locked out! Hunger: ${p1.hunger}%`;
        sim.addLog(`⚠️ Starvation: P1 hunger critical (${p1.hunger}%). Fork 2 contested and monopolized by P2.`);
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 2:
      case 3:
        // Repeat alternation, increasing P1's desperation
        if (p1.hunger >= 90) {
          p1.thought = 'STARVATION DISASTER: P0 and P2 have eaten multiple times, while I have eaten ZERO! 💀';
          sim.statusMessage = '⚠️ STARVATION CONFIRMED: Notice meals count: P0=2, P2=2, P1=0!';
        }
        break;
    }
  }
};
