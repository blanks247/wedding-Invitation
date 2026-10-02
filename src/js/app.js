import { WEDDING_CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  initRoyal3DDoorGate();
  initAudioPlayer();
  initCountdown();
  renderEvents();
  renderTraditions();
  renderGallery();
  initTalambraluSparkleCanvas();
  init3DCardParallax();
});

/* ==========================================================================
   3D TRADITIONAL TELUGU PALACE GATE CONTROLLER
   ========================================================================== */
function initRoyal3DDoorGate() {
  const doorViewport = document.getElementById('doorViewport');
  const doorStage = document.getElementById('doorStage');
  const doorSealBtn = document.getElementById('doorSealBtn');
  const audioBtn = document.getElementById('audioPlayerBtn');
  const bgAudio = document.getElementById('bgAudio');

  if (!doorSealBtn || !doorStage || !doorViewport) return;

  doorSealBtn.addEventListener('click', () => {
    // 1. Play audio on user gesture
    if (bgAudio && bgAudio.src) {
      bgAudio.play().then(() => {
        if (audioBtn) audioBtn.classList.add('playing');
      }).catch(err => {
        console.log("Audio play notice:", err);
      });
    }

    // 2. Trigger 3D Door Swing & Golden Light Burst Animation
    doorStage.classList.add('opened');

    // 3. Trigger initial celebratory Talambralu shower burst!
    if (window.triggerTalambraluBurst) {
      setTimeout(() => {
        window.triggerTalambraluBurst(150);
      }, 1000);
    }

    // 4. Fade out viewport overlay after doors swing open
    setTimeout(() => {
      doorViewport.classList.add('opened');
      setTimeout(() => {
        doorViewport.style.display = 'none';
      }, 1000);
    }, 1800);
  });
}

/* ==========================================================================
   SANNAI MELAM AUDIO PLAYER CONTROLLER
   ========================================================================== */
function initAudioPlayer() {
  const audioBtn = document.getElementById('audioPlayerBtn');
  const bgAudio = document.getElementById('bgAudio');

  if (!audioBtn || !bgAudio) return;

  bgAudio.src = WEDDING_CONFIG.audio.url;

  audioBtn.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        audioBtn.classList.add('playing');
      }).catch(err => console.log("Audio play error:", err));
    } else {
      bgAudio.pause();
      audioBtn.classList.remove('playing');
    }
  });
}

/* ==========================================================================
   LIVE COUNTDOWN TIMER TO SUHMUHURTHAM
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl) return;

  const targetDate = new Date(WEDDING_CONFIG.couple.dateISO).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minsEl.textContent = minutes.toString().padStart(2, '0');
    secsEl.textContent = seconds.toString().padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   WEDDING CEREMONY EVENT RENDERER
   ========================================================================== */
