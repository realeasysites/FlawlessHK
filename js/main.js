(() => {
  // ---- Mobile menu ----
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('main-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Before / after slider ----
  document.querySelectorAll('.ba').forEach((ba) => {
    const range = ba.querySelector('.ba-range');
    const set = (v) => ba.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
    set(range.value);
  });

  // ---- Service cards pre-fill the form ----
  const serviceSelect = document.getElementById('service-select');
  document.querySelectorAll('[data-service]').forEach((a) => {
    a.addEventListener('click', () => {
      if (serviceSelect) serviceSelect.value = a.dataset.service;
    });
  });

  // ---- Scroll reveal ----
  const targets = document.querySelectorAll(
    '.service-card, .proof-feature, .proof-card, .review, .phone, .about-visual, .about-copy, .steps li, .town-list li, .quote-form'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((t) => {
      t.classList.add('reveal');
      io.observe(t);
    });
  }

  // ---- Quote form (static hosting → Web3Forms emails each request) ----
  // Paste the Access Key from web3forms.com here (created with the owner's email):
  const WEB3FORMS_KEY = 'PASTE-WEB3FORMS-ACCESS-KEY-HERE';
  const form = document.getElementById('quote-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));

      const data = Object.fromEntries(new FormData(form).entries());

      const missing = [];
      if (!data.name || !data.name.trim()) missing.push(form.elements.name);
      if (!data.phone || data.phone.replace(/\D/g, '').length < 10) missing.push(form.elements.phone);
      if (missing.length) {
        missing.forEach((el) => el.classList.add('invalid'));
        missing[0].focus();
        status.classList.add('err');
        status.textContent = 'Please add your name and a 10-digit phone number.';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Honeypot: bots fill the hidden field, people don't
      if (data.company_website) return;

      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `New cleaning quote request — ${data.name}${data.town ? ' (' + data.town + ')' : ''}`,
        from_name: 'Flawless Housekeeping Website',
        Name: data.name,
        Phone: data.phone,
        Email: data.email || '—',
        Town: data.town || '—',
        Service: data.service || '—',
        'Home size': data.home_size || '—',
        'How often': data.frequency || '—',
        'Best way to reach': data.preferred_contact || '—',
        Details: data.message || '—',
      };
      if (data.email) payload.replyto = data.email;

      try {
        const r = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await r.json().catch(() => ({}));
        if (!r.ok || !json.success) throw new Error('Sorry, that didn’t go through.');
        const first = (data.name || '').trim().split(' ')[0];
        form.innerHTML = `
          <div class="form-success">
            <p class="script-accent">grazie${first ? ', ' + first.replace(/[<>&"]/g, '') : ''}!</p>
            <h3>We got it.</h3>
            <p>Theresa will reach out shortly with your quote. Need us sooner? Call or text <a href="tel:+15857755424"><strong>(585) 775-5424</strong></a>.</p>
          </div>`;
      } catch (err) {
        status.classList.add('err');
        status.textContent = err.message + ' You can also call or text (585) 775-5424.';
        btn.disabled = false;
        btn.textContent = 'Send My Quote Request';
      }
    });
  }

  // ---- Footer year ----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
