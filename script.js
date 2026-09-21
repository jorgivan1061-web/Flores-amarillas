/* =========================================================
   PARA KAREN — Un jardín inventado de flores amarillas
   Experiencia Mágica e Interactiva con Rupatrupa de fondo
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   1. GESTOR DE MÚSICA DE FONDO: RUPATRUPA
/* =========================================================
   1. GESTOR DE MÚSICA DE FONDO Y PESTAÑAS (SPOTIFY / YOUTUBE)
   ========================================================= */

let isAudioLocalPlaying = false;

function setupMusicTabs() {
  const tabSpotify = document.getElementById('tabSpotifyBtn');
  const tabYoutube = document.getElementById('tabYoutubeBtn');
  const panelSpotify = document.getElementById('panelSpotify');
  const panelYoutube = document.getElementById('panelYoutube');
  const vinyl = document.getElementById('vinylRecord');

  if (tabSpotify && tabYoutube && panelSpotify && panelYoutube) {
    tabSpotify.addEventListener('click', () => {
      tabSpotify.classList.add('is-active');
      tabYoutube.classList.remove('is-active');
      panelSpotify.classList.add('is-active');
      panelYoutube.classList.remove('is-active');
      if (vinyl) vinyl.style.animationPlayState = 'running';
    });

    tabYoutube.addEventListener('click', () => {
      tabYoutube.classList.add('is-active');
      tabSpotify.classList.remove('is-active');
      panelYoutube.classList.add('is-active');
      panelSpotify.classList.remove('is-active');
      if (vinyl) vinyl.style.animationPlayState = 'running';
    });
  }
}

function tryPlayLocalAudio() {
  const bgAudioEl = document.getElementById('bgAudio');
  if (bgAudioEl && bgAudioEl.currentSrc) {
    const p = bgAudioEl.play();
    if (p !== undefined) {
      p.then(() => {
        isAudioLocalPlaying = true;
        const icon = document.getElementById('musicIcon');
        const toggle = document.getElementById('musicToggle');
        if (icon) icon.textContent = '✨';
        if (toggle) toggle.classList.add('is-playing');
      }).catch(() => {
        // No hay archivo local, no genera error
      });
    }
  }
}

/* =========================================================
   2. SISTEMA DE EFECTOS SONOROS SUAVES (Web Audio API)
   Tonos sutiles al tocar las flores
   ========================================================= */
class GentleSound {
  constructor() {
    this.ctx = null;
    this.notes = [146.83, 164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 369.99]; 
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWarmPluck(freq, delay = 0, duration = 2.0, gainVal = 0.05) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(460, this.ctx.currentTime + delay);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      const startTime = this.ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playFlowerPluck() {
    this.init();
    if (!this.ctx) return;
    const note = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.playWarmPluck(note, 0, 2.0, 0.06);
  }

  playCelebration() {
    this.init();
    if (!this.ctx) return;
    const notes = [146.83, 196.00, 220.00, 246.94, 293.66, 369.99];
    notes.forEach((freq, i) => {
      this.playWarmPluck(freq, i * 0.14, 2.6, 0.07);
    });
  }
}

const soundEffects = new GentleSound();

/* =========================================================
   3. ESTELA DE POLVO DE ESTRELLAS (Canvas Interactivo)
   ========================================================= */
class MagicStardust {
  constructor() {
    this.canvas = document.getElementById('magicCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());

    const addSparks = (x, y, count = 2) => {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.4,
          vy: (Math.random() - 0.5) * 1.4 - 0.5,
          size: 1.5 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          color: Math.random() > 0.3 ? '#ffe066' : '#ffffff'
        });
      }
    };

    window.addEventListener('mousemove', (e) => addSparks(e.clientX, e.clientY, 2));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        addSparks(e.touches[0].clientX, e.touches[0].clientY, 3);
      }
    }, { passive: true });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#ffd43b';

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

/* =========================================================
   4. PALABRAS BONITAS PARA LAS FLORES (INTERACTIVIDAD)
   ========================================================= */
