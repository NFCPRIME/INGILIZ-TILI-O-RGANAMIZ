// Global App State
let appState = {
    user: {
        language: 'uz',
        targetBand: '6.5'
    },
    currentTab: 'dashboard',
    isRecording: false,
    mediaRecorder: null,
    audioChunks: []
};

// DOM References
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const menuItems = document.querySelectorAll('.menu-item');
const viewPages = document.querySelectorAll('.view-page');
const pageTitle = document.getElementById('page-title');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const onboardingModal = document.getElementById('onboarding-modal');
const onboardingForm = document.getElementById('onboarding-form');

// Writing Word Counter
const writingTextarea = document.getElementById('writing-textarea');
const wordCountDisplay = document.getElementById('word-count');

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkOnboarding();
    setupNavigation();
    setupWritingCounter();
    setupSpeakingRecorder();
});

// Onboarding Logic
function checkOnboarding() {
    const savedProfile = localStorage.getItem('ielts_master_profile');
    if (savedProfile) {
        appState.user = JSON.parse(savedProfile);
        onboardingModal.style.display = 'none';
        updateUserUI();
    }
}

onboardingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang = document.querySelector('input[name="lang"]:checked').value;
    const band = document.getElementById('user-target-band').value;

    appState.user = { language: lang, targetBand: band };
    localStorage.setItem('ielts_master_profile', JSON.stringify(appState.user));
    onboardingModal.style.display = 'none';
    updateUserUI();
});

function updateUserUI() {
    document.getElementById('user-target-badge').innerText = `Band ${appState.user.targetBand} Target`;
}

// Navigation & Tab Switching
function setupNavigation() {
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');
            switchModule(tabName);
            if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
        });
    });

    hamburgerBtn.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
}

function switchModule(tabName) {
    appState.currentTab = tabName;
    
    menuItems.forEach(i => i.classList.remove('active'));
    const activeItem = document.querySelector(`.menu-item[data-tab="${tabName}"]`);
    if(activeItem) activeItem.classList.add('active');

    viewPages.forEach(p => p.classList.remove('active-view'));
    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) {
        targetView.classList.add('active-view');
        pageTitle.innerText = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    } else {
        document.getElementById('view-dashboard').classList.add('active-view');
        pageTitle.innerText = 'Dashboard';
    }
}

// Writing Module Real-time Word Counter
function setupWritingCounter() {
    if (!writingTextarea) return;
    writingTextarea.addEventListener('input', () => {
        const text = writingTextarea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountDisplay.innerText = words;
    });
}

// Speaking Audio Recorder
function setupSpeakingRecorder() {
    const recordBtn = document.getElementById('record-btn');
    const recordStatus = document.getElementById('record-status');
    const audioPlayback = document.getElementById('audio-playback');

    if (!recordBtn) return;

    recordBtn.addEventListener('click', async () => {
        if (!appState.isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                appState.mediaRecorder = new MediaRecorder(stream);
                appState.audioChunks = [];

                appState.mediaRecorder.ondataavailable = (e) => appState.audioChunks.push(e.data);
                appState.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(appState.audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    audioPlayback.style.display = 'block';
                };

                appState.mediaRecorder.start();
                appState.isRecording = true;
                recordBtn.classList.add('recording');
                recordStatus.innerText = "Yozilmoqda... To'xtatish uchun qayta bosing.";
            } catch (err) {
                alert("Mikrofonni ulashda xatolik yuz berdi!");
            }
        } else {
            appState.mediaRecorder.stop();
            appState.isRecording = false;
            recordBtn.classList.remove('recording');
            recordStatus.innerText = "Yozib olindi! Qayta eshitib ko'rishingiz mumkin.";
        }
    });
}

// Theme Switcher
themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});
