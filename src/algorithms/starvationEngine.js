// src/algorithms/starvationEngine.js
// Indefinite Postponement (Conspiracy) vs Fair FIFO Aging Queue

import { PHILOSOPHER_NAMES, PHILOSOPHER_AVATARS } from './deadlockEngine';

export function createInitialStarvationState(mode = 'conspiracy') {
  return {
    mode, // 'conspiracy' or 'fifo'
    cycle: 0,
    starvationDetected: false,
    starvedPhilosopherId: 1, // Arjun (P1)
    status: 'READY',
    statusMessage: mode === 'conspiracy'
      ? 'Conspiracy Mode: P0 & P2 alternate eating aggressively. Watch P1 starve between them!'
      : 'Fair FIFO Mode: Hungry philosophers receive priority tickets. P1 will be prioritized by age.',
    narrativeText: mode === 'conspiracy'
      ? 'Friends 0 and 2 eat bowl after bowl greedily. Poor Friend 1 is trapped in between with no chance to eat!'
      : 'The café manager gives everyone numbered queue tickets. Whoever waits longest gets served first!',
    philosophers: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: PHILOSOPHER_NAMES[i],
      avatar: PHILOSOPHER_AVATARS[i],
      state: i === 0 ? 'EATING' : 'THINKING',
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      hungerLevel: i === 1 ? 20 : 0, // 0 to 100%
      mealsEaten: i === 0 ? 1 : 0,
      waitTime: i === 1 ? 3 : 0,
      ticketNumber: null,
      thought: i === 1 ? 'I am very hungry... I need Fork 1 and Fork 2.' : 'Thinking peacefully.'
    })),
    forks: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: (i === 0 || i === 1) ? 0 : null,
      position: (i === 0 || i === 1) ? 'hand' : 'table'
    })),
    fifoQueue: [],
    logs: [
      { id: 1, time: '00:00.000', type: 'info', msg: `Initialized in ${mode.toUpperCase()} mode.` }
    ]
  };
}