const FLOWER_MESSAGES = [
  "Tu sonrisa es mi parte favorita de todos mis días.",
  "Gracias por existir y por llenar mi vida de tanta luz.",
  "Eres mi lugar seguro en este mundo tan ruidoso.",
  "Cada segundo a tu lado vale una vida entera.",
  "Te amo con todo lo que soy, mi niña hermosa.",
  "Haces que hasta los días más grises se llenen de color.",
  "En tu abrazo siempre encuentro la calma que necesito.",
  "Eres la mujer más increíble, dulce y especial del universo.",
  "Me enamoro de ti una y otra vez, cada día más.",
  "Para mí, no existe nadie más hermosa en todo el mundo que tú.",
  "Tu mirada tiene la magia de calmar cualquier tormenta.",
  "Prometo cuidarte, quererte y hacerte sonreír siempre.",
  "Eres mi pensamiento favorito antes de dormir y al despertar.",
  "Gracias por enseñarme lo bonito que se siente amar de verdad.",
  "A tu lado todo es más lindo, más fácil y más feliz.",
  "Eres mi flor amarilla más hermosa, hoy y para siempre."
];

function showFlowerDialog(message) {
  const backdrop = document.getElementById('flowerBackdrop');
  const textEl = document.getElementById('flowerDialogText');
  if (!backdrop || !textEl) return;

  textEl.textContent = message;
  backdrop.classList.add('is-open');

  soundEffects.playFlowerPluck();

  for (let i = 0; i < 5; i++) {
    spawnPetal(true);
  }
}

function setupFlowerDialog() {
  const backdrop = document.getElementById('flowerBackdrop');
  const closeBtn = document.getElementById('flowerDialogClose');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('is-open');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('is-open');
      }
    });
  }
}

/* =========================================================
   5. CIELO, ESTRELLAS, FUGACES Y PÉTALOS
   ========================================================= */

