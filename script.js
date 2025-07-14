window.addEventListener('DOMContentLoaded', () => {
  const screens = [
    document.getElementById('screen1'),
    document.getElementById('screen2'),
    document.getElementById('screen3'),
    document.getElementById('screen4'),
    document.getElementById('screen5'),
    document.getElementById('screen6')
  ];

  const heart = document.getElementById('heart');
  const letter = document.getElementById('letter');
  const notesContainer = document.getElementById('notes-container');
  const startFireworks = document.getElementById('startFireworks');

  setTimeout(() => transitionTo(1), 15000);
  setTimeout(() => transitionTo(2), 30000);

  heart.addEventListener('click', () => {
    letter.classList.remove('hidden');
    setTimeout(() => transitionTo(3), 15000);
  });

  notes.forEach(note => {
    const div = document.createElement('div');
    div.classList.add('note-roll', note.category);
    div.title = 'Click to reveal';
    div.addEventListener('click', () => alert(note.message));
    notesContainer.appendChild(div);
  });

  setTimeout(() => transitionTo(4), 70000);

  startFireworks.addEventListener('click', () => {
    transitionTo(5);
    launchFireworks();
  });

  function transitionTo(screenIndex) {
    screens.forEach((s, i) => {
      s.classList.toggle('hidden', i !== screenIndex);
    });
  }

  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ff69b4', '#ffd700', '#87cefa', '#ff4500', '#00ff7f'];

  function launchFireworks() {
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

    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
        createParticles(x, y);
      }, i * 500);
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);
      requestAnimationFrame(animate);
    }
    animate();
  }
});
