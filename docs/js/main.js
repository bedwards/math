(function () {
  'use strict';

  /* ---- Theme Toggle ---- */
  var ThemeManager = {
    init: function () {
      var stored = localStorage.getItem('math-theme');
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = stored || preferred;
      this.updateIcon();
      var self = this;
      document.getElementById('theme-toggle').addEventListener('click', function () {
        self.toggle();
      });
    },
    toggle: function () {
      var current = document.documentElement.dataset.theme;
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('math-theme', next);
      this.updateIcon();
    },
    updateIcon: function () {
      var btn = document.getElementById('theme-toggle');
      btn.textContent = document.documentElement.dataset.theme === 'dark' ? '\u2600' : '\u263E';
      btn.setAttribute('aria-label',
        document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  /* ---- Scroll Spy ---- */
  var ScrollSpy = {
    init: function () {
      this.sections = document.querySelectorAll('.math-section, .meta-section, .finale-section');
      this.navItems = document.querySelectorAll('.nav-list li');
      var self = this;
      this.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            self.activate(entry.target.id);
          }
        });
      }, { rootMargin: '-15% 0px -70% 0px' });
      this.sections.forEach(function (s) { self.observer.observe(s); });
    },
    activate: function (id) {
      this.navItems.forEach(function (item) { item.classList.remove('active'); });
      var match = document.querySelector('.nav-list li[data-target="' + id + '"]');
      if (match) match.classList.add('active');
    }
  };

  /* ---- Smooth Scrolling ---- */
  var SmoothScroll = {
    init: function () {
      document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          var href = link.getAttribute('href');
          if (href === '#') return;
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', href);
          }
        });
      });
    }
  };

  /* ---- Mobile Nav ---- */
  var MobileNav = {
    init: function () {
      var toggle = document.getElementById('nav-toggle');
      var nav = document.getElementById('nav');
      if (!toggle || !nav) return;
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      });
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      // Close on outside click
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  };

  /* ---- Progress Bar ---- */
  var ProgressBar = {
    init: function () {
      var bar = document.getElementById('progress-bar');
      if (!bar) return;
      window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
      }, { passive: true });
    }
  };

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    ThemeManager.init();
    ScrollSpy.init();
    SmoothScroll.init();
    MobileNav.init();
    ProgressBar.init();
  });
})();