export function advanceStarvationCycle(prevState) {
  const next = JSON.parse(JSON.stringify(prevState));
  next.cycle += 1;

  if (next.mode === 'conspiracy') {
    // Conspiracy loop:
    // If P0 was eating, switch P0 to thinking, and P2 immediately eats!
    // P1 hunger jumps +20%
    const p0 = next.philosophers[0];
    const p1 = next.philosophers[1];
    const p2 = next.philosophers[2];

    p1.state = 'HUNGRY';
    p1.waitTime += 2;
    p1.hungerLevel = Math.min(100, p1.hungerLevel + 20);

    if (p0.state === 'EATING') {
      // P0 finishes, P2 grabs forks immediately
      p0.state = 'THINKING';
      p0.thought = 'Priya: Just finished my bowl. Taking a quick breather!';
      next.forks[0].heldBy = null;
      next.forks[0].position = 'table';
      next.forks[1].heldBy = null;
      next.forks[1].position = 'table';

      // P2 takes F2 & F3
      p2.state = 'EATING';
      p2.mealsEaten += 1;
      p2.thought = 'Dev: Devouring another bowl of spicy noodles!';
      next.forks[2].heldBy = 2;
      next.forks[2].position = 'hand';
      next.forks[3].heldBy = 2;
      next.forks[3].position = 'hand';

      p1.thought = 'Arjun: Wait! Fork 1 is free, but now Fork 2 is held by Dev! I cannot eat!';
      next.logs.push({
        id: next.cycle + 10,
        time: `00:0${next.cycle}.100`,
        type: 'warn',
        msg: `P0 released F1, but P2 immediately acquired F2. P1 still lacks both forks! P1 Hunger: ${p1.hungerLevel}%`
      });
    } else {
      // P2 finishes, P0 grabs forks immediately!
      p2.state = 'THINKING';
      p2.thought = 'Dev: Finished my noodles! Ordering another round soon.';
      next.forks[2].heldBy = null;
      next.forks[2].position = 'table';
      next.forks[3].heldBy = null;
      next.forks[3].position = 'table';

      // P0 takes F0 & F1
      p0.state = 'EATING';
      p0.mealsEaten += 1;
      p0.thought = 'Priya: My turn again! More noodles for me!';
      next.forks[0].heldBy = 0;
      next.forks[0].position = 'hand';
      next.forks[1].heldBy = 0;
      next.forks[1].position = 'hand';

      p1.thought = 'Arjun: Ah! Fork 2 was freed, but Priya grabbed Fork 1 again! This is so unfair!';
      next.logs.push({
        id: next.cycle + 10,
        time: `00:0${next.cycle}.100`,
        type: 'warn',
        msg: `P2 released F2, but P0 re-acquired F1! P1 indefinitely postponed! P1 Hunger: ${p1.hungerLevel}%`
      });
    }

    if (p1.hungerLevel >= 90) {
      next.starvationDetected = true;
      p1.state = 'STARVING';
      p1.thought = '💀 CRITICAL STARVATION! I have waited forever while my neighbors alternate endlessly!';
      next.status = 'STARVATION_DETECTED';
      next.statusMessage = '⚠️ STARVATION DETECTED: Bounded Waiting Condition Violated! P1 is indefinitely postponed.';
      next.narrativeText = 'CRITICAL! Friend 1 (Arjun) is starving to death between two greedy friends! Zero deadlocks, but total starvation.';
      next.logs.push({
        id: next.cycle + 50,
        time: `00:0${next.cycle}.999`,
        type: 'fatal',
        msg: 'CRITICAL ALERT: Thread P1 starvation threshold breached (Wait time > limit). Bounded-waiting violation in POSIX scheduling.'
      });
    }

    return next;
  }

  // FIFO Aging mode:
  // When FIFO is active, P1 has Ticket #1 with the highest age.
  // P0 and P2 are FORCED to yield!
  const p0 = next.philosophers[0];
  const p1 = next.philosophers[1];
  const p2 = next.philosophers[2];

  // Release any greedy holds
  p0.state = 'WAITING';
  p0.thought = 'Priya: FIFO Rule says Arjun has Ticket #1. I must yield and wait!';
  p2.state = 'WAITING';
  p2.thought = 'Dev: Yielding both forks so Arjun can finally eat!';

  next.forks[0].heldBy = null;
  next.forks[0].position = 'table';
  next.forks[3].heldBy = null;
  next.forks[3].position = 'table';

  // P1 gets F1 and F2!
  next.forks[1].heldBy = 1;
  next.forks[1].position = 'hand';
  next.forks[2].heldBy = 1;
  next.forks[2].position = 'hand';

  p1.state = 'EATING';
  p1.hasLeft = true;
  p1.hasRight = true;
  p1.mealsEaten += 1;
  p1.hungerLevel = Math.max(0, p1.hungerLevel - 40);
  p1.thought = '🍜 GLORIOUS NOODLES! The FIFO ticket protected me! I am finally eating!';

  next.fifoQueue = [
    { ticket: 1, philId: 1, name: 'Arjun (P1)', waitTime: '14s (SERVED)', status: 'EATING' },
    { ticket: 2, philId: 0, name: 'Priya (P0)', waitTime: '2s', status: 'QUEUED' },
    { ticket: 3, philId: 2, name: 'Dev (P2)', waitTime: '3s', status: 'QUEUED' }
  ];

  next.starvationDetected = false;
  next.status = 'RESOLVED';
  next.statusMessage = 'FAIR FIFO AGING ACTIVE: P1 served by priority ticket. Starvation completely eliminated!';
  next.narrativeText = 'Hurray! Arjun gets his hot bowl of noodles because the FIFO ticket system enforced fairness!';
  next.logs.push({
    id: next.cycle + 100,
    time: `00:0${next.cycle}.500`,
    type: 'success',
    msg: 'FIFO scheduler dispatched Ticket #1 (P1). Both F1 & F2 granted atomically. Fairness restored.'
  });

  return next;
}
