// ApexFit Gym Application Logic & Interactive State Manager

document.addEventListener('DOMContentLoaded', () => {
  initWorkouts();
  initBMICalculator();
  initSchedule();
  initModals();
  initNavigation();
});

// --- Workout Routines Data ---
const workoutData = [
  {
    id: 'w1',
    title: 'Hypertrophy Upper Body Power',
    category: 'strength',
    duration: '45 mins',
    level: 'Intermediate',
    calories: '420 kcal',
    description: 'Bench press, bent-over rows, overhead press, and incline dumbbell flyes for upper body density.'
  },
  {
    id: 'w2',
    title: 'Lower Body Quad & Glute Blast',
    category: 'strength',
    duration: '50 mins',
    level: 'Advanced',
    calories: '550 kcal',
    description: 'Barbell back squats, Romanian deadlifts, Bulgarian split squats, and leg extension burnouts.'
  },
  {
    id: 'w3',
    title: 'Metabolic HIIT Inferno',
    category: 'hiit',
    duration: '30 mins',
    level: 'All Levels',
    calories: '480 kcal',
    description: 'Kettlebell swings, burpees, mountain climbers, and box jumps in 45-sec tabata intervals.'
  },
  {
    id: 'w4',
    title: 'Calisthenics Skill & Core',
    category: 'calisthenics',
    duration: '40 mins',
    level: 'Intermediate',
    calories: '360 kcal',
    description: 'Weighted pull-ups, ring dips, L-sit holds, and muscle-up progression drills.'
  },
  {
    id: 'w5',
    title: 'Full Body Mobility & Vinyasa',
    category: 'flexibility',
    duration: '35 mins',
    level: 'Beginner',
    calories: '210 kcal',
    description: 'Dynamic spinal decompression, hip opener flow, and shoulder thoracic mobility drills.'
  },
  {
    id: 'w6',
    title: 'Sprint Conditioning & Agility',
    category: 'hiit',
    duration: '25 mins',
    level: 'Advanced',
    calories: '400 kcal',
    description: 'Shuttle runs, ladder drills, treadmill hill sprints, and rowing machine intervals.'
  }
];

function initWorkouts() {
  const container = document.getElementById('workouts-grid');
  const tabs = document.querySelectorAll('#workout-category-tabs .tab-btn');

  function renderWorkouts(categoryFilter = 'all') {
    container.innerHTML = '';
    const filtered = categoryFilter === 'all' 
      ? workoutData 
      : workoutData.filter(w => w.category === categoryFilter);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-card workout-card';
      card.innerHTML = `
        <div>
          <div class="card-icon"><i class="ri-pulse-line"></i></div>
          <span style="color: var(--primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
        <div class="workout-meta">
          <span><i class="ri-time-line"></i> ${item.duration}</span>
          <span><i class="ri-fire-line"></i> ${item.calories}</span>
          <span><i class="ri-bar-chart-line"></i> ${item.level}</span>
        </div>
        <button class="btn btn-outline btn-start-workout" data-id="${item.id}" style="margin-top: 1.25rem; width: 100%;">
          <i class="ri-play-line"></i> Start Workout
        </button>
      `;
      container.appendChild(card);
    });

    // Event handlers for Start Workout
    document.querySelectorAll('.btn-start-workout').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const workout = workoutData.find(w => w.id === id);
        showToast(`Started routine: ${workout.title}`);
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderWorkouts(e.target.getAttribute('data-category'));
    });
  });

  renderWorkouts();
}

// --- BMI & Calorie Calculator Logic ---
function initBMICalculator() {
  const btn = document.getElementById('btn-calculate');
  const weightInput = document.getElementById('calc-weight');
  const heightInput = document.getElementById('calc-height');
  const ageInput = document.getElementById('calc-age');
  const activityInput = document.getElementById('calc-activity');
  const genderInput = document.getElementById('calc-gender');

  const bmiDisplay = document.getElementById('bmi-display');
  const bmiBadge = document.getElementById('bmi-category-badge');
  const calcCalories = document.getElementById('calc-calories');
  const calcCutting = document.getElementById('calc-cutting');

  function calculate() {
    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);
    const age = parseInt(ageInput.value);
    const activity = parseFloat(activityInput.value);
    const gender = genderInput.value;

    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
      showToast('Please enter valid height and weight values.', 'warning');
      return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    bmiDisplay.textContent = bmi;

    // Determine BMI Category
    let category = '';
    let color = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#3b82f6';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal Weight';
      color = '#10b981';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = '#f59e0b';
    } else {
      category = 'Obese';
      color = '#ff3366';
    }

    bmiBadge.textContent = category;
    bmiBadge.style.color = color;
    bmiBadge.style.borderColor = color;

    // Calculate BMR (Mifflin-St Jeor Formula)
    let bmr = 10 * weight + 6.25 * heightCm - 5 * age;
    bmr += (gender === 'male') ? 5 : -161;

    const tdee = Math.round(bmr * activity);
    const deficit = Math.round(tdee - 500);

    calcCalories.textContent = `${tdee.toLocaleString()} kcal`;
    calcCutting.textContent = `${deficit.toLocaleString()} kcal`;

    showToast(`Body metrics updated: BMI ${bmi}`);
  }

  btn.addEventListener('click', calculate);
}

