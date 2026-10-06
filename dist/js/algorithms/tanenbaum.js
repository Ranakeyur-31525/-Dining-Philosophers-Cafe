/**
 * algorithms/tanenbaum.js
 * Solution 3: Tanenbaum's All-or-Nothing State Monitor
 * A philosopher transitions to EATING only if BOTH left and right forks are free.
 * If either fork is busy, they pick up NEITHER fork.
 * Breaks Coffman Condition #2: "Hold and Wait"!
 */

window.TanenbaumScenario = {
  name: 'Solution 3: Tanenbaum State Monitor (All-or-Nothing)',
  totalSteps: 5,

  init(sim) {
    sim.reset();
    sim.scenarioName = 'tanenbaum';
    sim.statusMessage = 'Solution 3: Tanenbaum Monitor — Both forks must be free before touching either!';
    sim.addLog('Initializing Tanenbaum Monitor: test(i) checks neighbors left and right.');
    if (window.audioSynth) window.audioSynth.playSuccessChord();
    if (window.narrator) window.narrator.speakKey('tanenbaum');
  },

  executeStep(sim, stepIndex) {
    switch (stepIndex) {
      case 0:
        // All 5 declare themselves HUNGRY in monitor
        sim.philosophers.forEach(p => {
          p.state = 'HUNGRY';
          p.thought = 'I want noodles! Checking if BOTH left & right forks are free... 🧐';
        });
        sim.statusMessage = 'Step 1/4: All 5 declare HUNGRY. Monitor tests who can safely eat without holding 1 fork.';
        sim.addLog('Philosophers registered as HUNGRY in monitor state array.');
        break;

      case 1:
        // Monitor atomically assigns forks to P0 and P2 (non-interfering)
        // P1 wants F1 & F2. But F1 is allocated to P0, F2 is allocated to P2.
        // In greedy pickup, P1 would grab F1 or F2 and hold it.
        // Under Tanenbaum, P1 touches NEITHER! Hands remain empty!
        sim.takeForks(0, 0, 1);
        sim.takeForks(2, 2, 3);

        const p0 = sim.philosophers[0];
        p0.state = 'EATING';
        p0.mealsEaten++;
        p0.hunger = 0;
        p0.thought = 'Monitor checked: both F0 & F1 were free! Eating noodles! 🍜';

        const p2 = sim.philosophers[2];
        p2.state = 'EATING';
        p2.mealsEaten++;
        p2.hunger = 0;
        p2.thought = 'Monitor checked: both F2 & F3 were free! Eating noodles! 🍜';

        const p1 = sim.philosophers[1];
        p1.hasLeft = false;
        p1.hasRight = false;
        p1.state = 'HUNGRY';
        p1.thought = 'Priya and Dev have my forks. Because of All-or-Nothing, I touch NEITHER fork! ✋';

        sim.statusMessage = 'Step 2/4: P0 & P2 eat. Arjun (P1) holds 0 forks, completely avoiding Hold-and-Wait!';
        sim.addLog('Tanenbaum test(1) failed -> P1 blocked on semaphore without holding any resource.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 2:
        // P0 and P2 put down forks atomically and signal neighbors
        sim.releaseForks(0);
        sim.releaseForks(2);
        p0.state = 'THINKING';
        p0.thought = 'Done eating! Testing neighbors test(LEFT) and test(RIGHT)...';
        p2.state = 'THINKING';
        p2.thought = 'Done eating! Signaling neighbors.';

        // Now monitor tests P1 and P3: both get both forks!
        sim.takeForks(1, 1, 2);
        sim.takeForks(3, 3, 4);

        p1.state = 'EATING';
        p1.mealsEaten++;
        p1.hunger = 0;
        p1.thought = 'Both F1 & F2 became free simultaneously! Arjun eats noodles! 🍜✨';

        const p3 = sim.philosophers[3];
        p3.state = 'EATING';
        p3.mealsEaten++;
        p3.hunger = 0;
        p3.thought = 'Both F3 & F4 became free simultaneously! Meera eats noodles! 🍜✨';

        sim.statusMessage = 'Step 3/4: P0 & P2 put down forks. P1 & P3 acquire both forks atomically!';
        sim.addLog('P0 & P2 signaled test(1) and test(3). Both succeeded and transitioned to EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 3:
        // P1 & P3 release forks. Kabir (P4) now gets F4 & F0
        sim.releaseForks(1);
        sim.releaseForks(3);
        p1.state = 'THINKING';
        p3.state = 'THINKING';

        sim.takeForks(4, 4, 0);
        const p4 = sim.philosophers[4];
        p4.state = 'EATING';
        p4.mealsEaten++;
        p4.hunger = 0;
        p4.thought = 'Both F4 & F0 are completely free! Kabir eats noodles! 🍜✨';

        sim.statusMessage = 'Step 4/4: Kabir (P4) eats noodles with F4 & F0!';
        sim.addLog('P4 acquired both forks atomically -> EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 4:
        sim.releaseForks(4);
        p4.state = 'THINKING';
        p4.thought = 'Full and happy! No philosopher ever held a single fork waiting for another.';
        sim.statusMessage = '🎉 COMPLETE SUCCESS! Tanenbaum Monitor eliminated Hold-and-Wait!';
        sim.addLog('Monitor demonstration complete: 0 deadlocks, maximum concurrency.');
        if (window.audioSynth) window.audioSynth.playSuccessChord();
        break;
    }
  }
};
