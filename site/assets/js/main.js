(function () {
  'use strict';
  var PIJL_TEKEN = '<svg class="p-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>';
  var PIJL_LIKS = '<svg class="p-arrow p-arrow--links" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/></svg>';
  var nav = document.getElementById('site-nav');
  var strip = document.querySelector('[data-topstrip]');
  function bijScroll() {
    var d = (window.scrollY || 0) > 60;
    if (nav) {
      nav.style.background = d ? 'rgba(11,10,9,.92)' : 'rgba(11,10,9,.58)';
      nav.style.borderBottomColor = d ? 'rgba(244,241,234,.14)' : 'rgba(244,241,234,.08)';
      nav.style.boxShadow = d ? '0 18px 40px -30px rgba(0,0,0,.9)' : 'none';
    }
    if (strip) { strip.style.height = d ? '0px' : '36px'; strip.style.opacity = d ? '0' : '1'; }
  }
  window.addEventListener('scroll', bijScroll, { passive: true });
  bijScroll();

  Array.prototype.forEach.call(document.querySelectorAll('video'), function (v) {
    v.muted = true; v.defaultMuted = true; v.volume = 0; v.loop = true;
    v.addEventListener('ended', function () { v.currentTime = 0; v.play(); });
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });

  var menu = document.getElementById('mobile-menu');
  var modal = document.getElementById('offerte-modal');
  var panel = modal ? modal.querySelector('[data-panel]') : null;
  var scrim = modal ? modal.querySelector('[data-scrim]') : null;
  var dichtTimer = null;
  function slot(aan) { document.body.style.overflow = aan ? 'hidden' : ''; }
  function openModal() {
    if (!modal) return;
    if (dichtTimer) { clearTimeout(dichtTimer); dichtTimer = null; }
    modal.style.display = 'flex';
    if (scrim) { scrim.style.animation = 'none'; void scrim.offsetWidth; scrim.style.animation = 'ssFade 180ms ease both'; }
    if (panel) { panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = 'ssPop 300ms cubic-bezier(.16,1,.3,1) both'; }
    slot(true);
  }
  function sluitModal() {
    if (!modal || modal.style.display !== 'flex') return;
    if (panel) { panel.style.animation = 'ssPopUit 240ms ease both'; }
    if (scrim) { scrim.style.animation = 'ssFadeUit 260ms ease both'; }
    slot(false);
    dichtTimer = setTimeout(function () { modal.style.display = 'none'; }, 250);
  }
  function waarde(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function stuur(scope, naam, bereik, vraag, onderwerp) {
    var chips = Array.prototype.map.call(document.querySelectorAll(scope + ' [data-chip][data-on="1"]'), function (b) { return b.getAttribute('data-chip'); });
    var body = 'Naam: ' + waarde(naam) + '\nBereikbaar op: ' + waarde(bereik) + (chips.length ? '\nOnderwerp: ' + chips.join(', ') : '') + '\n\n' + waarde(vraag);
    var kop = onderwerp ? 'Aanvraag ' + onderwerp + ' via eipibelettering.nl' : 'Aanvraag via eipibelettering.nl';
    window.location.href = 'mailto:info@eipi.nl?subject=' + encodeURIComponent(kop) + '&body=' + encodeURIComponent(body);
  }
  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('[data-chip]') : null;
    if (chip) {
      var aan = chip.getAttribute('data-on') === '1';
      chip.setAttribute('data-on', aan ? '0' : '1');
      chip.style.background = aan ? 'transparent' : '#A81E32';
      chip.style.color = aan ? (chip.getAttribute('data-uit-fg') || '#0B0A09') : '#fff';
      chip.style.borderColor = aan ? (chip.getAttribute('data-uit-bd') || 'rgba(11,10,9,.2)') : '#A81E32';
      return;
    }
    var t = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!t) return;
    var a = t.getAttribute('data-action');
    if (a === 'open-offerte') { e.preventDefault(); if (menu) menu.style.display = 'none'; openModal(); }
    else if (a === 'sluit-offerte') { sluitModal(); }
    else if (a === 'open-menu') { if (menu) { menu.style.display = 'flex'; slot(true); } }
    else if (a === 'sluit-menu') { if (menu) { menu.style.display = 'none'; } slot(false); }
    else if (a === 'verstuur') { stuur('#contact', 'ss-naam', 'ss-bereik', 'ss-vraag'); }
    else if (a === 'verstuur-svc') { stuur('#svc-aanvraag', 'svc-naam', 'svc-bereik', 'svc-vraag', t.getAttribute('data-onderwerp')); }
    else if (a === 'verstuur-pop') { stuur('#offerte-modal', 'pop-naam', 'pop-bereik', 'pop-vraag'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sluitModal(); });

  /* Open sollicitatie op werken-bij.html. Staat er geen sollicitatieformulier
     op de pagina, dan gebeurt hier niets en blijft de homepage zoals hij was. */
  var solForm = document.getElementById('sollicitatieformulier');
  if (solForm) {
    var solStatus = document.querySelector('[data-sollicitatie-status]');
    function solVeld(id) {
      var el = document.getElementById(id);
      if (!el) return true;
      var vak = el.closest('.p-field');
      var leeg = !el.value.trim();
      if (vak) vak.classList.toggle('has-error', leeg);
      if (leeg) el.focus();
      return !leeg;
    }
    document.addEventListener('click', function (e) {
      var knop = e.target.closest ? e.target.closest('[data-action="solliciteer"]') : null;
      if (!knop) return;
      var ok = solVeld('sol-naam');
      ok = solVeld('sol-bereik') && ok;
      ok = solVeld('sol-verhaal') && ok;
      if (!ok) {
        if (solStatus) { solStatus.textContent = 'Vul de gemarkeerde velden nog even in.'; solStatus.classList.add('is-visible'); }
        return;
      }
      var richting = Array.prototype.map.call(solForm.querySelectorAll('[data-chip][data-on="1"]'), function (b) { return b.getAttribute('data-chip'); });
      var cvs = Array.prototype.map.call(solForm.querySelectorAll('.p-file__name'), function (el) { return el.textContent; });
      var body = 'Naam: ' + waarde('sol-naam') + '\nBereikbaar op: ' + waarde('sol-bereik') +
        (richting.length ? '\nRichting: ' + richting.join(', ') : '') +
        (cvs.length ? '\nMijn cv: ' + cvs.join(', ') + ' (stuur ik mee als bijlage)' : '') +
        '\n\n' + waarde('sol-verhaal');
      if (solStatus) {
        solStatus.textContent = cvs.length
          ? 'Je mailprogramma opent met je sollicitatie erin. Zet ' + (cvs.length > 1 ? 'je bestanden' : cvs[0]) + ' nog even als bijlage erbij. Versturen doe je zelf.'
          : 'Je mailprogramma opent met je sollicitatie erin. Versturen doe je zelf.';
        solStatus.classList.add('is-visible');
      }
      window.location.href = 'mailto:info@eipi.nl?subject=' + encodeURIComponent('Open sollicitatie via eipibelettering.nl') + '&body=' + encodeURIComponent(body);
    });
    document.addEventListener('input', function (e) {
      var vak = e.target.closest ? e.target.closest('.p-field') : null;
      if (vak && vak.classList.contains('has-error') && e.target.value.trim()) { vak.classList.remove('has-error'); }
    });

    /* cv toevoegen: slepen of kiezen. Er is nog geen endpoint, dus de bestanden
       worden hier alleen klaargezet; de namen gaan mee de mail in en de bijlage
       zet je zelf in je mailprogramma. */
    var drop = document.getElementById('sol-cv-drop');
    var dropInput = document.getElementById('sol-cv');
    if (drop && dropInput) {
      var esc = function (s) {
        return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      };
      var bestandsLijst = document.querySelector('[data-filelist]');
      var dropFout = document.querySelector('[data-drop-error]');
      var gekozen = [];
      var MAX_AANTAL = 3;
      var MAX_BYTES = 10 * 1024 * 1024;
      var TYPES = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

      var leesbaar = function (n) {
        if (n < 1024) { return n + ' B'; }
        if (n < 1048576) { return Math.round(n / 1024) + ' kB'; }
        return (n / 1048576).toFixed(1).replace('.', ',') + ' MB';
      };
      var meld = function (tekst) {
        if (!dropFout) { return; }
        dropFout.textContent = tekst || '';
        dropFout.classList.toggle('is-visible', !!tekst);
      };
      var tekenLijst = function () {
        if (bestandsLijst) {
          var html = '';
          for (var i = 0; i < gekozen.length; i++) {
            html += '<li><span class="p-file__name">' + esc(gekozen[i].name) + '</span>' +
              '<span class="p-file__size">' + leesbaar(gekozen[i].size) + '</span>' +
              '<button type="button" class="p-file__remove" data-verwijder="' + i + '" aria-label="' + esc(gekozen[i].name) + ' weghalen">&times;</button></li>';
          }
          bestandsLijst.innerHTML = html;
          bestandsLijst.classList.toggle('is-visible', gekozen.length > 0);
        }
        drop.classList.toggle('has-file', gekozen.length > 0);
      };
      var soort = function (bestand) {
        var delen = bestand.name.split('.');
        return delen.length > 1 ? delen.pop().toLowerCase() : '';
      };
      var voegToe = function (nieuwe) {
        var geweigerd = [];
        for (var i = 0; i < nieuwe.length; i++) {
          var b = nieuwe[i];
          if (TYPES.indexOf(soort(b)) === -1) { geweigerd.push(b.name + ' (bestandstype mag niet)'); continue; }
          if (b.size > MAX_BYTES) { geweigerd.push(b.name + ' (groter dan 10 MB)'); continue; }
          if (gekozen.length >= MAX_AANTAL) { geweigerd.push(b.name + ' (maximaal ' + MAX_AANTAL + ' bestanden)'); continue; }
          var al = false;
          for (var j = 0; j < gekozen.length; j++) { if (gekozen[j].name === b.name) { al = true; } }
          if (al) { continue; }
          gekozen.push(b);
        }
        meld(geweigerd.length ? 'Niet toegevoegd: ' + geweigerd.join(', ') + '.' : '');
        tekenLijst();
      };

      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-over'); });
      drop.addEventListener('dragleave', function () { drop.classList.remove('is-over'); });
      drop.addEventListener('drop', function (e) {
        e.preventDefault();
        drop.classList.remove('is-over');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) { voegToe(e.dataTransfer.files); }
      });
      dropInput.addEventListener('change', function () {
        voegToe(dropInput.files);
        dropInput.value = '';
      });
      document.addEventListener('click', function (e) {
        var weg = e.target.closest ? e.target.closest('[data-verwijder]') : null;
        if (!weg) { return; }
        gekozen.splice(parseInt(weg.getAttribute('data-verwijder'), 10), 1);
        meld('');
        tekenLijst();
      });
      /* anders opent de browser een bestand dat je naast het vak laat vallen */
      window.addEventListener('dragover', function (e) { e.preventDefault(); });
      window.addEventListener('drop', function (e) { e.preventDefault(); });
      /* enter in een tekstveld mag de pagina niet herladen */
      solForm.addEventListener('submit', function (e) { e.preventDefault(); });
    }
  }

  /* Cijfers die omhoog tellen zodra ze in beeld komen. Zonder javascript staat
     het eindcijfer er al, dan gebeurt er niets. */
  function telOp(el) {
    if (el.getAttribute('data-geteld') === '1') { return; }
    el.setAttribute('data-geteld', '1');
    var doel;
    if (el.hasAttribute('data-since')) {
      doel = new Date().getFullYear() - parseInt(el.getAttribute('data-since'), 10);
    } else {
      doel = parseInt(el.getAttribute('data-count'), 10);
    }
    if (isNaN(doel) || doel < 0) { return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(doel);
      return;
    }
    var start = null, klaar = false;
    var zet = function (waarde) { if (!klaar) { el.textContent = String(waarde); } };
    var eind = function () { if (!klaar) { klaar = true; el.textContent = String(doel); } };
    var stap = function (t) {
      if (klaar) { return; }
      if (start === null) { start = t; }
      var p = Math.min(1, (t - start) / 1100);
      var e = 1 - Math.pow(1 - p, 3);
      zet(Math.round(doel * e));
      if (p < 1) { window.requestAnimationFrame(stap); } else { eind(); }
    };
    el.textContent = '0';
    window.requestAnimationFrame(stap);
    /* als de animatie ergens blijft hangen, springt het cijfer alsnog goed */
    window.setTimeout(eind, 1500);
  }

  /* Blokken rustig in beeld laten komen. Alleen op pagina's waar data-reveal
     staat, en zonder IntersectionObserver blijft alles gewoon zichtbaar.
     Op een koude lading wachten we tot de preloader weg is, zodat de
     bovenste blokken niet achter het deksel animeren. */
  var reveals = document.querySelectorAll('[data-reveal]');
  function beginReveal() {
    if (!reveals.length || !('IntersectionObserver' in window)) { return; }
    var kijker = new IntersectionObserver(function (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].isIntersecting) {
          var vak = items[i].target;
          /* een losse teller is zelf het doelwit, een blok heeft ze binnenin */
          if (vak.hasAttribute('data-count') || vak.hasAttribute('data-since')) { telOp(vak); }
          vak.classList.add('is-in');
          var tellers = vak.querySelectorAll('[data-count], [data-since]');
          for (var j = 0; j < tellers.length; j++) { telOp(tellers[j]); }
          kijker.unobserve(vak);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(reveals, function (el) { kijker.observe(el); });
    /* cijfers die niet in een blok met data-reveal staan tellen ook gewoon op */
    Array.prototype.forEach.call(document.querySelectorAll('[data-count], [data-since]'), function (el) {
      if (el.closest && el.closest('[data-reveal]')) { return; }
      kijker.observe(el);
    });
  }
  if (document.documentElement.className.indexOf('wipe') !== -1) { window.setTimeout(beginReveal, 460); }
  else { window.setTimeout(beginReveal, 1550); }

  /* vangnet: een cijfer dat al in beeld staat maar nog niet geteld heeft,
     gaat alsnog omhoog. Zo blijft het tellen ook werken als de observer
     een keer niet afgaat. */
  window.setTimeout(function () {
    var hoogte = window.innerHeight || document.documentElement.clientHeight;
    Array.prototype.forEach.call(document.querySelectorAll('[data-count], [data-since]'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < hoogte && r.bottom > 0) { telOp(el); }
    });
  }, 2600);



  /* Parallax op de grote foto: de afbeelding schuift rustig mee met de scroll.
     Zonder javascript staat de foto gewoon stil. */
  var vlak = document.querySelector('[data-parallax]');
  if (vlak) {
    var foto = vlak.querySelector('img');
    var bezig = false;
    var schuif = function () {
      bezig = false;
      if (!foto) { return; }
      var r = vlak.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.bottom < 0 || r.top > vh) { return; }
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      foto.style.transform = 'translate3d(0,' + (p * -9).toFixed(2) + '%,0)';
    };
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      window.addEventListener('scroll', function () {
        if (bezig) { return; }
        bezig = true;
        window.requestAnimationFrame(schuif);
      }, { passive: true });
      window.addEventListener('resize', schuif, { passive: true });
      schuif();
    }
  }

  /* Diensten-carrousel: vier items per keer, elke drie seconden een stap.
     De balk loopt in die drie seconden vol. Zonder javascript blijft de
     eerste set staan en loopt de balk gewoon. */
  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var items = slider.querySelectorAll('.p-slider__item');
    var balk = document.querySelector('.p-slider__fill');
    var per = 4;
    var sets = Math.max(1, Math.ceil(items.length / per));
    var set = 0;
    var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var toon = function (i) {
      set = ((i % sets) + sets) % sets;
      for (var k = 0; k < items.length; k++) {
        items[k].classList.toggle('is-on', Math.floor(k / per) === set);
      }
      if (balk) {
        balk.classList.add('is-hold');
        void balk.offsetWidth;
        balk.classList.remove('is-hold');
      }
    };
    if (sets > 1) {
      toon(0);
      if (!rustig) { window.setInterval(function () { toon(set + 1); }, 3000); }
    }
  }


  /* Fotocarrousel op de dienstpagina's: één foto per keer, met pijlen, teller
     en een voortgangsbalk. Draait alleen door als de bezoeker geen rustige
     voorkeur heeft, de tab zichtbaar is en de carrousel in beeld staat. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-gal]'), function (gal) {
    var slides = gal.querySelectorAll('.p-gal__slide');
    if (!slides.length) { return; }
    var stage = gal.querySelector('[data-gal-stage]') || gal;
    var fill = gal.querySelector('.p-gal__fill');
    var teller = gal.querySelector('[data-gal-now]');
    var bijschrift = gal.querySelector('[data-gal-cap]');
    var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DUR = 6500;
    var i = 0, frame = null, start = 0, vast = false, inBeeld = true;

    var stop = function () { if (frame) { window.cancelAnimationFrame(frame); frame = null; } };
    var twee = function (n) { return (n < 9 ? '0' : '') + (n + 1); };

    var herstart = function () {
      stop();
      start = 0;
      if (fill) { fill.style.width = '0%'; }
      if (rustig || vast || !inBeeld || document.hidden || slides.length < 2) { return; }
      frame = window.requestAnimationFrame(loop);
    };

    var loop = function (t) {
      if (!start) { start = t; }
      var p = Math.min(1, (t - start) / DUR);
      if (fill) { fill.style.width = (p * 100).toFixed(2) + '%'; }
      if (p >= 1) { toon(i + 1); return; }
      frame = window.requestAnimationFrame(loop);
    };

    var toon = function (n) {
      i = ((n % slides.length) + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('is-on', k === i);
        slides[k].setAttribute('aria-hidden', k === i ? 'false' : 'true');
      }
      if (teller) { teller.textContent = twee(i); }
      if (bijschrift) { bijschrift.textContent = slides[i].getAttribute('data-cap') || ''; }
      herstart();
    };

    document.addEventListener('click', function (e) {
      var knop = e.target.closest ? e.target.closest('[data-gal-dir]') : null;
      if (!knop || !gal.contains(knop)) { return; }
      toon(i + (knop.getAttribute('data-gal-dir') === 'prev' ? -1 : 1));
    });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); toon(i - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); toon(i + 1); }
    });
    gal.addEventListener('mouseenter', function () { vast = true; stop(); if (fill) { fill.style.width = '0%'; } });
    gal.addEventListener('mouseleave', function () { vast = false; herstart(); });
    gal.addEventListener('focusin', function () { vast = true; stop(); });
    gal.addEventListener('focusout', function () { vast = false; herstart(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) { stop(); } else { herstart(); } });

    /* vegen op een touchscreen */
    var x0 = null;
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) { return; }
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { toon(i + (dx < 0 ? 1 : -1)); }
      x0 = null;
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inBeeld = entries[0].isIntersecting;
        if (inBeeld) { herstart(); } else { stop(); }
      }, { threshold: 0.3 }).observe(gal);
    }

    toon(0);
  });

  /* Dienstenindex: beeld en tekst wisselen mee met de rij die je aanwijst.
     Kom je van onderen, dan schuift het nieuwe beeld van onderen in en gaat het
     oude naar boven weg; kom je van boven, dan andersom. De tekst loopt mee en
     de regel eronder komt een tel later. Zonder javascript blijft het eerste
     beeld staan en werken de rijen gewoon. */
  var idx = document.querySelector('[data-idx]');
  if (idx) {
    var vak = idx.querySelector('[data-preview]');
    var lagen = vak ? vak.querySelectorAll('[data-shot]') : null;
    var cap = vak ? vak.querySelector('.p-preview__cap') : null;
    var naamVak = cap ? cap.querySelector('[data-preview-name]') : null;
    var catVak = cap ? cap.querySelector('[data-preview-cat]') : null;
    var rijen = idx.querySelectorAll('[data-beeld]');
    var huidig = 0, boven = 0, opruimen = null, geest = null;

    var zetTekst = function (rij) {
      if (naamVak) { naamVak.textContent = rij.getAttribute('data-naam'); }
      if (catVak) { catVak.textContent = rij.getAttribute('data-cat'); }
    };

    var wissel = function (rij) {
      var i = Array.prototype.indexOf.call(rijen, rij);
      if (i === -1) { return; }
      for (var k = 0; k < rijen.length; k++) { rijen[k].classList.toggle('is-on', rijen[k] === rij); }
      if (i === huidig || !lagen || lagen.length < 2 || !vak) { zetTekst(rij); huidig = i; return; }

      var richting = i > huidig ? 'is-down' : 'is-up';
      huidig = i;

      var inkomend = lagen[boven];
      var uitgaand = lagen[1 - boven];
      boven = 1 - boven;

      var beeld = inkomend.querySelector('img');
      var bron = rij.getAttribute('data-beeld');
      if (beeld && bron && beeld.getAttribute('src') !== bron) {
        beeld.setAttribute('src', bron);
        beeld.setAttribute('alt', rij.getAttribute('data-alt') || '');
      }

      /* de oude tekst laat je nog even zien terwijl hij wegloopt */
      if (geest && geest.parentNode) { geest.parentNode.removeChild(geest); }
      if (cap) {
        geest = cap.cloneNode(true);
        geest.classList.add('is-out');
        geest.setAttribute('aria-hidden', 'true');
        geest.removeAttribute('data-preview-name');
        geest.removeAttribute('data-preview-cat');
        vak.querySelector('.p-preview__frame').appendChild(geest);
      }

      vak.classList.remove('is-down', 'is-up');
      void vak.offsetWidth;
      vak.classList.add(richting);
      uitgaand.classList.remove('is-on');
      uitgaand.classList.add('is-out');
      inkomend.classList.remove('is-out');
      inkomend.classList.add('is-on');
      zetTekst(rij);

      window.clearTimeout(opruimen);
      opruimen = window.setTimeout(function () {
        uitgaand.classList.remove('is-out');
        vak.classList.remove('is-down', 'is-up');
        if (geest && geest.parentNode) { geest.parentNode.removeChild(geest); }
        geest = null;
      }, 800);
    };

    Array.prototype.forEach.call(rijen, function (rij) {
      rij.addEventListener('mouseenter', function () { wissel(rij); });
      rij.addEventListener('focus', function () { wissel(rij); });
    });

    /* de beelden alvast in het cachegeheugen zetten, zodat een wissel nooit hapert */
    window.setTimeout(function () {
      Array.prototype.forEach.call(rijen, function (rij) {
        var beeld = new Image();
        beeld.src = rij.getAttribute('data-beeld');
      });
    }, 1400);
  }

  /* Waar het meeste werk vandaan komt: de sectie blijft staan en de panelen
     schuiven horizontaal mee met de scroll. Zonder javascript of met een
     rustige voorkeur staat alles onder elkaar. */
  var hsl = document.querySelector('[data-hscroll]');
  if (hsl) {
    var hslTrack = hsl.querySelector('[data-hscroll-track]');
    var hslPanels = hsl.querySelectorAll('[data-hpanel]');
    var hslFill = hsl.querySelector('[data-hscroll-fill]');
    var hslNow = hsl.querySelector('[data-hscroll-now]');
    var hslRustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hslAantal = hslPanels.length;
    var hslDoel = 0, hslStand = 0, hslLoopt = false, hslSnap = null, hslBezigMetSnap = false;

    var hslZetStand = function (pos) {
      var vw = hsl.clientWidth || document.documentElement.clientWidth;
      hslTrack.style.transform = 'translate3d(' + (-pos * 100).toFixed(4) + '%,0,0)';
      for (var i = 0; i < hslAantal; i++) {
        hslPanels[i].style.setProperty('--hp', Math.min(1, Math.abs(pos - i)).toFixed(4));
        hslPanels[i].style.setProperty('--hdx', ((pos - i) * vw).toFixed(1) + 'px');
        hslPanels[i].classList.toggle('is-on', Math.abs(pos - i) < 0.5);
      }
      var dichtst = Math.round(pos);
      if (hslNow) { hslNow.textContent = (dichtst < 9 ? '0' : '') + (dichtst + 1); }
      if (hslFill) { hslFill.style.width = ((pos / (hslAantal - 1)) * 100).toFixed(2) + '%'; }
    };

    /* de baan loopt vloeiend achter de scroll aan */
    var hslStap = function () {
      hslStand += (hslDoel - hslStand) * 0.13;
      if (Math.abs(hslDoel - hslStand) < 0.0006) {
        hslStand = hslDoel;
        hslLoopt = false;
      } else {
        hslLoopt = true;
        window.requestAnimationFrame(hslStap);
      }
      hslZetStand(hslStand);
    };
    var hslStart = function () {
      if (!hslLoopt) { hslLoopt = true; window.requestAnimationFrame(hslStap); }
    };

    var hslLees = function () {
      var r = hsl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var afstand = hsl.offsetHeight - vh;
      var p = afstand > 0 ? Math.min(1, Math.max(0, -r.top / afstand)) : 0;
      hslDoel = p * (hslAantal - 1);
      return vh;
    };

    /* na een korte pauze legt hij het dichtstbijzijnde paneel netjes op zijn plek */
    var hslLeg = function (vh) {
      if (hslBezigMetSnap) { return; }
      var r = hsl.getBoundingClientRect();
      if (r.top > 0 || r.bottom < vh) { return; }
      var dichtst = Math.round(hslDoel);
      if (Math.abs(hslDoel - dichtst) < 0.05) { return; }
      var afstand = hsl.offsetHeight - vh;
      var top = hsl.offsetTop + (dichtst / (hslAantal - 1)) * afstand;
      hslBezigMetSnap = true;
      window.scrollTo({ top: top, behavior: 'smooth' });
      window.setTimeout(function () { hslBezigMetSnap = false; }, 700);
    };

    if (hslRustig || hslAantal < 2) {
      hsl.classList.add('is-plat');
      for (var hp = 0; hp < hslAantal; hp++) { hslPanels[hp].classList.add('is-on'); }
    } else {
      hslStand = hslDoel;
      var hslVh = hslLees();
      hslStand = hslDoel;
      hslZetStand(hslStand);

      window.addEventListener('scroll', function () {
        var vh = hslLees();
        hslStart();
        if (hslSnap) { window.clearTimeout(hslSnap); }
        hslSnap = window.setTimeout(function () { hslLeg(vh); }, 260);
      }, { passive: true });

      window.addEventListener('resize', function () {
        var vh = hslLees();
        hslStand = hslDoel;
        hslZetStand(hslStand);
        hslSnap = window.setTimeout(function () { hslLeg(vh); }, 260);
      }, { passive: true });
    }
  }

  /* Materiaal en opties: horizontale panelen. Eén staat open, de rest is een
     smalle kolom met het nummer en de titel op zijn kant. */
  var xacc = document.querySelector('[data-xacc]');
  if (xacc) {
    var xpanels = xacc.querySelectorAll('[data-xacc-panel]');
    var xzet = function (kies) {
      Array.prototype.forEach.call(xpanels, function (p) {
        var aan = p === kies;
        p.classList.toggle('is-on', aan);
        var knop = p.querySelector('[data-xacc-knop]');
        if (knop) { knop.setAttribute('aria-expanded', aan ? 'true' : 'false'); }
      });
    };
    Array.prototype.forEach.call(xpanels, function (p, i) {
      var knop = p.querySelector('[data-xacc-knop]');
      if (!knop) { return; }
      knop.addEventListener('click', function () { xzet(p); });
      knop.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
        e.preventDefault();
        var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + xpanels.length) % xpanels.length;
        xzet(xpanels[n]);
        var volg = xpanels[n].querySelector('[data-xacc-knop]');
        if (volg) { volg.focus(); }
      });
    });
  }

  /* Zo werkt het: de rode lijn loopt vol met de scroll en de stappen lichten
     één voor één op. Zonder javascript staat alles gewoon aan. */
  var flow = document.querySelector('[data-flow]');
  if (flow) {
    var flowStappen = flow.querySelectorAll('.p-flow__stap');
    var flowRustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var flowBezig = false;

    if (flowRustig) {
      for (var fs = 0; fs < flowStappen.length; fs++) { flowStappen[fs].classList.add('is-aan'); }
    } else {
      var flowTeken = function () {
        flowBezig = false;
        var r = flow.getBoundingClientRect();
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var p = (vh * 0.88 - r.top) / Math.max(1, r.height + vh * 0.12);
        p = Math.min(1, Math.max(0, p));
        flow.style.setProperty('--vul', (p * 100).toFixed(2) + '%');
        for (var i = 0; i < flowStappen.length; i++) {
          flowStappen[i].classList.toggle('is-aan', p >= (i / flowStappen.length) - 0.001);
        }
      };
      window.addEventListener('scroll', function () {
        if (flowBezig) { return; }
        flowBezig = true;
        window.requestAnimationFrame(flowTeken);
      }, { passive: true });
      window.addEventListener('resize', flowTeken, { passive: true });
      flowTeken();
    }
  }

  /* Kleefbalk met alle diensten: de dienst die je leest in het midden zetten,
     want op een telefoon passen niet alle elf naast elkaar. */
  var svcbar = document.querySelector('.p-svcbar__in');
  var svcnu = svcbar ? svcbar.querySelector('[aria-current="page"]') : null;
  if (svcbar && svcnu) {
    svcbar.scrollLeft = Math.max(0, svcnu.offsetLeft - (svcbar.clientWidth - svcnu.offsetWidth) / 2);
  }

  /* Projecten: de kaarten komen uit assets/data/projecten.js, het filter
     hierboven werkt op het type en een project opent in een paneel van rechts.
     Zonder javascript staat er een korte uitleg in de pagina zelf. */
  var werkvak = document.querySelector('[data-projecten]');
  if (werkvak) {
    var filtervak = document.querySelector('[data-filters]');
    var paneel = document.getElementById('p-paneel');
    var paneelIn = paneel ? paneel.querySelector('[data-paneel-in]') : null;
    var alleProjecten = [];
    var actiefFilter = 'alles';
    var vorigeKnop = null;

    var esc = function (s) {
      return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };

    /* De foto's van een project, met die van kaartbeeld vooraan. Zo kan de
       klant zelf kiezen welke foto de kaart opent zonder de lijst te sorteren. */
    var volgorde = function (pr) {
      var beelden = (pr.beelden || []).filter(function (b) { return b && b.src; });
      if (!pr.kaartbeeld) { return beelden; }
      var voor = [], rest = [];
      beelden.forEach(function (b) { (b.src === pr.kaartbeeld ? voor : rest).push(b); });
      return voor.concat(rest);
    };

    /* de kaartjes zijn klein, dus gebruiken we de lichte versie uit
       assets/img/klein; is die er niet, dan pakt de browser het origineel */
    var klein = function (src) {
      var naam = String(src).split('/').pop().replace(/\.[a-z]+$/i, '');
      return 'assets/img/klein/' + naam + '.jpg';
    };
    var vangOp = function (vak) {
      Array.prototype.forEach.call(vak.querySelectorAll('img[data-groot]'), function (img) {
        img.addEventListener('error', function () { img.src = img.getAttribute('data-groot'); }, { once: true });
      });
    };

    /* De hero op de projectenpagina toont één uitgelicht project op de volle
       breedte. Welk project dat is staat bij _home.uitgelicht in de gegevens. */
    var uitBeeld = document.querySelector('[data-werk-uitgelicht-beeld]');
    var uitNaam = document.querySelector('[data-werk-uitgelicht-naam]');
    var uitLink = document.querySelector('[data-werk-uitgelicht-link]');
    var middel = function (src) {
      var naam = String(src).split('/').pop().replace(/\.[a-z]+$/i, '');
      return 'assets/img/middel/' + naam + '.jpg';
    };
    var zetUitgelicht = function () {
      if (!uitBeeld || !alleProjecten.length) { return; }
      var pr = null;
      var gekozen = (window.EIPI_PROJECTEN && window.EIPI_PROJECTEN._home && window.EIPI_PROJECTEN._home.uitgelicht) || '';
      for (var i = 0; i < alleProjecten.length; i++) {
        if (alleProjecten[i].id === gekozen) { pr = alleProjecten[i]; }
      }
      if (!pr) { pr = alleProjecten[0]; }
      var beeld = volgorde(pr)[0];
      if (beeld) {
        uitBeeld.src = middel(beeld.src);
        uitBeeld.setAttribute('data-groot', beeld.src);
        uitBeeld.alt = beeld.alt;
        uitBeeld.addEventListener('error', function () { uitBeeld.src = beeld.src; }, { once: true });
      }
      if (uitNaam) { uitNaam.textContent = pr.titel; }
      if (uitLink) {
        uitLink.setAttribute('data-project', pr.id);
        uitLink.setAttribute('href', '#project-' + pr.id);
      }
    };

    /* De kaart is één foto: die van kaartbeeld, of anders de eerste. */    /* De kaart is één foto: die van kaartbeeld, of anders de eerste. */    /* De kaart is één foto: die van kaartbeeld, of anders de eerste. */
    var kaart = function (pr) {
      var beelden = volgorde(pr);
      var beeld = beelden[0];
      return '<article class="p-werkkaart" data-kaart="' + esc(pr.id) + '">' +
        '<div class="p-werkkaart__kop">' +
          '<span class="p-werkkaart__plaats">' + esc(pr.plaats || '') + '</span>' +
          '<span class="p-werkkaart__type">' + esc(pr.type || '') + '</span>' +
          (pr.voorbeeld ? '<span class="p-werkkaart__monster">Voorbeeld</span>' : '') +
        '</div>' +
        (beeld ? '<div class="p-werkkaart__beeld"><img src="' + esc(beeld.src) + '" alt="' + esc(beeld.alt) + '" loading="lazy" decoding="async"><span class="p-stock p-corner">Tijdelijke foto</span></div>' : '') +
        '<h3 class="p-werkkaart__t">' + esc(pr.titel) + '</h3>' +
        '<p class="p-werkkaart__l">' + esc(pr.samenvatting || '') + '</p>' +
        '<span class="p-werkkaart__voet"><span class="p-arrowlink">Bekijk project ' + PIJL_TEKEN + '</span></span>' +
        '<button type="button" class="p-werkkaart__tik" data-project="' + esc(pr.id) + '" aria-label="Bekijk project: ' + esc(pr.titel) + '"></button>' +
      '</article>';
    };

    /* De fotocarrousel in het paneel: pijltjes, teller, thumbnails en vegen. */
    var startGal = function () {
      var gal = paneelIn.querySelector('[data-pgal]');
      if (!gal) { return; }
      var baan = gal.querySelector('[data-baan]');
      var stuk = gal.querySelector('[data-stuk]');
      var vakken = baan.children;
      var n = vakken.length;
      if (n < 2) { return; }
      var teller = gal.querySelector('[data-teller] b');
      var duimen = gal.querySelectorAll('[data-duim]');
      var i = 0, veeg = null, gesleept = false;

      var ga = function (naar) {
        i = (naar + n) % n;
        baan.style.transform = 'translate3d(' + (-i * 100) + '%, 0, 0)';
        if (teller) { teller.textContent = String(i + 1); }
        Array.prototype.forEach.call(duimen, function (d, k) {
          d.className = k === i ? 'p-paneel__duimknop is-on' : 'p-paneel__duimknop';
          d.setAttribute('aria-current', k === i ? 'true' : 'false');
        });
      };

      gal.addEventListener('click', function (e) {
        var doel = e.target;
        var pijl = doel.closest ? doel.closest('[data-stap]') : null;
        if (pijl) { ga(i + parseInt(pijl.getAttribute('data-stap'), 10)); return; }
        var duim = doel.closest ? doel.closest('[data-duim]') : null;
        if (duim) { ga(parseInt(duim.getAttribute('data-duim'), 10)); }
      });

      if (stuk) {
        stuk.addEventListener('pointerdown', function (e) { veeg = { x: e.clientX, y: e.clientY }; });
        stuk.addEventListener('pointerup', function (e) {
          if (!veeg) { return; }
          var dx = e.clientX - veeg.x, dy = e.clientY - veeg.y;
          veeg = null;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { gesleept = true; ga(i + (dx < 0 ? 1 : -1)); }
        });
        stuk.addEventListener('pointercancel', function () { veeg = null; });
        /* een veeg mag de klik erna niet alsnog als klik tellen */
        stuk.addEventListener('click', function (e) { if (gesleept) { gesleept = false; e.preventDefault(); e.stopPropagation(); } }, true);
      }
      ga(0);
      return function (kant) { ga(i + kant); };
    };
    var galStap = null;

    /* Het raster is een dichte doos met dunne lijnen. Als de laatste rij niet
       vol is, vullen we het lege vak met een kaart die uitnodigt om zelf iets
       te laten maken. Past het niet, dan komt hij er niet. */
    var kolommen = function () {
      var rij = (window.getComputedStyle(werkvak).gridTemplateColumns || '').trim();
      return rij ? rij.split(/\s+/).length : 1;
    };
    var vulAan = function (aantal) {
      var k = kolommen();
      if (k < 2 || !aantal) { return; }
      var rest = (k - (aantal % k)) % k;
      if (rest < 1) { return; }
      var vak = document.createElement('div');
      vak.className = 'p-werkvul';
      vak.style.gridColumn = 'span ' + rest;
      /* geen verkooppraatje: onderaan staat al een CTA. Dit is een kijkje
         achter de schermen, zodat het lege vak ook iets te lezen geeft. */
      vak.innerHTML =
        '<div>' +
          '<p class="p-werkvul__kop">Uit de werkplaats</p>' +
          '<h3 class="p-werkvul__t">Alles gebeurt hier<span class="p-dot">.</span></h3>' +
          '<p class="p-werkvul__l">Ontwerp, productie en montage: het komt allemaal uit ons eigen pand aan de Volume in Purmerend. Daarom schakelt het kort en houd je één aanspreekpunt.</p>' +
        '</div>' +
        '<p class="p-werkvul__lijst"><span>Freesletters</span><span>Doosletters</span><span>Lichtbakken</span><span>Snijfolie</span><span>Raamfolie</span><span>Banieren</span><span>Acrylaat</span><span>Canvas</span></p>';
      werkvak.appendChild(vak);
    };

    var teken = function () {
      var zichtbaar = alleProjecten.filter(function (pr) {
        return actiefFilter === 'alles' || pr.type === actiefFilter;
      });
      werkvak.innerHTML = zichtbaar.map(kaart).join('');
      vulAan(zichtbaar.length);
      var leeg = document.querySelector('[data-werkleeg]');
      if (leeg) { leeg.hidden = zichtbaar.length > 0; }
    };

    var open = function (id, knop) {
      var pr = null;
      for (var i = 0; i < alleProjecten.length; i++) { if (alleProjecten[i].id === id) { pr = alleProjecten[i]; } }
      if (!pr || !paneel || !paneelIn) { return; }
      vorigeKnop = knop || null;
      var fotos = volgorde(pr);
      var beelden = fotos.length ? '<div class="p-paneel__gal" data-pgal>' +
          '<div class="p-paneel__stuk" data-stuk>' +
            '<div class="p-paneel__baan" data-baan>' +
              fotos.map(function (b, i) {
                return '<span class="p-paneel__vak"><img src="' + esc(b.src) + '" alt="' + esc(b.alt) + '"' +
                  (i ? ' loading="lazy"' : '') + ' decoding="async"><span class="p-stock p-corner">Tijdelijke foto</span></span>';
              }).join('') +
            '</div>' +
            (fotos.length > 1 ?
              '<button type="button" class="p-paneel__pijl p-paneel__pijl--vorige" data-stap="-1" aria-label="Vorige foto van ' + esc(pr.titel) + '">' + PIJL_LIKS + '</button>' +
              '<button type="button" class="p-paneel__pijl p-paneel__pijl--volgende" data-stap="1" aria-label="Volgende foto van ' + esc(pr.titel) + '">' + PIJL_TEKEN + '</button>' +
              '<span class="p-paneel__teller" data-teller aria-hidden="true"><b>1</b><i>/</i>' + fotos.length + '</span>' : '') +
          '</div>' +
          (fotos.length > 1 ?
            '<div class="p-paneel__duim">' +
              fotos.map(function (b, i) {
                return '<button type="button" class="p-paneel__duimknop' + (i ? '' : ' is-on') + '" data-duim="' + i + '" aria-label="Foto ' + (i + 1) + ' van ' + fotos.length + '">' +
                  '<img src="' + esc(b.src) + '" alt="" loading="lazy" decoding="async"></button>';
              }).join('') +
            '</div>' : '') +
        '</div>' : '';
      var wat = (pr.wat || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
      var alineas = (pr.omschrijving || []).map(function (a) { return '<p>' + esc(a) + '</p>'; }).join('');
      paneelIn.innerHTML =
        '<p class="p-paneel__type">' + esc(pr.type || '') + (pr.plaats ? ' &middot; ' + esc(pr.plaats) : '') + '</p>' +
        '<h2 class="p-paneel__t" id="p-paneel-titel">' + esc(pr.titel) + '</h2>' +
        (pr.samenvatting ? '<p class="p-paneel__lead">' + esc(pr.samenvatting) + '</p>' : '') +
        beelden +
        '<div class="p-paneel__cols">' +
          (wat ? '<div><p class="p-paneel__kop">Wat we deden</p><ul class="p-paneel__lijst">' + wat + '</ul></div>' : '<div></div>') +
          '<div class="p-paneel__body">' + alineas + '</div>' +
        '</div>' +
        '<div class="p-paneel__voet">' +
          '<a class="p-btn" href="contact.html#contact">Zoiets nodig? Vraag een ontwerp aan</a>' +
          '<a class="p-arrowlink" href="diensten.html">Alle diensten ' + PIJL_TEKEN + '</a>' +
          (pr.voorbeeld ? '<p class="p-paneel__voorbeeld">Voorbeeld &middot; echte projecten volgen</p>' : '') +
        '</div>';
      paneel.hidden = false;
      document.body.classList.add('p-paneel-open');
      void paneel.offsetWidth; /* eerst even laten staan, dan schuift hij echt in */
      paneel.classList.add('is-open');
      galStap = startGal();
      var sluit = paneel.querySelector('.p-paneel__sluit');
      if (sluit) { sluit.focus(); }
      if (history.replaceState) { history.replaceState(null, '', '#project-' + pr.id); }
    };

    var dicht = function () {
      if (!paneel || paneel.hidden) { return; }
      paneel.classList.remove('is-open');
      document.body.classList.remove('p-paneel-open');
      window.setTimeout(function () { paneel.hidden = true; }, 560);
      if (history.replaceState) { history.replaceState(null, '', window.location.pathname + window.location.search); }
      if (vorigeKnop) { vorigeKnop.focus(); vorigeKnop = null; }
    };

    /* De projecten komen uit assets/data/projecten.js. Dat is gewoon één bestand
       met de gegevens erin; geen fetch, zodat de pagina het ook doet als je hem
       direct vanaf de schijf opent. */
    var start = function (data) {
      alleProjecten = (data && data.projecten) || [];
      if (filtervak) {
        var types = ['alles'];
        alleProjecten.forEach(function (pr) { if (pr.type && types.indexOf(pr.type) === -1) { types.push(pr.type); } });
        /* twee regels, de bovenste wat korter: dat leest rustiger dan een
           sliert die per schermbreedte anders omvalt */
        var chips = types.map(function (tp) {
          return '<button type="button" class="p-filter" data-filter="' + esc(tp) + '" aria-pressed="' + (tp === 'alles' ? 'true' : 'false') + '">' + esc(tp === 'alles' ? 'Alles' : tp) + '</button>';
        });
        var eerste = Math.max(1, Math.floor(chips.length / 2));
        filtervak.innerHTML =
          '<span class="p-filters__rij">' + chips.slice(0, eerste).join('') + '</span>' +
          '<span class="p-filters__rij">' + chips.slice(eerste).join('') + '</span>';
        filtervak.addEventListener('click', function (e) {
          var knop = e.target.closest ? e.target.closest('[data-filter]') : null;
          if (!knop) { return; }
          actiefFilter = knop.getAttribute('data-filter');
          Array.prototype.forEach.call(filtervak.querySelectorAll('[data-filter]'), function (k) {
            k.setAttribute('aria-pressed', k === knop ? 'true' : 'false');
          });
          teken();
          /* na het filteren weer bij de bovenkant van de projecten beginnen */
          var kopvak = document.querySelector('.p-werkkop') || werkvak;
          var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          var naar = kopvak.getBoundingClientRect().top + window.pageYOffset - 130;
          window.scrollTo({ top: naar < 0 ? 0 : naar, behavior: rustig ? 'auto' : 'smooth' });
        });
      }
      teken();
      zetUitgelicht();

      document.addEventListener('click', function (e) {
        var knop = e.target.closest ? e.target.closest('[data-project]') : null;
        if (knop) { open(knop.getAttribute('data-project'), knop); }
      });
      var uitgelicht = document.querySelector('[data-uitgelicht]');
      if (uitgelicht) {
        uitgelicht.addEventListener('click', function (e) {
          e.preventDefault();
          open(uitgelicht.getAttribute('data-uitgelicht'), uitgelicht);
        });
      }
      /* De filters blijven alleen binnen de projectensectie onderin staan:
         zodra de kop met de filters voorbij is, en niet meer bij het CTA-blok
         of de voettekst. Scroll je terug omhoog, dan verdwijnt hij weer. */
      if (filtervak && 'IntersectionObserver' in window) {
        var voorbijKop = false, inKaarten = false, inCta = false, inVoet = false;
        var zetBalk = function () {
          var aan = voorbijKop && inKaarten && !inCta && !inVoet;
          /* vast zodra we voorbij de kop zijn, zodat hij alleen op en neer gaat */
          filtervak.classList.toggle('p-filters--plak', voorbijKop);
          filtervak.classList.toggle('p-filters--op', aan);
        };
        var kopvak = document.querySelector('.p-werkkop');
        if (kopvak) {
          new IntersectionObserver(function (items) {
            var e = items[0];
            /* alleen 'voorbij' als de kop boven het scherm uit is, niet eronder */
            voorbijKop = !e.isIntersecting && e.boundingClientRect.top < 0;
            zetBalk();
          }, { threshold: 0 }).observe(kopvak);
        }
        new IntersectionObserver(function (items) {
          inKaarten = items[0].isIntersecting; zetBalk();
        }, { threshold: 0 }).observe(werkvak);
        var cta = document.querySelector('.p-cta');
        if (cta) {
          cta = cta.closest('section') || cta;
          new IntersectionObserver(function (items) {
            inCta = items[0].isIntersecting; zetBalk();
          }, { threshold: 0 }).observe(cta);
        }
        var voet = document.querySelector('.p-footer');
        if (voet) {
          new IntersectionObserver(function (items) {
            inVoet = items[0].isIntersecting; zetBalk();
          }, { threshold: 0 }).observe(voet);
        }
      }

      if (paneel) {
        paneel.addEventListener('click', function (e) {
          if (e.target.closest && e.target.closest('[data-paneel-sluit]')) { dicht(); }
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { dicht(); return; }
        if (!paneel || paneel.hidden) { return; }
        if (e.key === 'ArrowLeft' && galStap) { galStap(-1); }
        if (e.key === 'ArrowRight' && galStap) { galStap(1); }
      });

      /* een link als #project-puien opent meteen het juiste paneel */
      var hash = window.location.hash || '';
      if (hash.indexOf('#project-') === 0) { open(hash.replace('#project-', ''), null); }
    };

    if (window.EIPI_PROJECTEN && window.EIPI_PROJECTEN.projecten && window.EIPI_PROJECTEN.projecten.length) {
      start(window.EIPI_PROJECTEN);
    } else {
      werkvak.innerHTML = '';
      var leegvak = document.querySelector('[data-werkleeg]');
      if (leegvak) {
        leegvak.hidden = false;
        leegvak.textContent = 'De projecten konden niet geladen worden. Bel ons even, dan vertellen we erover.';
      }
    }
  }

  /* Het team op de over-ons pagina: per afdeling een rij mensen, uit team.js.
     Zo kan de klant zelf afdelingen en collega's toevoegen of verplaatsen. */
  var teamvak = document.querySelector('[data-team]');
  if (teamvak) {
    (function () {
      var data = window.EIPI_TEAM;
      var afdelingen = (data && data.afdelingen) || [];
      var esc = function (s) {
        return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      };
      var foto = function (lid) {
        var bron = lid.foto || 'assets/img/teamfoto-placeholder.svg';
        return '<img class="p-team__foto" src="' + esc(bron) + '" alt="' + esc('Teamfoto van ' + (lid.naam || 'een collega')) + '" loading="lazy" decoding="async">';
      };
      if (!afdelingen.length) {
        teamvak.innerHTML = '<p class="p-team__leeg">Het team kon niet geladen worden. Bel ons even, dan vertellen we wie waarvoor aan de lijn komt.</p>';
        return;
      }
      teamvak.innerHTML = afdelingen.map(function (afd) {
        var leden = afd.leden || [];
        return '<section class="p-team__afdeling" id="team-' + esc(afd.id || '') + '">' +
          '<div class="p-team__kop">' +
            '<div class="p-team__titel">' +
              (afd.index ? '<span class="p-team__index">' + esc(afd.index) + '</span>' : '') +
              '<h3 class="p-team__naam">' + esc(afd.naam || '') + '</h3>' +
            '</div>' +
            (afd.tekst ? '<p class="p-team__tekst">' + esc(afd.tekst) + '</p>' : '') +
            '<span class="p-team__aantal"><b>' + leden.length + '</b><i>' +
              (leden.length === 1 ? 'persoon' : 'mensen') + '</i></span>' +
          '</div>' +
          '<div class="p-team__rij">' +
            leden.map(function (lid) {
              return '<figure class="p-team__lid">' + foto(lid) +
                '<figcaption class="p-team__bij"><b>' + esc(lid.naam || 'Voornaam') + '</b><i>' + esc(lid.rol || '') + '</i></figcaption>' +
              '</figure>';
            }).join('') +
          '</div>' +
        '</section>';
      }).join('');
    }());
  }

  /* Recente projecten op de homepage: de keuze staat in projecten.js onder
     _home. Zo kan de klant zelf bepalen hoeveel er staan en welke. */
  var homevak = document.querySelector('[data-home-projecten]');
  if (homevak) {
    (function () {
      var data = window.EIPI_PROJECTEN;
      if (!data || !data.projecten || !data.projecten.length) { return; }
      var alle = data.projecten;
      var instelling = data._home || {};
      var aantal = parseInt(instelling.aantal, 10);
      if (isNaN(aantal) || aantal < 0) { aantal = 5; }
      if (aantal === 0) { return; }
      var perId = {};
      alle.forEach(function (pr) { perId[pr.id] = pr; });

      var esc = function (s) {
        return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      };
      var volgorde = function (pr) {
        var beelden = (pr.beelden || []).filter(function (b) { return b && b.src; });
        if (!pr.kaartbeeld) { return beelden; }
        var voor = [], rest = [];
        beelden.forEach(function (b) { (b.src === pr.kaartbeeld ? voor : rest).push(b); });
        return voor.concat(rest);
      };
      var klein = function (src) {
        var naam = String(src).split('/').pop().replace(/\.[a-z]+$/i, '');
        return 'assets/img/klein/' + naam + '.jpg';
      };

      /* eerst de gekozen projecten, daarna aanvullen met de rest */
      var gekozen = [], gedaan = {};
      (instelling.projecten || []).forEach(function (id) {
        if (perId[id] && !gedaan[id]) { gekozen.push(perId[id]); gedaan[id] = true; }
      });
      alle.forEach(function (pr) {
        if (gekozen.length < aantal && !gedaan[pr.id]) { gekozen.push(pr); gedaan[pr.id] = true; }
      });
      gekozen = gekozen.slice(0, aantal);

      homevak.innerHTML = gekozen.map(function (pr) {
        var beeld = volgorde(pr)[0];
        return '<article class="p-werkkaart">' +
          '<div class="p-werkkaart__kop">' +
            '<span class="p-werkkaart__plaats">' + esc(pr.plaats || '') + '</span>' +
            '<span class="p-werkkaart__type">' + esc(pr.type || '') + '</span>' +
            (pr.voorbeeld ? '<span class="p-werkkaart__monster">Voorbeeld</span>' : '') +
          '</div>' +
          (beeld ? '<div class="p-werkkaart__beeld"><img src="' + esc(klein(beeld.src)) + '" data-groot="' + esc(beeld.src) + '" alt="' + esc(beeld.alt) + '" decoding="async"><span class="p-stock p-corner">Tijdelijke foto</span></div>' : '') +
          '<h3 class="p-werkkaart__t">' + esc(pr.titel) + '</h3>' +
          '<p class="p-werkkaart__l">' + esc(pr.samenvatting || '') + '</p>' +
          '<span class="p-werkkaart__voet"><a class="p-arrowlink" href="projecten.html#project-' + esc(pr.id) + '">Bekijk project ' + PIJL_TEKEN + '</a></span>' +
          '<a class="p-werkkaart__tik" href="projecten.html#project-' + esc(pr.id) + '" aria-label="Bekijk project: ' + esc(pr.titel) + '"></a>' +
        '</article>';
      }).join('');

      Array.prototype.forEach.call(homevak.querySelectorAll('img[data-groot]'), function (img) {
        img.addEventListener('error', function () { img.src = img.getAttribute('data-groot'); }, { once: true });
      });
    }());
  }

  /* Vacatures: de rij klapt soepel open en dicht in plaats van direct.
     Zonder javascript doet het details-element het gewoon zelf. */
  var jobs = document.querySelectorAll('.p-job, .p-acc__item');
  if (jobs.length && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    Array.prototype.forEach.call(jobs, function (rij) {
      var kop = rij.querySelector('.p-job__sum, .p-acc__sum');
      var vak = rij.querySelector('.p-job__body, .p-acc__body');
      if (!kop || !vak) { return; }
      var bezig = false;
      kop.addEventListener('click', function (e) {
        e.preventDefault();
        if (bezig) { return; }
        bezig = true;
        var open = rij.hasAttribute('open');
        var hoogte = vak.scrollHeight;
        vak.classList.add('is-anim');

        var klaar = function () {
          vak.style.height = '';
          vak.style.opacity = '';
          vak.classList.remove('is-anim');
          bezig = false;
        };

        if (!open) {
          rij.setAttribute('open', '');
          vak.style.height = '0px';
          vak.style.opacity = '0';
          window.requestAnimationFrame(function () {
            vak.style.height = hoogte + 'px';
            vak.style.opacity = '1';
            window.setTimeout(klaar, 360);
          });
        } else {
          vak.style.height = hoogte + 'px';
          window.requestAnimationFrame(function () {
            vak.style.height = '0px';
            vak.style.opacity = '0';
            window.setTimeout(function () {
              rij.removeAttribute('open');
              klaar();
            }, 360);
          });
        }
      });
    });
  }

  /* Paginawissel: bij een klik op een link naar een andere pagina schuift het
     doek dicht, daarna gaat de browser verder. Op de nieuwe pagina schuift het
     doek door. Zonder dit script werkt de site gewoon normaal. */
  var doek = document.getElementById('p-wipe');
  var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var weggaat = false;
  /* terugknop uit de geschiedenis: nooit bedekt achterblijven */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && doek) {
      doek.classList.remove('is-leaving');
      document.documentElement.className = document.documentElement.className.replace(/\bwipe(-out)?\b/g, '');
    }
  });
  if (doek && !rustig) {
    document.addEventListener('click', function (e) {
      if (weggaat) { return; }
      if (e.defaultPrevented || e.button !== 0) { return; }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
      var link = e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) { return; }
      if (link.target && link.target !== '_self') { return; }
      if (link.hasAttribute('download')) { return; }
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) === '#') { return; }
      if (/^(mailto:|tel:|https?:)/i.test(href)) { return; }
      if (!/\.html($|[?#])/.test(href)) { return; }
      e.preventDefault();
      weggaat = true;
      doek.classList.add('is-leaving');
      try { sessionStorage.setItem('eipi-wipe', '1'); } catch (err) {}
      window.setTimeout(function () { window.location.href = link.href; }, 490);
    });

    /* het doek dat al dicht staat, doorschuiven naar beneden */
    if (document.documentElement.className.indexOf('wipe') !== -1) {
      window.requestAnimationFrame(function () {
        var d = document.documentElement;
        d.className = d.className.replace(/\bwipe\b/g, 'wipe-out');
        window.setTimeout(function () {
          d.className = d.className.replace(/\bwipe(-out)?\b/g, '');
          doek.classList.add('is-done');
        }, 900);
      });
    }
  } else if (doek) {
    document.documentElement.className = document.documentElement.className.replace(/\bwipe(-out)?\b/g, '');
  }
})();
