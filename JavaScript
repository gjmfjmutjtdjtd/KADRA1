// Переменные для основных элементов
const releaseTimer = document.getElementById('release-timer');
const releaseTitleElem = document.getElementById('release-title');
const releaseCountdownElem = document.getElementById('release-countdown');

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// ======== Функции для таймера релиза ========
function loadSettings() {
    const title = localStorage.getItem('releaseTitle') || 'Релиз через';
    const dateStr = localStorage.getItem('releaseDate');
    releaseTitleElem.textContent = title;

    if(dateStr) {
        updateCountdown(new Date(dateStr));
    } else {
        releaseCountdownElem.textContent = 'дата не установлена';
    }
}

function updateCountdown(targetDate) {
    function tick() {
        const now = new Date();
        const diff = targetDate - now;
        if(diff <= 0) {
            releaseCountdownElem.textContent = 'Релиз уже состоялся!';
            clearInterval(intervalId);
            return;
        }
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff / (1000*60*60)) % 24);
        const minutes = Math.floor((diff / (1000*60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        releaseCountdownElem.textContent =
            `${days}д ${hours}ч ${minutes}м ${seconds}с`;
    }
    tick();
    const intervalId = setInterval(tick, 1000);
}

// ======== Функции для формы заявки ========
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    console.log('Данные заявки:', { name, phone });

    formMessage.textContent = 'Отправка...';
    formMessage.style.color = '#fff';

    try {
        // Здесь должен быть реальный код для отправки данных на сервер
        // Например: await fetch('ваш_адрес_сервера', { method: 'POST', body: JSON.stringify({ name, phone }) });

        await new Promise(resolve => setTimeout(resolve, 1500));

        formMessage.textContent = 'Спасибо! Ваша заявка успешно отправлена.';
        formMessage.style.color = 'var(--green-light)';
        contactForm.reset();
    } catch (error) {
        formMessage.textContent = 'Произошла ошибка при отправке заявки. Попробуйте ещё раз.';
        formMessage.style.color = '#ff5555';
    }
});

// ======== Логика для встроенного таймера ========
(() => {
    const promoBannerBlock = document.getElementById('promo-banner-block');
    const timerEl = promoBannerBlock.querySelector('.timer');
    const countdownDuration = 1800; // 30 минут в секундах
    let countdown;
    let countdownInterval;

    function formatTime(seconds) {
        if (seconds <= 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }

    function getTodayDateString() {
        const today = new Date();
        return today.toISOString().slice(0, 10);
    }

    function isLoggedIn() {
        return sessionStorage.getItem('adminLogged') === 'true';
    }

    function startOrResumeTimer() {
        let endTime = parseInt(localStorage.getItem('promoBannerEndTime'), 10) || 0;
        const lastShownDate = localStorage.getItem('promoBannerShownDate');
        const todayDate = getTodayDateString();
        
        if (lastShownDate === todayDate && endTime > Date.now()) {
            countdown = Math.floor((endTime - Date.now()) / 1000);
        } 
        else {
            endTime = Date.now() + countdownDuration * 1000;
            localStorage.setItem('promoBannerEndTime', endTime);
            localStorage.setItem('promoBannerShownDate', todayDate);
            countdown = countdownDuration;
        }

        promoBannerBlock.style.display = 'flex';

        countdownInterval = setInterval(() => {
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                timerEl.textContent = '00:00';
                timerEl.classList.add('inactive');
                return;
            }
            timerEl.textContent = formatTime(countdown);
        }, 1000);
    }

    window.addEventListener('load', () => {
        if (!isLoggedIn()) {
            startOrResumeTimer();
        }
    });
})();

// ======== Действия при загрузке страницы ========
window.addEventListener('load', () => {
    loadSettings();
});
