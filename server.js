import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Server-side state representation for concurrent simulation
class DiningServerSimulation {
  constructor() {
    this.reset();
  }

  reset() {
    this.numPhilosophers = 5;
    this.philosophers = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: ['Priya (P0)', 'Arjun (P1)', 'Dev (P2)', 'Meera (P3)', 'Kabir (P4)'][i],
      state: 'THINKING', // THINKING, HUNGRY, WAITING, EATING, STARVING, DEADLOCKED
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      hasLeft: false,
      hasRight: false,
      mealsEaten: 0,
      hungerTime: 0,
      thought: 'Thinking peacefully...',
      avatar: ['👩🏽‍🎓', '👨🏻‍💻', '👨🏽‍🎨', '👩🏻‍🔬', '👨🏾‍🏫'][i]
    }));

    this.forks = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: null // null or philosopher index 0..4
    }));

    this.scenario = 'idle'; // idle, deadlock, starvation, resource_order, waiter, tanenbaum
    this.step = 0;
    this.deadlockDetected = false;
    this.starvationDetected = false;
    this.waiterAllowance = 4; // max concurrent diners in waiter scenario
    this.activeDiners = 0;
    this.log = [];
  }

  getState() {
    return {
      numPhilosophers: this.numPhilosophers,
      philosophers: this.philosophers,
      forks: this.forks,
      scenario: this.scenario,
      step: this.step,
      deadlockDetected: this.deadlockDetected,
      starvationDetected: this.starvationDetected,
      timestamp: Date.now()
    };
  }

  logMessage(msg) {
    const entry = { time: new Date().toLocaleTimeString(), text: msg };
    this.log.unshift(entry);
    if (this.log.length > 50) this.log.pop();
    return entry;
  }
}

const simState = new DiningServerSimulation();

// SSE (Server-Sent Events) clients
let sseClients = [];

function broadcastState() {
  const data = JSON.stringify(simState.getState());
  sseClients.forEach(res => {
    res.write(`data: ${data}\n\n`);
  });
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// SSE endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(simState.getState())}\n\n`);
  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

// Current status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    app: 'Dining Philosophers Café API',
    version: '1.0.0',
    simState: simState.getState(),
    connectedClients: sseClients.length
  });
});

// Reset
app.post('/api/scenarios/reset', (req, res) => {
  simState.reset();
  simState.logMessage('Simulation table reset by client.');
  broadcastState();
  res.json({ success: true, state: simState.getState() });
});

// Manual action by client
app.post('/api/action', (req, res) => {
  const { philosopherId, action } = req.body;
  if (philosopherId === undefined || philosopherId < 0 || philosopherId > 4) {
    return res.status(400).json({ error: 'Invalid philosopherId' });
  }

  const p = simState.philosophers[philosopherId];
  const leftF = simState.forks[p.leftForkId];
  const rightF = simState.forks[p.rightForkId];

  switch (action) {
    case 'take_left':
      if (leftF.heldBy === null) {
        leftF.heldBy = philosopherId;
        p.hasLeft = true;
        p.state = p.hasRight ? 'EATING' : 'WAITING';
        p.thought = p.hasRight ? 'Yum! Eating noodles!' : 'Got left fork, waiting for right...';
      }
      break;
    case 'take_right':
      if (rightF.heldBy === null) {
        rightF.heldBy = philosopherId;
        p.hasRight = true;
        p.state = p.hasLeft ? 'EATING' : 'WAITING';
        p.thought = p.hasLeft ? 'Yum! Eating noodles!' : 'Got right fork, waiting for left...';
      }
      break;
    case 'release_left':
      if (leftF.heldBy === philosopherId) {
        leftF.heldBy = null;
        p.hasLeft = false;
        p.state = p.hasRight ? 'WAITING' : 'THINKING';
        p.thought = 'Released left fork.';
      }
      break;
    case 'release_right':
      if (rightF.heldBy === philosopherId) {
        rightF.heldBy = null;
        p.hasRight = false;
        p.state = p.hasLeft ? 'WAITING' : 'THINKING';
        p.thought = 'Released right fork.';
      }
      break;
    case 'eat':
      if (p.hasLeft && p.hasRight) {
        p.state = 'EATING';
        p.mealsEaten += 1;
        p.thought = 'Slurping delicious noodles! 🍜';
      }
      break;
    case 'think':
      if (p.hasLeft) leftF.heldBy = null;
      if (p.hasRight) rightF.heldBy = null;
      p.hasLeft = false;
      p.hasRight = false;
      p.state = 'THINKING';
      p.thought = 'Deep philosophical contemplation...';
      break;
  }

  const allHoldLeft = simState.philosophers.every((phil, idx) => simState.forks[idx].heldBy === idx);
  const noneHoldRight = simState.philosophers.every(phil => !phil.hasRight);
  simState.deadlockDetected = allHoldLeft && noneHoldRight;

  broadcastState();
  res.json({ success: true, state: simState.getState() });
});