function renderEvents() {
  const container = document.getElementById('eventsGrid');
  if (!container) return;

  container.innerHTML = WEDDING_CONFIG.events.map(evt => {
    const calTitle = encodeURIComponent(`${evt.titleTelugu} (${evt.title}) - Nischala & Pratik Wedding`);
    const calDetails = encodeURIComponent(evt.details);
    const calLoc = encodeURIComponent(`${evt.location}, ${WEDDING_CONFIG.couple.city}`);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}&location=${calLoc}`;
    const mapUrl = WEDDING_CONFIG.couple.googleMapsUrl;

    return `
      <div class="event-card">
        <div class="event-img-wrapper">
          <img src="${evt.image}" alt="${evt.titleTelugu}" class="event-img" loading="lazy" />
          <div class="event-icon-badge">${evt.icon}</div>
        </div>
        <div class="event-content">
          <h3 class="event-title">${evt.titleTelugu}</h3>
          <div class="event-subtitle">${evt.subtitle}</div>
          
          <div class="event-meta">
            <div class="event-meta-item">
              <span>📅 ${evt.date}</span>
            </div>
            <div class="event-meta-item">
              <span>⏰ ${evt.time}</span>
            </div>
            <div class="event-meta-item">
              <span>📍 ${evt.location}</span>
            </div>
          </div>

          <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 25px; line-height: 1.7;">
            ${evt.details}
          </p>

          <div class="event-actions">
            <a href="${mapUrl}" target="_blank" rel="noopener" class="btn-primary">
              🗺️ వేదిక మ్యాప్ (Map)
            </a>
            <a href="${gCalUrl}" target="_blank" rel="noopener" class="btn-outline">
              📆 Google Calendar
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   TELUGU TRADITIONS RENDERER
   ========================================================================== */
function renderTraditions() {
  const container = document.getElementById('traditionsGrid');
  if (!container || !WEDDING_CONFIG.traditions) return;

  container.innerHTML = WEDDING_CONFIG.traditions.map(item => `
    <div class="tradition-card">
      <h3 class="tradition-title">${item.titleTelugu}</h3>
      <p class="tradition-desc">${item.desc}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   GALLERY RENDERER & LIGHTBOX
   ========================================================================== */
function renderGallery() {
  const container = document.getElementById('galleryGrid');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!container) return;

  container.innerHTML = WEDDING_CONFIG.gallery.map((img, idx) => `
    <div class="gallery-item" data-idx="${idx}">
      <img src="${img.url}" alt="${img.caption}" loading="lazy" />
      <div class="gallery-overlay">
        <div class="gallery-caption">${img.caption}</div>
      </div>
    </div>
  `).join('');

  container.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item && modal && modalImg) {
      const idx = item.dataset.idx;
      const imgData = WEDDING_CONFIG.gallery[idx];
      modalImg.src = imgData.url;
      modal.classList.add('active');
    }
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   3D CARD PARALLAX TILT INTERACTION
   ========================================================================== */
function init3DCardParallax() {
  const card = document.getElementById('heroCard');
  if (!card) return;

  document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
  });
}

/* ==========================================================================
   INTERACTIVE TALAMBRALU RICE, MARIGOLD PETAL & BOKEH CANVAS ENGINE
   ========================================================================== */
function initTalambraluSparkleCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let blessingCount = 0;
  const countBadge = document.getElementById('talambraluCountBadge');
  const talambraluBtn = document.getElementById('talambraluBtn');

  // Particles Array (Rice grains & Flower petals)
  const particles = [];
  const sparkles = [];

  class Particle {
    constructor(isBurst = false, originX, originY) {
      this.isBurst = isBurst;
      this.reset(originX, originY);
    }
    reset(originX, originY) {
      this.type = Math.random() > 0.4 ? 'rice' : 'petal';
      this.x = originX !== undefined ? originX : Math.random() * width;
      this.y = originY !== undefined ? originY : (this.isBurst ? Math.random() * (height / 2) : Math.random() * -height);
      
      if (this.type === 'rice') {
        // Turmeric / Pasupu Yellow Rice Grain (పసుపు తాళంబ్రాల బియ్యం)
        this.sizeW = Math.random() * 3 + 2;
        this.sizeH = Math.random() * 8 + 5;
        this.color = Math.random() > 0.3 ? '#FFC72C' : '#FFF2B2';
      } else {
        // Marigold Orange / Yellow Petal (బంతి పువ్వు)
        this.sizeW = Math.random() * 10 + 6;
        this.sizeH = Math.random() * 14 + 8;
        this.color = Math.random() > 0.5 ? 'rgba(255, 119, 0, 0.85)' : 'rgba(255, 199, 44, 0.85)';
      }

      this.speedY = this.isBurst ? (Math.random() * 3 + 1.5) : (Math.random() * 1.2 + 0.5);
      this.speedX = this.isBurst ? (Math.random() * 4 - 2) : (Math.random() * 1 - 0.5);
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 3 - 1.5;
      this.alpha = 1;
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y / 30) + this.speedX;
      this.rotation += this.rotSpeed;
      if (this.isBurst) {
        this.alpha -= 0.005;
      }
      if (this.y > height + 20 || (this.isBurst && this.alpha <= 0)) {
        if (this.isBurst) {
          const idx = particles.indexOf(this);
          if (idx > -1) particles.splice(idx, 1);
        } else {
          this.reset();
        }
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.type === 'rice') {
        // Draw elongated rice grain
        ctx.beginPath();
        ctx.ellipse(0, 0, this.sizeW / 2, this.sizeH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw marigold petal
        ctx.beginPath();
        ctx.ellipse(0, 0, this.sizeW / 2, this.sizeH / 2, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Floating Bokeh Sparkles
  class Sparkle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.alpha = Math.random() * 0.7 + 0.3;
    }
    update() {
      this.y -= this.speedY;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.fillStyle = `rgba(255, 230, 140, ${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#FFC72C';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initial Ambient Particles
  for (let i = 0; i < 40; i++) particles.push(new Particle(false));
  for (let i = 0; i < 30; i++) sparkles.push(new Sparkle());

  // Burst Function exposed globally
  window.triggerTalambraluBurst = function(count = 120) {
    blessingCount += 1;
    if (countBadge) {
      countBadge.textContent = `దీవెనలు: ${blessingCount} సార్లు కురిసాయి 🌾`;
    }

    const originX = width / 2;
    const originY = height / 3;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(true, originX + (Math.random() * 400 - 200), originY + (Math.random() * 100 - 50)));
    }
  };

  if (talambraluBtn) {
    talambraluBtn.addEventListener('click', () => {
      window.triggerTalambraluBurst(140);
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    sparkles.forEach(s => { s.update(); s.draw(); });
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p) {
        p.update();
        p.draw();
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}
