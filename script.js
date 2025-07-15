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

  const coords = [
    [0.5, 0.24],[0.5, 0.23],[0.50, 0.21],[0.51, 0.18],[0.53, 0.14],[0.56, 0.11],
    [0.59, 0.09],[0.63, 0.08],[0.66, 0.08],[0.69, 0.09],[0.72, 0.11],[0.75, 0.15],
    [0.77, 0.19],[0.79, 0.24],[0.80, 0.30],[0.80, 0.35],[0.78, 0.40],[0.76, 0.45],
    [0.73, 0.50],[0.69, 0.54],[0.65, 0.57],[0.60, 0.59],[0.55, 0.60],[0.50, 0.60],
    [0.45, 0.60],[0.40, 0.59],[0.35, 0.57],[0.31, 0.54],[0.27, 0.50],[0.24, 0.45],
    [0.22, 0.40],[0.20, 0.35],[0.20, 0.30],[0.21, 0.24],[0.23, 0.19],[0.25, 0.15],
    [0.28, 0.11],[0.31, 0.09],[0.34, 0.08],[0.37, 0.08],[0.41, 0.09],[0.44, 0.11],
    [0.47, 0.14],[0.49, 0.18],[0.50, 0.21],[0.51, 0.23],[0.5, 0.25],[0.52, 0.28],
    [0.54, 0.31],[0.56, 0.33],[0.58, 0.35],[0.60, 0.37],[0.62, 0.39],[0.64, 0.41],
    [0.66, 0.42],[0.68, 0.44],[0.70, 0.45],[0.72, 0.46],[0.74, 0.47],[0.76, 0.48],
    [0.78, 0.49],[0.79, 0.50]
  ];

  notes.slice(0, coords.length).forEach((note, index) => {
    const [x, y] = coords[index];
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

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.id === 'noteModal') {
      document.getElementById('noteModal').classList.add('hidden');
    }
  });

});


  startFireworks.addEventListener('click', () => {
    transitionTo(5);
    launchFireworks();
    drawTextFireworks('Happy 2 Months!', canvas.width / 2, canvas.height / 2);
  });

  // Fireworks
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
            life: 1500
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
        if (p.life < 200) p.vy += 0.02;
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
});

