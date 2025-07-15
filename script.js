window.addEventListener('DOMContentLoaded', () => {
  const screens = [
    document.getElementById('screen1'),
    document.getElementById('screen2'),
    document.getElementById('screen3'),
    document.getElementById('screen4'),
    document.getElementById('screen5'),
    document.getElementById('screen6')
  ];

  let currentScreen = 0;

  function transitionTo(screenIndex) {
    screens.forEach((screen, i) => {
      screen.classList.toggle('hidden', i !== screenIndex);
    });
    currentScreen = screenIndex;
  }

  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      transitionTo(currentScreen + 1);
    });
  });

  const heart = document.getElementById('heart');
  const letter = document.getElementById('letter');
  const notesContainer = document.getElementById('notes-container');
  const startFireworks = document.getElementById('startFireworks');

  heart.addEventListener('click', () => {
    letter.classList.remove('hidden');
  });

  function repelFromPoint(x, y, centerX, centerY, strength) {
  const dx = x - centerX;
  const dy = y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return { x, y }; // avoid division by zero

  const factor = strength / dist;
  return {
    x: x + dx * factor,
    y: y + dy * factor
  };
}

function generateHeartCoords(numPoints) {
  const coords = [];
  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const xRaw = 16 * Math.pow(Math.sin(t), 3);
    const yRaw = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    coords.push({ xRaw, yRaw });
  }

  const xs = coords.map(p => p.xRaw);
  const ys = coords.map(p => p.yRaw);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return coords.map(p => ({
    x: (p.xRaw - minX) / (maxX - minX),
    y: 1 - (p.yRaw - minY) / (maxY - minY)
  }));
}

// === Place the notes on the heart ===
const coords = generateHeartCoords(notes.length);

notes.slice(0, coords.length).forEach((note, index) => {
  const jitterAmount = 0.015;
  let x = coords[index].x;
  let y = coords[index].y;

  // Apply jitter
  x += (Math.random() - 0.5) * jitterAmount;
  y += (Math.random() - 0.5) * jitterAmount;

  // Repel from very center-top (where overlap happens)
  const repelTop = repelFromPoint(x, y, 0.5, 0.15, 0.02);

  // Repel from center-bottom (point of heart)
  const repelBottom = repelFromPoint(repelTop.x, repelTop.y, 0.5, 0.95, 0.02);

  // Clamp final position inside container
  x = Math.min(1, Math.max(0, repelBottom.x));
  y = Math.min(1, Math.max(0, repelBottom.y));

  const div = document.createElement('div');
  div.classList.add('note-heart', note.category);
  div.title = 'Click to reveal';
  div.style.position = 'absolute';
  div.style.left = `${x * 100}%`;
  div.style.top = `${y * 100}%`;
  div.addEventListener('click', () => {
    const modal = document.getElementById('noteModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = note.message;
    modal.classList.remove('hidden');
  });

  notesContainer.appendChild(div);
});

  // Close modal when clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target.id === 'noteModal') {
      document.getElementById('noteModal').classList.add('hidden');
    }
  });

  // Fireworks canvas setup
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff69b4', '#ffd700', '#87cefa', '#ff4500', '#00ff7f'];
  let particles = [];

  function createParticles(x, y) {
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 5 + 1;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 100
      });
    }
  }

  function drawTextFireworks(text, centerX, centerY) {
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    textCanvas.width = canvas.width;
    textCanvas.height = canvas.height;
    textCtx.font = 'bold 80px Arial';
    textCtx.fillStyle = 'white';
    textCtx.textAlign = 'center';
    textCtx.fillText(text, centerX, centerY);

    const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
    const gap = 6;

    for (let y = 0; y < textCanvas.height; y += gap) {
      for (let x = 0; x < textCanvas.width; x += gap) {
        const index = (y * textCanvas.width + x) * 4;
        if (imageData.data[index + 3] > 128) {
          particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 2000
          });
        }
      }
    }
  }

  function launchFireworks() {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
        createParticles(x, y);
      }, i * 1000);
    }

    let start = Date.now();
    function animate() {
      const elapsed = Date.now() - start;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.life < 200) p.vy += 0.02; // gravity
        p.life--;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);
      if (elapsed < 30000 || particles.length > 0) {
        requestAnimationFrame(animate);
      }
    }
    animate();
  }

  // Moved inside DOMContentLoaded to access startFireworks element
  startFireworks.addEventListener('click', () => {
    transitionTo(5); // Show fireworks screen (screen6 index 5)
    launchFireworks();
    drawTextFireworks('Happy 2 Months!', canvas.width / 2, canvas.height / 2);
  });

  // Optional: Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});


