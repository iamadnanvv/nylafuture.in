(function () {
  'use strict';

  function loadStyles() {
    if (!document.querySelector('link[data-nyla-quality]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/site-quality.css';
      link.setAttribute('data-nyla-quality', 'true');
      document.head.appendChild(link);
    }
  }

  function init() {
    loadStyles();

    var spinner = document.getElementById('spinner');
    if (spinner) window.setTimeout(function () { spinner.classList.remove('show'); }, 100);

    var backToTop = document.querySelector('.back-to-top');
    function updateScrollControls() {
      var scrolled = window.scrollY > 160;
      if (backToTop) {
        backToTop.style.display = scrolled ? 'inline-flex' : 'none';
        backToTop.setAttribute('aria-label', 'Back to top');
      }
    }
    window.addEventListener('scroll', updateScrollControls, { passive: true });
    updateScrollControls();
    if (backToTop) backToTop.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });

    var toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.setAttribute('aria-label', 'Toggle navigation');
      toggler.setAttribute('aria-controls', toggler.getAttribute('data-bs-target') || 'navbarCollapse');
    }

    document.querySelectorAll('.project-overlay[data-bs-toggle="modal"]').forEach(function (link) {
      link.setAttribute('href', link.getAttribute('data-bs-target') || '#projects-section');
      link.setAttribute('role', 'button');
    });
    document.querySelectorAll('.modal').forEach(function (modal) {
      modal.setAttribute('aria-hidden', 'true');
      modal.addEventListener('shown.bs.modal', function () { modal.setAttribute('aria-hidden', 'false'); });
      modal.addEventListener('hidden.bs.modal', function () { modal.setAttribute('aria-hidden', 'true'); });
      modal.querySelectorAll('.btn-close').forEach(function (button) { button.setAttribute('aria-label', 'Close project details'); });
    });

    // Keep the existing WhatsApp contact flow, while safely encoding the complete message.
    var contactForm = document.getElementById('whatsappForm');
    if (contactForm) {
      document.addEventListener('submit', function (event) {
        if (event.target !== contactForm) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!contactForm.reportValidity()) return;
        var values = new FormData(contactForm);
        var name = (values.get('name') || document.getElementById('name').value).toString().trim();
        var email = (values.get('email') || document.getElementById('email').value).toString().trim();
        var subject = (values.get('subject') || document.getElementById('subject').value).toString().trim();
        var message = (values.get('message') || document.getElementById('message').value).toString().trim();
        var text = '*New Contact Form Submission*\n\n*Name:* ' + name + '\n*Email:* ' + email + '\n*Subject:* ' + subject + '\n*Message:* ' + message;
        window.open('https://wa.me/918089820228?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      }, true);
    }

    // Prevent repeated lead-popup interruptions after the visitor has dismissed it.
    var popup = document.getElementById('lead-capture-overlay');
    if (popup) {
      popup.setAttribute('role', 'dialog');
      popup.setAttribute('aria-modal', 'true');
      popup.setAttribute('aria-labelledby', 'lead-capture-title');
      var title = popup.querySelector('.lead-popup-title');
      if (title) title.id = 'lead-capture-title';
      var closeButton = popup.querySelector('.lead-popup-close');
      if (closeButton) {
        closeButton.setAttribute('type', 'button');
        closeButton.setAttribute('aria-label', 'Close contact form');
        closeButton.addEventListener('click', function () {
          try { sessionStorage.setItem('nylaLeadPopupDismissed', 'true'); } catch (_) { }
        });
      }
      var fields = popup.querySelectorAll('input, textarea');
      fields.forEach(function (field) {
        var label = field.previousElementSibling;
        if (label && label.tagName === 'LABEL' && !label.htmlFor) {
          if (!field.id) field.id = 'lead-' + field.name;
          label.htmlFor = field.id;
        }
      });
      try {
        if (sessionStorage.getItem('nylaLeadPopupDismissed') === 'true') {
          var observer = new MutationObserver(function () { popup.classList.remove('show'); });
          observer.observe(popup, { attributes: true, attributeFilter: ['class'] });
          popup.classList.remove('show');
        }
      } catch (_) { }
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && popup.classList.contains('show')) {
          popup.classList.remove('show');
          try { sessionStorage.setItem('nylaLeadPopupDismissed', 'true'); } catch (_) { }
        }
      });
    }

    // Existing template libraries are optional: their absence must not break navigation or forms.
    if (window.WOW && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { new window.WOW().init(); } catch (_) { }
    }
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
      var $ = window.jQuery;
      if ($('.header-carousel').length && !$('.header-carousel').hasClass('owl-loaded')) {
        $('.header-carousel').owlCarousel({ autoplay: true, smartSpeed: 1000, loop: true, dots: true, items: 1 });
      }
      if ($('.testimonial-carousel').length && !$('.testimonial-carousel').hasClass('owl-loaded')) {
        $('.testimonial-carousel').owlCarousel({ items: 1, autoplay: true, smartSpeed: 1000, animateIn: 'fadeIn', animateOut: 'fadeOut', dots: true, loop: true, nav: false });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
