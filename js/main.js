// main.js — site interactions
document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // modal handling for project demos
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openModal(html) {
    modalContent.innerHTML = html;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // open demo buttons
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-open');
      if (id === 'kanban-demo') {
        // Kanban demo HTML container (kanban-demo.js will mount)
        openModal(`<h2>Kanban demo</h2><div id="kanbanDemoRoot"></div>`);
        if (window.startKanbanDemo) window.startKanbanDemo('#kanbanDemoRoot');
      } else if (id === 'podcast-demo') {
        openModal(`<h2>Podcast demo</h2><div id="podcastDemoRoot"></div>`);
        if (window.startPodcastDemo) window.startPodcastDemo('#podcastDemoRoot');
      }
    });
  });

  // contact form: simple mailto fallback + local confirmation
  const contactForm = document.getElementById('contactForm');
  const mailtoBtn = document.getElementById('mailtoBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = fd.get('name');
    const email = fd.get('email');
    const message = fd.get('message');
    // Basic client-side "sent" simulation
    alert(`Thanks ${name}! Message saved to your device console (for demo).\n\nIn production, wire this to an endpoint.`);
    console.log({ name, email, message });
    contactForm.reset();
  });

  mailtoBtn.addEventListener('click', () => {
    const subject = encodeURIComponent('Hello from your portfolio');
    const body = encodeURIComponent('Hi Jay-Dee,\n\nI found your portfolio and would like to get in touch.\n\nRegards,\n');
    window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
  });

});
