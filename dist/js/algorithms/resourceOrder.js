/**
 * algorithms/resourceOrder.js
 * Solution 1: Resource Ordering (Havender's Algorithm)
 * Total ordering on resource indices: Always request min(left, right) then max(left, right).
 * For P0..P3: Left fork index is lower (e.g. 0 < 1, 1 < 2, etc.)
 * For P4: Left is 4, Right is 0. Since 0 < 4, P4 MUST request Fork 0 FIRST!
 * Because Fork 0 is held by P0, P4 waits EMPTY-HANDED!
 * Fork 4 stays FREE on the table -> Meera (P3) grabs Fork 4 and eats! Cycle is broken!
 */

window.ResourceOrderScenario = {
  name: "Solution 1: Resource Ordering (Havender's Rule)",
  totalSteps: 6,

  init(sim) {
    sim.reset();
    sim.scenarioName = 'resource_order';
    sim.statusMessage = "Solution 1: Enforcing Total Resource Ordering — P4 must pick Fork 0 before Fork 4!";
    sim.addLog("Applying Havender's Algorithm: Resource hierarchy prevents Circular Wait.");
    if (window.narrator) window.narrator.speakKey('resource_order');
  },

  executeStep(sim, stepIndex) {
    switch (stepIndex) {
      case 0:
        // P0, P1, P2, P3 pick their lower fork (F0, F1, F2, F3)
        // P4 wants F0 and F4. min(0,4) = 0. But F0 is taken by P0!
        // P4 WAITS WITH EMPTY HANDS!
        [0, 1, 2, 3].forEach(id => {
          sim.forks[id].heldBy = id;
          sim.philosophers[id].hasLeft = true;
          sim.philosophers[id].state = 'WAITING';
          sim.philosophers[id].thought = `Picked lower-order Fork F${id}. Waiting for right fork...`;
        });

        // P4 (Kabir)
        const p4 = sim.philosophers[4];
        p4.hasLeft = false;
        p4.hasRight = false;
        p4.state = 'WAITING';
        p4.thought = `Rule says 0 < 4! I must request Fork 0 first! Since P0 has it, I wait EMPTY-HANDED! Fork 4 stays free! ✋`;

        sim.statusMessage = 'Step 1/5: P4 obeys rule and waits empty-handed! Fork F4 is left FREE on the table!';
        sim.addLog('Resource ordering active: P4 requests F0 before F4. F0 busy -> P4 holds 0 forks.');
        if (window.audioSynth) window.audioSynth.playForkClink();
        break;

      case 1:
        // Because Fork 4 is free on the table, Meera (P3) can grab her right fork (F4)!
        const p3 = sim.philosophers[3];
        sim.forks[4].heldBy = 3;
        p3.hasRight = true;
        p3.state = 'EATING';
        p3.mealsEaten++;
        p3.hunger = 0;
        p3.thought = 'YAY! Fork 4 was free because Kabir waited! I have both forks (F3 & F4) and can eat! 🍜✨';

        sim.statusMessage = 'Step 2/5: Meera (P3) grabs free Fork F4 and eats happily! The circular cycle is broken!';
        sim.addLog('Meera (P3) acquired F3 and F4 -> EATING. Deadlock prevented!');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 2:
        // P3 finishes eating and puts down both F3 and F4!
        sim.forks[3].heldBy = null;
        sim.forks[4].heldBy = null;
        p3.hasLeft = false;
        p3.hasRight = false;
        p3.state = 'THINKING';
        p3.thought = 'Done eating! Putting down Fork 3 & Fork 4 for my neighbors. 🥣';

        // Now Fork 3 is free! Dev (P2) grabs Fork 3 and eats!
        const p2 = sim.philosophers[2];
        sim.forks[3].heldBy = 2;
        p2.hasRight = true;
        p2.state = 'EATING';
        p2.mealsEaten++;
        p2.hunger = 0;
        p2.thought = 'Fork 3 is free! Now I have F2 & F3 and can eat! 🍜✨';

        sim.statusMessage = 'Step 3/5: P3 releases forks. Dev (P2) grabs Fork 3 and eats!';
        sim.addLog('P3 releases F3, F4. P2 acquires F3 -> EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 3:
        // P2 finishes, releases F2 & F3. Arjun (P1) grabs F2 and eats!
        sim.forks[2].heldBy = null;
        sim.forks[3].heldBy = null;
        p2.hasLeft = false;
        p2.hasRight = false;
        p2.state = 'THINKING';
        p2.thought = 'Finished eating, resting.';

        const p1 = sim.philosophers[1];
        sim.forks[2].heldBy = 1;
        p1.hasRight = true;
        p1.state = 'EATING';
        p1.mealsEaten++;
        p1.hunger = 0;
        p1.thought = 'Fork 2 is free! Arjun is finally eating noodles with F1 & F2! 🍜';

        sim.statusMessage = 'Step 4/5: P2 releases forks. Arjun (P1) grabs Fork 2 and eats!';
        sim.addLog('P2 releases F2, F3. P1 acquires F2 -> EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 4:
        // P1 finishes, releases F1 & F2. Priya (P0) grabs F1 and eats!
        sim.forks[1].heldBy = null;
        sim.forks[2].heldBy = null;
        p1.hasLeft = false;
        p1.hasRight = false;
        p1.state = 'THINKING';
        p1.thought = 'All done and satisfied.';

        const p0 = sim.philosophers[0];
        sim.forks[1].heldBy = 0;
        p0.hasRight = true;
        p0.state = 'EATING';
        p0.mealsEaten++;
        p0.hunger = 0;
        p0.thought = 'Fork 1 is free! Priya is eating with F0 & F1! 🍜';

        sim.statusMessage = 'Step 5/5: Priya (P0) grabs Fork 1 and eats!';
        sim.addLog('P1 releases F1, F2. P0 acquires F1 -> EATING.');
        if (window.audioSynth) window.audioSynth.playEatingSound();
        break;

      case 5:
        // P0 finishes, releases F0 & F1!
        // Now Fork 0 is free! Kabir (P4) who waited patiently can now grab F0 and F4 and eat!
        sim.forks[0].heldBy = null;
        sim.forks[1].heldBy = null;
        p0.hasLeft = false;
        p0.hasRight = false;
        p0.state = 'THINKING';
        p0.thought = 'Done eating. Fork 0 is back on the table!';

        const p4Final = sim.philosophers[4];
        sim.forks[0].heldBy = 4;
        sim.forks[4].heldBy = 4;
        p4Final.hasLeft = true;
        p4Final.hasRight = true;
        p4Final.state = 'EATING';
        p4Final.mealsEaten++;
        p4Final.hunger = 0;
        p4Final.thought = 'Victory! Fork 0 and Fork 4 are both mine! Kabir is eating! 🍜🎉';

        sim.statusMessage = '🎉 COMPLETE SUCCESS! All 5 philosophers ate noodles safely without deadlock!';
        sim.addLog('All 5 philosophers successfully fed. Havender total ordering proved deadlock-free.');
        if (window.audioSynth) window.audioSynth.playSuccessChord();
        break;
    }
  }
};