// Technical Educational Content & Viva Questions
app.get('/api/education', (req, res) => {
  res.json({
    coffmanConditions: [
      {
        name: 'Mutual Exclusion',
        symbol: 'M.E.',
        definition: 'Resources cannot be shared simultaneously. Each fork can only be held by one philosopher at a time.',
        cafeMetaphor: 'Only one person can hold a fork; you cannot hold hands on the same fork simultaneously.',
        brokenBy: 'Virtualization/sharing (not feasible for physical forks).'
      },
      {
        name: 'Hold and Wait',
        symbol: 'H&W',
        definition: 'Processes currently holding at least one resource can request additional resources being held by others.',
        cafeMetaphor: 'Holding your left fork tightly in your hand while stubbornly waiting for the neighbor to surrender their fork.',
        brokenBy: 'Solution 3: Tanenbaum Monitor (All-or-Nothing). Pick up BOTH forks atomically or touch none!'
      },
      {
        name: 'No Preemption',
        symbol: 'N.P.',
        definition: 'Resources cannot be forcibly confiscated from a process holding them; they must be released voluntarily.',
        cafeMetaphor: 'You cannot slap the fork out of your neighbor’s hand! They must put it down willingly.',
        brokenBy: 'Preemption protocols / timeout-based rollback (forcing release if waiting too long).'
      },
      {
        name: 'Circular Wait',
        symbol: 'C.W.',
        definition: 'A closed chain of processes exists such that each process holds a resource needed by the next process in the cycle: P0 -> F1 -> P1 -> F2 -> P2 -> F3 -> P3 -> F4 -> P4 -> F0 -> P0.',
        cafeMetaphor: 'Friend 0 waits for 1, 1 for 2, 2 for 3, 3 for 4, and 4 waits for 0. A closed ring of frustration!',
        brokenBy: 'Solution 1: Resource Ordering (Havender). Pick lowest-numbered fork first! P4 picks F0 before F4, breaking the ring.'
      }
    ],
    vivaQuestions: [
      {
        q: 'What is the fundamental difference between Deadlock and Starvation in this problem?',
        a: 'In Deadlock, every philosopher is blocked indefinitely in a circular wait; zero CPU progress is made system-wide. In Starvation (Livelock), system progress is being made (some philosophers eat repeatedly), but one specific philosopher is perpetually deprived of both forks and never eats.'
      },
      {
        q: 'Why does Havender’s Resource Ordering guarantee freedom from deadlock?',
        a: 'By enforcing a strict total order on resource acquisition (always acquire min(left, right) then max(left, right)), a cyclic wait graph cannot form. A cycle in an acquisition graph requires an edge going from a higher index to a lower index without an opposing constraint, which is mathematically impossible under total ordering.'
      },
      {
        q: 'How does the Waiter solution leverage the Pigeonhole Principle?',
        a: 'If N philosophers compete for N forks, deadlock occurs when each gets 1 fork. By limiting the table to at most N-1 diners (4 friends for 5 forks), the Pigeonhole Principle dictates that at least one diner must receive ceil(5/4) = 2 forks, allowing them to eat and release resources.'
      },
      {
        q: 'What type of semaphore is used for forks vs the waiter?',
        a: 'Each fork is protected by a Binary Semaphore (Mutex) initialized to 1. The Waiter is implemented as a Counting Semaphore initialized to N-1 (4).'
      }
    ]
  });
});

// -------------------------------------------------------------
// STATIC ASSET SERVING & SPA FALLBACK
// -------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
app.use(express.static(publicPath));

// Fallback to React index.html for client-side routing (React Router)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const distIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  const publicIndex = path.join(publicPath, 'index.html');
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  res.status(404).send('Not Found');
});

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`🍜 Dining Philosophers Café Server running on http://localhost:${portToTry}`);
    console.log(`   Fullstack Concurrency & Synchronization Lab`);
    console.log(`   React 19 + Tailwind CSS + Lucide + Express`);
    console.log(`   Tri-Lingual Voice Narration: English, Hindi, Gujarati`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToTry) + 1;
      console.warn(`⚠️ Port ${portToTry} is already in use. Trying fallback port http://localhost:${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
