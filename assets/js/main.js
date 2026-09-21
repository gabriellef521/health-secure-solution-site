// Health Secure Solution — site scripts
document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Highlight current nav link */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a[href]').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Spam-bot protection: stamp any form's hidden "ts" field with the
     current time once it's actually visible to a person. Server-side
     checks reject submissions sent implausibly fast after this. */
  function stampFormTime(form) {
    var ts = form.querySelector('.js-form-ts');
    if (ts) ts.value = Date.now().toString();
  }

  /* Get A Quote modal */
  var openers = document.querySelectorAll('[data-open-quote]');
  var overlay = document.getElementById('quote-modal');
  if (overlay) {
    var closeBtn = overlay.querySelector('.modal__close');
    var quoteForm = overlay.querySelector('form');
    openers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('open');
        if (quoteForm) stampFormTime(quoteForm);
      });
    });
    function closeModal() { overlay.classList.remove('open'); }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* Animated stat counters */
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var to = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          el.textContent = Math.floor(progress * to) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = to + suffix;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { obs.observe(c); });
  }

  /* Stamp the Contact page form as soon as the page is ready, since
     that form is visible on load rather than opened like the modal. */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) stampFormTime(contactForm);

  /* Forms: front-end only placeholder.
     To make these forms actually send email, wire the action up to
     a form backend (e.g. Formspree, Namecheap PHP mail script, etc.) —
     see the notes at the bottom of contact.html */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Thanks! This form is not yet connected to an email service — see the setup note below.';
        status.className = 'form-status success';
      }
      form.reset();
    });
  });

});
