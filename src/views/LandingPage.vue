<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const rulesets = [
  {
    name: "Conway's Game of Life",
    route: '/game/conway',
    notation: 'B3/S23',
    description: 'The classic cellular automaton invented by mathematician John Conway in 1970. Simple rules create complex, emergent patterns.',
    features: [
      'Birth: exactly 3 neighbors',
      'Survival: 2 or 3 neighbors',
      'Classic patterns: Gliders, Blinkers, Spaceships'
    ],
    color: '#00ff88'
  },
  {
    name: 'HighLife',
    route: '/game/highlife',
    notation: 'B36/S23',
    description: 'A fascinating variant that introduces replication. Patterns can spontaneously create copies of themselves, leading to explosive growth.',
    features: [
      'Birth: 3 or 6 neighbors',
      'Survival: 2 or 3 neighbors',
      'Unique: Self-replicating patterns (Replicators)'
    ],
    color: '#ff6b9d'
  },
  {
    name: 'Seeds',
    route: '/game/seeds',
    notation: 'B2/S',
    description: 'Pure chaos! Every cell dies immediately after birth, creating explosive, ever-expanding patterns. Watch the beautiful entropy unfold.',
    features: [
      'Birth: exactly 2 neighbors',
      'Survival: NONE - all cells die!',
      'Chaotic, expanding patterns'
    ],
    color: '#ffa500'
  }
];

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<template>
  <div class="landing-page">
    <header class="hero">
      <h1 class="hero-title">Game of Life Explorer</h1>
      <p class="hero-subtitle">
        Explore the fascinating world of cellular automata
      </p>
    </header>

    <section class="intro">
      <div class="intro-content">
        <h2>What is the Game of Life?</h2>
        <p>
          The <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" noopener>Game of Life</a>
          is a cellular automaton devised by mathematician John Conway.<br/>
          It's a zero-player game where cells on a grid evolve based on simple rules,
          creating surprisingly complex patterns and behaviors.
        </p>
        <p>
          Each cell can be either <strong>alive</strong> or <strong>dead</strong>.
          In each generation, the fate of every cell is determined by counting its
          8 neighboring cells and applying the ruleset's birth and survival conditions.
        </p>
      </div>
    </section>

    <section class="rulesets">
      <h2>Choose Your Ruleset</h2>

      <div class="ruleset-grid">
        <div
          v-for="ruleset in rulesets"
          :key="ruleset.route"
          class="ruleset-card"
          @click="navigateTo(ruleset.route)"
        >
          <div class="card-header" :style="{ borderColor: ruleset.color }">
            <h3>{{ ruleset.name }}</h3>
            <span class="notation">{{ ruleset.notation }}</span>
          </div>

          <p class="card-description">{{ ruleset.description }}</p>

          <ul class="card-features">
            <li v-for="(feature, index) in ruleset.features" :key="index">
              {{ feature }}
            </li>
          </ul>

          <button class="card-cta" :style="{ background: ruleset.color }">
            Explore {{ ruleset.name }} →
          </button>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Choose a Ruleset</h3>
          <p>Select Conway's classic rules or try the HighLife variant</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Place Patterns</h3>
          <p>Click cells to create patterns, or use pre-defined structures</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Watch Evolution</h3>
          <p>Hit play and observe how patterns evolve over generations</p>
        </div>
      </div>
    </section>

    <footer class="landing-footer">
      <p>Built with Vue 3, TypeScript, and a passion for emergent complexity</p>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding-bottom: 3rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem 3rem;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
}

.hero-title {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin: 0;
  color: var(--text-secondary);
}

.intro {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.intro-content h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.intro-content p {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.intro-content strong {
  color: var(--color-primary);
}

.rulesets {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.rulesets h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2.5rem;
}

.ruleset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.ruleset-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ruleset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-header {
  border-left: 4px solid;
  padding-left: 1rem;
  margin-bottom: 1.5rem;
}

.card-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.notation {
  display: inline-block;
  background: var(--bg-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: monospace;
  color: var(--color-primary);
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.card-features li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--text-secondary);
}

.card-features li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.card-cta {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  transition: opacity 0.2s;
}

.card-cta:hover {
  opacity: 0.9;
}

.how-it-works {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
}

.how-it-works h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: var(--color-primary);
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.step h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.step p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.landing-footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .ruleset-grid {
    grid-template-columns: 1fr;
  }
}
</style>
