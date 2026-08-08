(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revs.forEach(function (el) { ro.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
  var stage = document.getElementById('scenes');
  var current = 0;

  function setScene(n) {
    if (n === current) return;
    current = n;
    scenes.forEach(function (s, i) { s.classList.toggle('on', i + 1 === n); });
    if (stage) stage.setAttribute('data-d', String(n));
  }

  function pickScene() {
    var focus = window.scrollY + window.innerHeight * 0.5, n = 1;
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i], top = 0, el = z;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      if (top <= focus) n = parseInt(z.getAttribute('data-scene'), 10) || n;
    }
    setScene(n);
  }

  var hdrs = document.querySelectorAll('[data-pl-hdr]');
  var prods = document.querySelectorAll('[data-hero-prod]');
  var raf = null, mx = 0, my = 0;

  function frame() {
    raf = null;
    var y = window.scrollY || window.pageYOffset;
    hdrs.forEach(function (h) { h.classList.toggle('up', y > 90); });
    if (!reduce) {
      var wl = document.querySelectorAll('#water .wl');
      for (var i = 0; i < wl.length; i++) {
        var d = [0.05, 0.09, 0.03, 0.02][i] || 0.05;
        wl[i].style.setProperty('--px', (mx * d * 130).toFixed(1) + 'px');
        wl[i].style.setProperty('--py', (-y * d + my * d * 90).toFixed(1) + 'px');
      }
      prods.forEach(function (p) {
        var f = Math.min(y / 700, 1);
        p.style.transform = 'translate3d(' + (mx * -16).toFixed(2) + 'px,' + (-f * 54 + my * -10).toFixed(2) + 'px,0) scale(' + (1 - f * 0.06).toFixed(3) + ')';
        p.style.opacity = (1 - f * 0.55).toFixed(3);
      });
    }
    pickScene();
  }

  function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  if (!reduce && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('mousemove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      onScroll();
    }, { passive: true });
  }

  if (!reduce && prods.length) {
    prods.forEach(function (prod) {
      prod.animate(
        [{ filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' },
         { filter: 'drop-shadow(0 42px 68px rgba(2,20,19,.68))' },
         { filter: 'drop-shadow(0 34px 54px rgba(2,20,19,.6))' }],
        { duration: 7000, iterations: Infinity, easing: 'ease-in-out' }
      );
    });
  }

  var hstages = [].slice.call(document.querySelectorAll('[data-hstage]'));
  hstages.forEach(function (hstage) {
    var scope = hstage.closest('.purelane-hero') || hstage.parentElement;
    var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
    var hd = [].slice.call(scope.querySelectorAll('[data-hdots] button'));
    var hi = 0, htimer = null;

    function hgo(n) {
      hi = (n + hs.length) % hs.length;
      hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
      hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
    }

    function hplay() { if (!htimer && !reduce) htimer = setInterval(function () { hgo(hi + 1); }, 3800); }
    function hstop() { if (htimer) { clearInterval(htimer); htimer = null; } }
    hd.forEach(function (d, i) {
      d.addEventListener('click', function () { hstop(); hgo(i); hplay(); });
    });
    hstage.addEventListener('mouseenter', hstop);
    hstage.addEventListener('mouseleave', hplay);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? hplay() : hstop(); });
      }, { threshold: 0.2 }).observe(hstage);
    } else { hplay(); }
  });

  document.querySelectorAll('form.pl-add').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var id = form.querySelector('input[name="id"]');
      if (!id) return;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: id.value, quantity: 1 }),
        credentials: 'same-origin'
      }).then(function (r) {
        if (r.ok) {
          window.location.href = '/cart';
        } else {
          form.querySelector('button').focus();
        }
      }).catch(function () {});
    });
  });

  document.querySelectorAll('.rot').forEach(function (rot) {
    var rimgs = [].slice.call(rot.querySelectorAll('.frame .pimg'));
    var rdots = [].slice.call(rot.querySelectorAll('.dots i'));
    if (!rimgs.length) return;
    var cap = rot.querySelector('.cap');
    var capB = cap ? cap.querySelector('b') : null;
    var capS = cap ? cap.querySelector('span') : null;
    var ri = 0, rtimer = null;

    function rshow(i) {
      rimgs.forEach(function (im, k) {
        im.classList.toggle('on', k === i);
        if (rdots[k]) rdots[k].classList.toggle('on', k === i);
      });
      if (capB) capB.textContent = rimgs[i].getAttribute('data-name') || '';
      if (capS) capS.textContent = rimgs[i].getAttribute('data-note') || '';
    }

    function rstep() { ri = (ri + 1) % rimgs.length; rshow(ri); }

    if (!reduce) {
      var rro = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !rtimer) { rshow(0); rtimer = setInterval(rstep, 2900); }
          else if (!e.isIntersecting && rtimer) { clearInterval(rtimer); rtimer = null; }
        });
      }, { threshold: 0.25 });
      rro.observe(rot);
    } else {
      rshow(0);
    }
  });

  frame();
})();