function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = window.innerWidth < 640 ? 80 : 150;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    const isDiamond = Math.random() < 0.15;
    star.className = isDiamond ? 'star star--diamond' : 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    const size = isDiamond ? (4 + Math.random() * 3) : (1 + Math.random() * 2.2);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    if (!reduceMotion) {
      star.style.animationDuration = `${3 + Math.random() * 5}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
    }
    frag.appendChild(star);
  }
  container.appendChild(frag);
}

function spawnShootingStar() {
  if (reduceMotion) return;
  const container = document.getElementById('shootingStars');
  if (!container) return;
  const s = document.createElement('div');
  s.className = 'shooting-star';
  s.style.top = `${5 + Math.random() * 35}%`;
  s.style.left = `${45 + Math.random() * 50}%`;
  container.appendChild(s);
  setTimeout(() => s.remove(), 3000);
}

function scheduleShootingStars() {
  if (reduceMotion) return;
  const delay = 4500 + Math.random() * 6500;
  setTimeout(() => {
    spawnShootingStar();
    scheduleShootingStars();
  }, delay);
}

function createFireflies() {
  const container = document.getElementById('fireflies');
  if (!container) return;
  const count = window.innerWidth < 640 ? 12 : 22;

  for (let i = 0; i < count; i++) {
    const fly = document.createElement('div');
    fly.className = 'firefly';
    const size = 3 + Math.random() * 4;
    fly.style.width = `${size}px`;
    fly.style.height = `${size}px`;
    fly.style.left = `${Math.random() * 100}%`;
    fly.style.top = `${30 + Math.random() * 65}%`;

    if (!reduceMotion) {
      fly.style.animationDuration = `${2.5 + Math.random() * 3}s, ${6 + Math.random() * 6}s`;
      fly.style.animationDelay = `${Math.random() * 4}s, ${Math.random() * 4}s`;
    }
    container.appendChild(fly);
  }
}

function spawnPetal(isCelebration = false) {
  if (reduceMotion) return;
  const container = document.getElementById('petalsLayer');
  if (!container) return;
  const p = document.createElement('div');
  p.className = 'petal';

  const startX = Math.random() * 100;
  p.style.left = `${startX}%`;

  const size = isCelebration ? (12 + Math.random() * 16) : (9 + Math.random() * 11);
  p.style.width = `${size}px`;
  p.style.height = `${size * 1.25}px`;

  const drift = (Math.random() - 0.5) * (isCelebration ? 240 : 120);
  p.style.setProperty('--drift', `${drift}px`);

  const duration = isCelebration ? (4 + Math.random() * 4) : (7 + Math.random() * 5);
  p.style.animationDuration = `${duration}s`;

  if (isCelebration) {
    p.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
  }

  container.appendChild(p);
  setTimeout(() => p.remove(), duration * 1000 + 200);
}

function schedulePetals() {
  if (reduceMotion) return;
  const delay = 1800 + Math.random() * 3000;
  setTimeout(() => {
    spawnPetal();
    schedulePetals();
  }, delay);
}

/* =========================================================
   6. CONSTRUCCIÓN DEL GRAN JARDÍN AMARILLO
   ========================================================= */

function buildFlowerHead(size) {
  const head = document.createElement('div');
  head.className = 'flower__head';
  const headSize = size * 2.3;
  head.style.width = `${headSize}px`;
  head.style.height = `${headSize}px`;
  head.style.left = `${-headSize / 2 + 3}px`;

  const glow = document.createElement('div');
  glow.className = 'flower__glow';
  const glowSize = headSize * 2.4;
  glow.style.width = `${glowSize}px`;
  glow.style.height = `${glowSize}px`;
  glow.style.left = `${(headSize - glowSize) / 2}px`;
  glow.style.top = `${(headSize - glowSize) / 2}px`;
  head.appendChild(glow);

  const layer1Count = 12;
  const p1Len = headSize * 0.52;
  const p1Width = headSize * 0.22;
  for (let i = 0; i < layer1Count; i++) {
    const petal = document.createElement('div');
    petal.className = 'flower__petal';
    petal.style.width = `${p1Width}px`;
    petal.style.height = `${p1Len}px`;
    petal.style.left = `${headSize / 2 - p1Width / 2}px`;
    petal.style.top = `${headSize / 2 - p1Len}px`;
    petal.style.transformOrigin = `50% 100%`;
    petal.style.transform = `rotate(${(360 / layer1Count) * i}deg)`;
    petal.style.filter = 'brightness(0.92)';
    head.appendChild(petal);
  }

  const layer2Count = 8;
  const p2Len = headSize * 0.44;
  const p2Width = headSize * 0.20;
  for (let i = 0; i < layer2Count; i++) {
    const petal = document.createElement('div');
    petal.className = 'flower__petal';
    petal.style.width = `${p2Width}px`;
    petal.style.height = `${p2Len}px`;
    petal.style.left = `${headSize / 2 - p2Width / 2}px`;
    petal.style.top = `${headSize / 2 - p2Len}px`;
    petal.style.transformOrigin = `50% 100%`;
    petal.style.transform = `rotate(${(360 / layer2Count) * i + 22.5}deg)`;
    head.appendChild(petal);
  }

  const center = document.createElement('div');
  center.className = 'flower__center';
  const centerSize = headSize * 0.44;
  center.style.width = `${centerSize}px`;
  center.style.height = `${centerSize}px`;
  center.style.left = `${(headSize - centerSize) / 2}px`;
  center.style.top = `${(headSize - centerSize) / 2}px`;
  head.appendChild(center);

  return head;
}

function buildFlower(size, height, message) {
  const flower = document.createElement('div');
  flower.className = 'flower';
  flower.style.width = `${size * 2.8}px`;
  flower.style.height = `${height + size}px`;
  flower.style.margin = '0 -3px';
  flower.setAttribute('title', 'Toca para leer un mensaje de amor ✨');

  const sway = document.createElement('div');
  sway.className = 'flower__sway';
  if (!reduceMotion) {
    sway.style.animationDuration = `${3.8 + Math.random() * 2.5}s`;
    sway.style.animationDelay = `${Math.random() * 2.5}s`;
  } else {
    sway.style.animation = 'none';
  }

  const stem = document.createElement('div');
  stem.className = 'flower__stem';
  stem.style.height = `${height}px`;
  stem.style.margin = '0 auto';
  stem.style.transitionDelay = `${Math.random() * 0.4}s`;

  const leafLeft = document.createElement('div');
  leafLeft.className = 'flower__leaf flower__leaf--left';
  leafLeft.style.bottom = `${height * 0.32}px`;

  const leafRight = document.createElement('div');
  leafRight.className = 'flower__leaf flower__leaf--right';
  leafRight.style.bottom = `${height * 0.58}px`;

  const head = buildFlowerHead(size);

  sway.appendChild(stem);
  sway.appendChild(leafLeft);
  sway.appendChild(leafRight);
  sway.appendChild(head);
  flower.appendChild(sway);

  flower.addEventListener('click', () => {
    showFlowerDialog(message);
  });

  return flower;
}

function createGarden() {
  const field = document.getElementById('gardenField');
  if (!field) return;
  const isMobile = window.innerWidth < 640;
  const count = isMobile ? 11 : 16;

  for (let i = 0; i < count; i++) {
    const size = 18 + Math.random() * 22;
    const height = isMobile
      ? 80 + Math.random() * 90
      : 130 + Math.random() * 160;
    const msg = FLOWER_MESSAGES[i % FLOWER_MESSAGES.length];
    const flower = buildFlower(size, height, msg);
    flower.style.transform = `translateY(${Math.random() * 18}px)`;
    field.appendChild(flower);
  }
}

/* =========================================================
   7. REVELADO POR SCROLL (IntersectionObserver)
   ========================================================= */

function setupObservers() {
  const targets = document.querySelectorAll(
    '[data-reveal], .flower'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });

  targets.forEach((t) => observer.observe(t));
}

/* =========================================================
   8. INTRO CINEMATOGRÁFICA EXTRAVAGANTE
   ========================================================= */

function setupCinematicCurtain() {
  const curtain = document.getElementById('cinematicCurtain');
  const btn = document.getElementById('openPortalBtn');
  const seal = document.getElementById('mysticSeal');
  const shockwave = document.getElementById('shockwave');

  if (!curtain || !btn) return;

  const partContainer = document.getElementById('curtainParticles');
  if (partContainer) {
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      dot.className = 'star';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.width = `${1.5 + Math.random() * 3}px`;
      dot.style.height = dot.style.width;
      partContainer.appendChild(dot);
    }
  }

  let opened = false;
  const openPortal = () => {
    if (opened) return;
    opened = true;

    // Iniciar audio local si existe
    tryPlayLocalAudio();

    shockwave.classList.add('active');

    setTimeout(() => {
      curtain.classList.add('portal-opened');
      revealIntro();
    }, 450);

    setTimeout(() => {
      curtain.style.display = 'none';
    }, 2400);
  };

  btn.addEventListener('click', openPortal);
  if (seal) seal.addEventListener('click', openPortal);
}

function revealIntro() {
  const lines = document.querySelectorAll('#scene-intro [data-reveal]');
  lines.forEach((el) => {
    const order = parseInt(el.getAttribute('data-reveal') || '0', 10);
    setTimeout(() => {
      el.classList.add('is-visible');
    }, 200 + order * 550);
  });
}

/* =========================================================
   9. BOTÓN "ENTRAR AL JARDÍN" & PROGRESO
   ========================================================= */

function setupNavigation() {
  const enterBtn = document.getElementById('enterBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      tryPlayLocalAudio();
      document.getElementById('scene-dedication').scrollIntoView({ behavior: 'smooth' });
    });
  }

  const fill = document.getElementById('progressFill');
  const spark = document.getElementById('progressSpark');

  const update = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (fill) fill.style.width = `${pct}%`;
    if (spark) spark.style.left = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* =========================================================
   10. CELEBRACIÓN EXTRAVAGANTE (LLUVIA DE FLORES AMARILLAS - 5 SEGUNDOS)
   ========================================================= */

function createFallingYellowFlower() {
  const container = document.getElementById('flowerRainContainer') || document.body;
  const flower = document.createElement('div');
  flower.className = 'falling-flower';

  const size = 28 + Math.random() * 34; // 28px a 62px
  flower.style.width = `${size}px`;
  flower.style.height = `${size}px`;
  flower.style.left = `${Math.random() * 96}%`;

  const duration = 2.8 + Math.random() * 2.2; // 2.8s a 5.0s de caída suave
  const sway = (Math.random() - 0.5) * 160; // Desplazamiento lateral de brisa
  const scale = 0.8 + Math.random() * 0.45;

  flower.style.setProperty('--f-duration', `${duration}s`);
  flower.style.setProperty('--f-sway', `${sway}px`);
  flower.style.setProperty('--f-scale', `${scale}`);

  // SVG de flor amarilla completa brillante con pétalos y centro cálido
  flower.innerHTML = `
    <svg viewBox="0 0 100 100">
      <defs>
        <radialGradient id="rainFlowerPetalGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fffde6"/>
          <stop offset="45%" stop-color="#ffce34"/>
          <stop offset="85%" stop-color="#f39c12"/>
          <stop offset="100%" stop-color="#d35400"/>
        </radialGradient>
      </defs>
      <g>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(0 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(36 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(72 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(108 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(144 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(180 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(216 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(252 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(288 50 50)"/>
        <ellipse cx="50" cy="24" rx="9" ry="21" fill="url(#rainFlowerPetalGrad)" transform="rotate(324 50 50)"/>
        <circle cx="50" cy="50" r="14" fill="#6a350c"/>
        <circle cx="50" cy="50" r="11" fill="#9c5416"/>
        <circle cx="50" cy="50" r="7" fill="#f59f00" opacity="0.85"/>
      </g>
    </svg>
  `;

  container.appendChild(flower);

  // Eliminar automáticamente del DOM al terminar la caída
  setTimeout(() => {
    flower.remove();
  }, duration * 1000 + 400);
}

function setupCelebration() {
  const btn = document.getElementById('celebrateBtn');
  if (!btn) return;

  let isRaining = false;

  btn.addEventListener('click', () => {
    if (isRaining) return;
    isRaining = true;

    soundEffects.playCelebration();

    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span class="btn-sparkle">✨</span><span>¡Lloviendo flores amarillas para Karen!</span><span class="btn-sparkle">🌻</span>`;
    btn.style.transform = 'scale(1.08)';
    btn.style.boxShadow = '0 0 45px rgba(255, 215, 0, 0.9), 0 15px 40px rgba(230, 126, 34, 0.8)';

    // Generar ráfaga continua de flores amarillas y pétalos durante exactamente 5 segundos (5000 ms)
    const rainInterval = setInterval(() => {
      // 2 flores amarillas completas y 2 pétalos por cada tick
      createFallingYellowFlower();
      createFallingYellowFlower();
      spawnPetal(true);
      spawnPetal(true);
    }, 70);

    // Detener la lluvia a los 5 segundos exactos
    setTimeout(() => {
      clearInterval(rainInterval);
      btn.innerHTML = originalHTML;
      btn.style.transform = '';
      btn.style.boxShadow = '';
      isRaining = false;
    }, 5000);
  });
}

/* =========================================================
   11. CONTROLES DE MÚSICA DE FONDO (BOTÓN FLOTANTE & TARJETA)
   ========================================================= */

/* =========================================================
   11. CONTROLES DE MÚSICA DE FONDO (BOTÓN FLOTANTE & TARJETA)
   ========================================================= */

function setupMusicControls() {
  const toggle = document.getElementById('musicToggle');

  if (toggle) {
    toggle.addEventListener('click', () => {
      // Si hay audio local cargado, reproducir/pausar
      const bgAudioEl = document.getElementById('bgAudio');
      if (bgAudioEl && bgAudioEl.currentSrc) {
        if (bgAudioEl.paused) {
          bgAudioEl.play().catch(() => {});
          toggle.classList.add('is-playing');
        } else {
          bgAudioEl.pause();
          toggle.classList.remove('is-playing');
        }
      } else {
        // Si no hay archivo local, llevar suavemente al reproductor oficial de Spotify/YouTube
        const dedicationSec = document.getElementById('scene-dedication');
        if (dedicationSec) {
          dedicationSec.scrollIntoView({ behavior: 'smooth' });
          toggle.classList.toggle('is-playing');
        }
      }
    });
  }
}

/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  new MagicStardust();
  createStars();
  createFireflies();
  createGarden();

  setupFlowerDialog();
  setupObservers();
  setupCinematicCurtain();
  setupNavigation();
  setupCelebration();
  setupMusicTabs();
  setupMusicControls();

  scheduleShootingStars();
  schedulePetals();
});
