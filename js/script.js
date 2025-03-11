// Clock Functionality
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('largeClock').textContent = timeString;
}
setInterval(updateClock, 1000);

// Pomodoro Timer Functionality
let pomodoroInterval;
let timeLeft;
let isBreak = false;
let pomodoroMode = 'short'; // Default mode

function startPomodoroTimer() {
    pomodoroMode = document.getElementById('pomodoroMode').value;
    timeLeft = pomodoroMode === 'short' ? 25 * 60 : 50 * 60;
    isBreak = false;
    updatePomodoroDisplay();

    if (!pomodoroInterval) {
        pomodoroInterval = setInterval(pomodoroTick, 1000);
    }
}

function stopPomodoroTimer() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    timeLeft = pomodoroMode === 'short' ? 25 * 60 : 50 * 60;
    isBreak = false;
    updatePomodoroDisplay();
}

function pomodoroTick() {
    timeLeft--;
    updatePomodoroDisplay();
    if (timeLeft <= 0) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        if (!isBreak) startBreak();
    }
}

function startBreak() {
    isBreak = true;
    timeLeft = pomodoroMode === 'short' ? 5 * 60 : 10 * 60;
    updatePomodoroDisplay();
    pomodoroInterval = setInterval(pomodoroTick, 1000);
    alert("Time for a break!");
}

function updatePomodoroDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('pomodoroTimer').textContent = `${minutes}:${seconds}`;
}

// Calendar Functionality
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth'
        });
        calendar.render();
    } else {
        console.error("Calendar element with ID 'calendar' not found in the DOM.");
    }
});

// Reminders Functionality
let reminders = [];

function setReminder() {
    const reminderText = document.getElementById('reminderText').value;
    const reminderTime = document.getElementById('reminderTime').value;

    if (reminderText && reminderTime) {
        reminders.push({ text: reminderText, time: reminderTime });
        renderReminders();
        document.getElementById('reminderText').value = '';
        document.getElementById('reminderTime').value = '';
        playReminderDingSound();
    } else {
        alert("Please enter both reminder text and time.");
    }
}

function renderReminders() {
    const reminderListEl = document.getElementById('reminderList');
    reminderListEl.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            <div>${reminder.text} - ${reminder.time}</div>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteReminder(${index})">Delete</button>
        `;
        reminderListEl.appendChild(listItem);
    });
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    renderReminders();
}

// Calorie Calculator
let totalCalories = 0;
const dailyCalorieGoal = 2000;

function calculateCalories() {
    const mealType = document.getElementById('mealType').value;
    const mealQuantity = parseInt(document.getElementById('mealQuantity').value);

    if (!isNaN(mealQuantity) && mealQuantity > 0) {
        const caloriesPerQuantity = {
            breakfast: 150,
            lunch: 300,
            dinner: 400,
            snacks: 100
        }[mealType];

        totalCalories += caloriesPerQuantity * mealQuantity;
        document.getElementById('totalCalories').textContent = `Total Calories: ${totalCalories}`;
        updateCalorieProgress();
        document.getElementById('mealQuantity').value = '';
    } else {
        alert("Please enter a valid quantity for the meal.");
    }
}

function updateCalorieProgress() {
    const progressPercentage = (totalCalories / dailyCalorieGoal) * 100;
    const progressBar = document.getElementById('calorieProgress');
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
    progressBar.classList.toggle('bg-danger', progressPercentage > 100);
    progressBar.classList.toggle('bg-success', progressPercentage <= 100);
}

// Wellbeing Functionality
let wellbeingFactors = { workDone: 5, emotion: 5, activity: 5, food: 5 };

function adjustFactor(factorName, increment) {
    wellbeingFactors[factorName] = Math.max(1, Math.min(10, wellbeingFactors[factorName] + increment));
    updateWellbeingDisplay();
}

function calculateOverallWellbeingPercentage() {
    const sum = Object.values(wellbeingFactors).reduce((acc, value) => acc + value, 0);
    return (sum / 40) * 100;
}

function updateWellbeingDisplay() {
    const overallPercentage = calculateOverallWellbeingPercentage();
    document.getElementById('overallWellbeingValue').textContent = `${Math.round(overallPercentage)}%`;

    const progressBar = document.getElementById('wellbeingProgressBar');
    progressBar.style.width = `${overallPercentage}%`;
    progressBar.setAttribute('aria-valuenow', overallPercentage);

    const emojiSpan = document.getElementById('wellbeingEmoji');
    emojiSpan.textContent = overallPercentage <= 30 ? '😔' : overallPercentage <= 70 ? '🙂' : '😄';
}

// Stretch Reminder Functionality
function showStretchReminder() {
    const stretchModal = new bootstrap.Modal(document.getElementById('stretchReminderModal'));
    stretchModal.show();
    playStretchReminderSound();
}

function setupStretchReminder() {
    setInterval(showStretchReminder, 60 * 60 * 1000); // Every hour
}

// Stretch Sound
function playStretchReminderSound() {
    const stretchDing = document.getElementById('stretchDing');
    if (stretchDing) {
        stretchDing.play().catch(err => console.error('Error playing stretch sound:', err));
    }
}

// Motivational Quotes
const motivationalQuotes = [
    "“The key to success is to schedule your priorities.” - Stephen Covey",
    "“You don't have to be extreme, just consistent.”",
    "“It’s okay not to know, but it’s not okay not to try.”",
    "“Remember why you started.”",
    "“Small steps are still progress.”"
];

function displayMotivationalQuote() {
    const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    document.getElementById('motivationalQuote').textContent = motivationalQuotes[quoteIndex];
}

// Initial setup
document.addEventListener('DOMContentLoaded', function () {
    updateClock();
    displayMotivationalQuote();
    setupStretchReminder();
    updateWellbeingDisplay();
});