// --- Schedule Timetable Data ---
const scheduleData = {
  Mon: [
    { time: '07:00 AM', name: 'Sunrise Power Yoga', trainer: 'Elena Rostova', spots: 4 },
    { time: '10:00 AM', name: 'Heavy Lifting Mechanics', trainer: 'Alex Vance', spots: 2 },
    { time: '05:30 PM', name: 'HIIT Cardio Burnout', trainer: 'Sophia Kai', spots: 6 }
  ],
  Tue: [
    { time: '08:00 AM', name: 'Calisthenics & Ring Flow', trainer: 'Marcus Reed', spots: 3 },
    { time: '12:00 PM', name: 'Cross-Training Circuit', trainer: 'Alex Vance', spots: 5 },
    { time: '06:00 PM', name: 'Boxing & Footwork Drills', trainer: 'Sophia Kai', spots: 1 }
  ],
  Wed: [
    { time: '07:00 AM', name: 'Core & Kinetic Stability', trainer: 'Elena Rostova', spots: 8 },
    { time: '04:00 PM', name: 'Olympic Weightlifting 101', trainer: 'Alex Vance', spots: 3 },
    { time: '07:00 PM', name: 'Night Inferno HIIT', trainer: 'Sophia Kai', spots: 2 }
  ],
  Thu: [
    { time: '09:00 AM', name: 'Flexibility & Spine Decompress', trainer: 'Marcus Reed', spots: 7 },
    { time: '05:00 PM', name: 'Powerlifting Max Effort', trainer: 'Alex Vance', spots: 1 }
  ],
  Fri: [
    { time: '08:00 AM', name: 'Full Body Sculpting', trainer: 'Sophia Kai', spots: 5 },
    { time: '06:00 PM', name: 'Friday Night Pump Party', trainer: 'Alex Vance', spots: 9 }
  ],
  Sat: [
    { time: '10:00 AM', name: 'Weekend Warrior Marathon', trainer: 'Marcus Reed', spots: 12 }
  ]
};

function initSchedule() {
  const container = document.getElementById('schedule-list');
  const tabs = document.querySelectorAll('#day-tabs .tab-btn');

  function renderDay(day) {
    container.innerHTML = '';
    const items = scheduleData[day] || [];

    if (items.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No classes scheduled for this day.</p>`;
      return;
    }

    items.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = `
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--border-color);
        padding: 1.25rem 1.5rem;
        border-radius: var(--radius-sm);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      `;
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1.5rem;">
          <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--primary); min-width: 90px;"><i class="ri-time-line"></i> ${item.time}</span>
          <div>
            <h4 style="font-size: 1.1rem;">${item.name}</h4>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Trainer: <strong>${item.trainer}</strong></span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="font-size: 0.85rem; color: var(--accent-neon); background: rgba(0,255,135,0.1); padding: 0.25rem 0.75rem; border-radius: var(--radius-full);"><i class="ri-user-follow-line"></i> ${item.spots} spots left</span>
          <button class="btn btn-secondary btn-reserve-class" data-class="${item.name}">Book Class</button>
        </div>
      `;
      container.appendChild(row);
    });

    document.querySelectorAll('.btn-reserve-class').forEach(b => {
      b.addEventListener('click', (e) => {
        const className = e.currentTarget.getAttribute('data-class');
        openModal(`Reserve Class: ${className}`, 'Confirm your reservation for this group session.');
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderDay(e.target.getAttribute('data-day'));
    });
  });

  renderDay('Mon');
}

// --- Modal & Toast System ---
function initModals() {
  const modal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalForm = document.getElementById('modal-form');

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.getElementById('btn-login-modal').addEventListener('click', () => {
    openModal('Member Sign In', 'Access your workout metrics & active membership details.');
  });

  document.querySelectorAll('.btn-join-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.currentTarget.getAttribute('data-plan');
      openModal(`Select Plan: ${plan}`, 'Fill out your contact details to begin your membership.');
    });
  });

  document.querySelectorAll('.btn-book-trainer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trainer = e.currentTarget.getAttribute('data-trainer');
      openModal(`Book 1-on-1 with ${trainer}`, 'Schedule your personal training session with our head coach.');
    });
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    closeModal();
    showToast(`Thank you, ${name}! Your request has been confirmed.`);
    modalForm.reset();
  });
}

function openModal(title, subtitle) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-subtitle').textContent = subtitle;
  document.getElementById('app-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('app-modal').classList.remove('active');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icon = type === 'warning' ? 'ri-error-warning-line' : 'ri-checkbox-circle-fill';
  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- Active Nav Highlighting ---
function initNavigation() {
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(10, 12, 16, 0.95)';
    navLinks.style.padding = '1.5rem';
    navLinks.style.borderBottom = '1px solid var(--border-color)';
  });
}
