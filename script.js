const habitsContainer = document.getElementById('habits-container');
const addBtn = document.getElementById('add-btn');
const habitInput = document.getElementById('habit-input');
const themeToggle = document.getElementById('theme-toggle');
const quoteBanner = document.getElementById('quote-banner');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.querySelector('.progress-fill');
const streakDays = document.getElementById('streak-days');
const toast = document.getElementById('done-toast');
const toastHabit = document.getElementById('toast-habit');

// Motivational quotes (add more if you want)
const quotes = [
  "Dream big, start small, act now.",
  "Progress, not perfection.",
  "Consistency beats intensity.",
  "You've got this, twin – one day at a time.",
  "Grind in silence, let success make the noise 🔥"
];

let habits = []; 

// Load from localStorage on start
function loadHabits() {
  const saved = localStorage.getItem('grindBoardHabits');
  if (saved) {
    habits = JSON.parse(saved);
    habits.forEach(habit => createHabitCard(habit));
    updateGlobalProgress();
    updateGlobalStreak();
  }
}

// Save to localStorage
function saveHabits() {
  localStorage.setItem('grindBoardHabits', JSON.stringify(habits));
}

// Show random quote with fade
function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBanner.textContent = `"${random}"`;
  quoteBanner.style.opacity = 1;
  setTimeout(() => { quoteBanner.style.opacity = 0; }, 3000);
}

setInterval(showRandomQuote, 4000);
showRandomQuote(); // first one

// Theme toggle
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
});

// Create habit card
function createHabitCard(habit) {
  const card = document.createElement('div');
  card.classList.add('habit-card');

  card.innerHTML = `
    <h2 class="habit-name">${habit.name}</h2>
    <p class="streak">Streak: <span class="streak-count">${habit.streak || 0}</span> days 🔥</p>
    <div class="day-labels">
      <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
    </div>
    <div class="weekly-grid">
      ${Array(7).fill().map(() => '<div class="day"></div>').join('')}
    </div>
  `;

  const streakCount = card.querySelector('.streak-count');
  const days = card.querySelectorAll('.day');

  
  for (let i = 0; i < habit.doneDays; i++) {
    if (i < 7) days[6 - i].classList.add('done');
  }
  updateCardStreak();

  days.forEach((day, index) => {
    day.addEventListener('click', () => {
      day.classList.toggle('done');
      habit.doneDays = card.querySelectorAll('.day.done').length;
      updateCardStreak();
      updateGlobalProgress();
      showDoneToast(habit.name);
      saveHabits();           
    });
  });

  function updateCardStreak() {
    let count = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].classList.contains('done')) count++;
      else break;
    }
    streakCount.textContent = count;
    habit.streak = count;
    updateGlobalStreak();
  }

  habitsContainer.appendChild(card);
}

// Add new habit
addBtn.addEventListener('click', () => {
  let name = habitInput.value.trim();
  if (!name) return alert("Enter a grind, twin!");
  if (habits.some(h => h.name === name)) return alert("Already grinding that one!");

  const newHabit = { name, doneDays: 0, streak: 0 };
  habits.push(newHabit);
  createHabitCard(newHabit);
  habitInput.value = '';
  updateGlobalProgress();
  saveHabits();              
});

function updateGlobalProgress() {
  if (habits.length === 0) {
    progressPercent.textContent = '0%';
    progressFill.style.width = '0%';
    return;
  }
  const totalDone = habits.reduce((sum, h) => sum + h.doneDays, 0);
  const totalPossible = habits.length * 7;
  const percent = Math.round((totalDone / totalPossible) * 100);
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

// Global streak (longest current streak across habits)
function updateGlobalStreak() {
  const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);
  streakDays.textContent = maxStreak;
}

// Done toast
function showDoneToast(habitName) {
  toastHabit.textContent = habitName;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// Optional: Clear all button (add this HTML if you want: <button id="clear-all">Clear All</button>)
document.getElementById('clear-all')?.addEventListener('click', () => {
  if (confirm("Clear everything?")) {
    habits = [];
    habitsContainer.innerHTML = '';
    localStorage.removeItem('grindBoardHabits');
    updateGlobalProgress();
    updateGlobalStreak();
  }
});

// Start the app
loadHabits();