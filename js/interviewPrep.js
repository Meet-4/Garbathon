// OpenAI Technical Interview Preparation & Simulator

export class InterviewPrepManager {
  constructor() {
    // Tuesday, Oct 27, 2026 at 2:00 PM PST (UTC-8 / 22:00 UTC)
    this.targetDate = new Date('2026-10-27T14:00:00-08:00');
    this.timerInterval = null;
  }

  init() {
    this.startCountdown();
    this.bindFlashcards();
  }

  startCountdown() {
    const update = () => {
      // Use current date or simulation reference
      const now = new Date();
      // If system clock is 2026, use real diff, otherwise simulate reference Oct 24, 2026
      const refNow = new Date('2026-10-24T17:18:49+05:30');
      const diffMs = this.targetDate.getTime() - refNow.getTime();

      const daysElem = document.getElementById('timer-days');
      const hoursElem = document.getElementById('timer-hours');
      const minsElem = document.getElementById('timer-mins');
      const secsElem = document.getElementById('timer-secs');

      if (!daysElem) return;

      if (diffMs <= 0) {
        daysElem.textContent = '00';
        hoursElem.textContent = '00';
        minsElem.textContent = '00';
        secsElem.textContent = '00';
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      daysElem.textContent = String(days).padStart(2, '0');
      hoursElem.textContent = String(hours).padStart(2, '0');
      minsElem.textContent = String(minutes).padStart(2, '0');
      secsElem.textContent = String(seconds).padStart(2, '0');
    };

    update();
    this.timerInterval = setInterval(update, 1000);
  }

  bindFlashcards() {
    const cards = document.querySelectorAll('.flashcard');
    cards.forEach(card => {
      const q = card.querySelector('.flashcard-question');
      if (q) {
        q.addEventListener('click', () => {
          card.classList.toggle('open');
          const toggleIcon = card.querySelector('.toggle-icon');
          if (toggleIcon) {
            toggleIcon.textContent = card.classList.contains('open') ? '▲' : '▼';
          }
        });
      }
    });
  }

  destroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}
