/**
 * algorithms/waiter.js
 * Solution 2: The Café Waiter (Counting Semaphore / Arbitrator)
 * Limits table to maximum 4 concurrent diners (N-1) using a counting semaphore.
 * By the Pigeonhole Principle, 4 diners competing for 5 forks ensures at least
 * one diner is guaranteed to acquire 2 forks!
 */

window.WaiterScenario = {
  name: 'Solution 2: The Café Waiter (Counting Semaphore N-1)',
  totalSteps: 5,

  init(sim) {
    sim.reset();
    sim.scenarioName = 'waiter';
    sim.waiterActive = true;
    sim.statusMessage = 'Solution 2: Café Waiter 🧑🍳 limits table to at most 4 seated diners!';
    sim.addLog('Initializing Arbitrator Waiter Semaphore: sem_init(&waiter, 0, 4).');
    if (window.audioSynth) window.audioSynth.playWaiterBell();
    if (window.narrator) window.narrator.speakKey('waiter');
  },

  executeStep(sim, stepIndex) {
    switch (stepIndex) {
      case 0:
        // Waiter admits P0, P1, P2, P3. P4 is told to wait in the foyer.
        [0, 1, 2, 3].forEach(id => {
          sim.philosophers[id].state = 'HUNGRY';
          sim.philosophers[id].thought = 'Waiter permitted me to sit at the table! 🪑';
        });

        // P4 held back by waiter
        const p4 = sim.philosophers[4];
        p4.state = 'WAITING';
        p4.thought = '🧑🍳 Waiter: "Sorry Kabir! Only 4 friends allowed at the table at once. Please wait!"';

        sim.statusMessage = 'Step 1/4: Waiter admits 4 diners. Kabir (P4) waits politely outside.';
        sim.addLog('Counting semaphore: wait(&waiter) called 4 times. Value = 0. P4 blocked.');
        break;

      case 1:
        // Non-adjacent pairs can eat simultaneously!
        // P0 (F0, F1) and P2 (F2, F3) both eat!
        sim.takeForks(0, 0, 1);
        sim.takeForks(2, 2, 3);

        const p0 = sim.philosophers[0];
        p0.state = 'EATING';
        p0.mealsEaten++;
        p0.hunger = 0;
        p0.thought = 'I have Forks 0 and 1! Eating noodles peacefully! 🍜';

        const p2 = sim.philosophers[2];
        p2.state = 'EATING';
        p2.mealsEaten++;
        p2.hunger = 0;
        p2.thought = 'I have Forks 2 and 3! Eating noodles too! 🍜';

        // P1 wants F1, but it is held by P0
        const p1 = sim.philosophers[1];
        p1.state = 'WAITING';
        p1.thought = 'Priya is using Fork 1. I will wait for her to finish.';

        // P3 wants F3, held by P2
        const p3 = sim.philosophers[3];
        p3.state = 'WAITING';
        p3.thought = 'Dev is using Fork 3. I will wait for him.';

        sim.statusMessage = 'Step 2/4: Two non-adjacent diners (P0 & P2) eat SIMULTANEOUSLY!';
        sim.addLog('P0 (F0, F1) & P2 (F2, F3) eating in parallel. CPU throughput maximized.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 2:
        // P0 and P2 finish eating, release their forks and exit table (sem_post).
        sim.releaseForks(0);
        sim.releaseForks(2);
        p0.state = 'THINKING';
        p0.thought = 'Delicious meal! Leaving table so others can enter.';
        p2.state = 'THINKING';
        p2.thought = 'Full and satisfied! Leaving table.';

        // Now P1 (F1, F2) and P3 (F3, F4) grab their forks and eat!
        sim.takeForks(1, 1, 2);
        sim.takeForks(3, 3, 4);

        p1.state = 'EATING';
        p1.mealsEaten++;
        p1.hunger = 0;
        p1.thought = 'Fork 1 & 2 are free! Arjun is eating now! 🍜';

        p3.state = 'EATING';
        p3.mealsEaten++;
        p3.hunger = 0;
        p3.thought = 'Fork 3 & 4 are free! Meera is eating now! 🍜';

        sim.statusMessage = 'Step 3/4: P0 & P2 leave table. P1 & P3 now eat in parallel!';
        sim.addLog('P0, P2 released forks and signaled waiter. P1 & P3 acquired forks -> EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 3:
        // P1 & P3 finish and leave table. Waiter invites Kabir (P4) to the table!
        sim.releaseForks(1);
        sim.releaseForks(3);
        p1.state = 'THINKING';
        p3.state = 'THINKING';

        sim.takeForks(4, 4, 0);
        const p4Eat = sim.philosophers[4];
        p4Eat.state = 'EATING';
        p4Eat.mealsEaten++;
        p4Eat.hunger = 0;
        p4Eat.thought = '🧑🍳 Waiter: "Kabir, a seat is open!" Got Forks 4 & 0! Eating noodles! 🍜✨';

        sim.statusMessage = 'Step 4/4: Waiter welcomes Kabir (P4) to the table! Kabir eats happily!';
        sim.addLog('Waiter signaled. P4 entered critical section -> acquired F4, F0 -> EATING.');
        if (window.audioSynth) window.audioSynth.playSuccessChord();
        break;

      case 4:
        sim.releaseForks(4);
        p4Eat.state = 'THINKING';
        p4Eat.thought = 'That was wonderful! All 5 of us have eaten without deadlock!';
        sim.statusMessage = '🎉 SUCCESS: Counting Semaphore (N-1 = 4) completely prevents Deadlock!';
        sim.addLog('Waiter counting semaphore demo complete: 0 deadlocks, fair dining.');
        break;
    }
  }
};
