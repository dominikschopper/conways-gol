<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RULESET_ROUTES } from '../constants/rulesets';
import { RULE_NAME } from '../core/types/Rules';

const router = useRouter();

const rulesets = [
  {
    name: "Classic",
    route: `/game/${RULESET_ROUTES[RULE_NAME.CONWAY]}`,
    notation: 'B3/S23',
    color: '#00ff88'
  },
  {
    name: 'HighLife',
    route: `/game/${RULESET_ROUTES[RULE_NAME.HIGHLIFE]}`,
    notation: 'B36/S23',
    color: '#ff6b9d'
  },
  {
    name: 'Seeds',
    route: `/game/${RULESET_ROUTES[RULE_NAME.SEEDS]}`,
    notation: 'B2/S',
    color: '#ffa500'
  },
  {
    name: 'Reanimation',
    route: `/game/${RULESET_ROUTES[RULE_NAME.REANIMATION]}`,
    notation: 'B36S23R234',
    description: `My own ruleset with an additional dying state, that can be reanimated with 2, 3 or 4 live cells`,
    color: '#d9d928'
  }
];

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<template>
  <div class="landing-page">
    <header class="hero">
      <h1 class="hero-title">Conways Game of Life</h1>
      <p class="hero-subtitle">
        Explore cellular automata
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
          Each cell can be either <strong>alive</strong> or <em>dead</em>.
          In each generation, the fate of every cell is determined by counting its
          8 neighboring cells and applying the ruleset's birth and survival conditions.
        </p>
      </div>
    </section>

    <section class="intro">
      <div class="intro-content">
      <h2>How It Works</h2>
      <div class="steps">

        <div class="step">
          <div class="step-number">1</div>
          <h3>Choose a Ruleset</h3>
          <p>Select the ruleset you wnat to explore below.</p>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <h3>Place Patterns</h3>
          <p>Create a pattern by clicking or select a predefined one.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Watch Evolution</h3>
          <p>Hit step or play and watch!</p>
        </div>
      </div>
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

          <p v-if="ruleset.description">{{ ruleset.description }}</p>

          <button class="btn card-cta" :style="{ background: ruleset.color }">
            Explore {{ ruleset.name }} <i aria-hidden="true" class="symb">arrow_right_alt</i>
          </button>
        </div>
      </div>
    </section>

    <footer class="landing-footer">
      <p>Built with Vue 3, TypeScript, and a passion for the game of life!</p>
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
  padding: 1.5rem 0;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  border-bottom: 1px solid var(--border-color);
}

.hero-title {
  font-size: 1.666rem;
  margin: 0 0 0.25rem 0;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1rem;
  margin: 0;
  color: var(--text-secondary);
}

.intro {
  max-width: 800px;
  margin: 1.5rem auto;
}

.intro-content h2 {
  font-size: 1.666rem;
  margin-bottom: .5rem;
  text-align: center;
}

.intro-content p {
  font-size: 1rem;
  margin-bottom: .5rem;
  color: var(--text-secondary);
}

.intro-content strong {
  color: var(--color-primary);
  font-style: normal;
    font-weight: 500;
}

.intro-content em {
  color: var(--color-danger);
  font-style: normal;
  font-weight: 500;
}

.rulesets {
  max-width: 1200px;
  margin: 0 auto;
  margin: 1.5rem auto;
  padding: 1rem 2rem;
}

.rulesets h2 {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: .5rem;
}

.ruleset-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.ruleset-card {
  flex: 1 1 300px;
  max-width: 450px;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  p {
    margin: .5rem 0;
  }
}

.ruleset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-header {
  border-left: 4px solid;
  padding-left: 1rem;
  margin-bottom: 1rem;
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
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
}
</style>
