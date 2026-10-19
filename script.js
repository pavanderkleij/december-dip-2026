/* DECEMBER-DIP - no build step, dependencies or remote requests. */
(() => {
  'use strict';

  const config = window.DECEMBER_DIP || {};
  const byId = (id) => document.getElementById(id);
  const intro = byId('intro');
  const invitation = byId('uitnodiging');
  const diver = byId('diver');
  const shadow = byId('diver-shadow');
  const splash = byId('splash');
  const standingArms = byId('arms-standing');
  const divingArms = byId('arms-diving');
  const wave = byId('wave-wipe');
  const diveButton = byId('dive-button');
  const motionButton = byId('motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let busy = false;
  let sequence = 0;
  let frame = 0;
  let activeAnimation = null;
  let pendingDive = null;

  const cleanString = (value) => typeof value === 'string' ? value.trim() : '';

  // Text is inserted with textContent, never interpreted as HTML.
  for (const element of document.querySelectorAll('[data-content]')) {
    const text = cleanString(config[element.dataset.content]);
    if (text) {
      element.textContent = text;
      element.classList.remove('unfilled');
    }
  }

  // De zwemlocatie is een klikbare kaartlink in plaats van een lange ruwe URL.
  const zwemplekUrl = cleanString(config.zwemplekUrl);
  if (zwemplekUrl) {
    try {
      const url = new URL(zwemplekUrl);
      if (url.protocol !== 'https:') throw new Error('Use HTTPS.');
      const link = byId('zwemplek-link');
      link.href = url.href;
      link.hidden = false;
      document.querySelector('[data-content="zwemplek"]').hidden = true;
    } catch (error) {
      console.warn('December-Dip: ongeldige kaartlink.', error);
    }
  }

  // Do not turn an empty or invalid URL into a pretend working button.
  const spreadsheetUrl = cleanString(config.spreadsheetUrl);
  if (spreadsheetUrl) {
    try {
      const url = new URL(spreadsheetUrl);
      if (url.protocol !== 'https:') throw new Error('Use a complete HTTPS URL.');
      const link = byId('spreadsheet-link');
      link.href = url.href;
      link.hidden = false;
      byId('spreadsheet-placeholder').hidden = true;
    } catch (error) {
      console.warn('December-Dip: de spreadsheetlink is ongeldig; de invulplek blijft staan.', error);
    }
  }

  // A photo is shown only after the configured local file has actually loaded.
  const photoPath = cleanString(config.killianFoto);
  if (photoPath) {
    const image = byId('killian-photo');
    const placeholder = byId('photo-placeholder');
    try {
      const url = new URL(photoPath, document.baseURI);
      const base = new URL('.', document.baseURI);
      const validExtension = /\.(jpe?g|png|webp|avif|gif)$/i.test(url.pathname);
      const isLocalFile = url.protocol === 'file:' && base.protocol === 'file:';
      const isSameSite = /^https?:$/.test(url.protocol) && url.origin === base.origin;
      if ((!isLocalFile && !isSameSite) || !url.pathname.startsWith(base.pathname) || !validExtension) {
        throw new Error('Use a local JPG, PNG, WebP, AVIF or GIF inside this folder.');
      }
      image.addEventListener('load', () => {
        image.style.display = '';
        placeholder.style.display = 'none';
        byId('feast-desc').textContent = 'Een rillende zwemmer met een gestreepte handdoek rechts, een tafel vol dips en stokbrood ervoor, en links een grote pan gl\u00fchwein. Achter de pan staat een tijdelijke voorbeeldafbeelding, later te vervangen door Killians foto.';
      }, { once: true });
      image.addEventListener('error', () => {
        image.style.display = 'none';
        placeholder.style.display = '';
        console.warn('December-Dip: de foto is niet gevonden; de lege fotoplek blijft zichtbaar.');
      }, { once: true });
      const allowedCrops = ['xMidYMid slice', 'xMidYMin slice', 'xMidYMax slice', 'xMidYMid meet'];
      image.setAttribute('preserveAspectRatio', allowedCrops.includes(config.killianFotoUitsnede) ? config.killianFotoUitsnede : 'xMidYMid slice');
      image.setAttribute('href', photoPath);
    } catch (error) {
      console.warn('December-Dip: controleer het lokale bestandspad voor de foto.', error);
    }
  }

  // Deterministic, lightweight edge decoration. No canvas or external images.
  const weather = byId('weather');
  for (let index = 0; index < 14; index += 1) {
    const isLeaf = index % 3 !== 0;
    const isLeft = index % 2 === 0;
    const piece = document.createElement('span');
    piece.className = `weather-piece ${isLeaf ? 'is-leaf' : 'is-snow'}`;
    const size = 2 * (isLeaf ? 16 + index % 4 : 18 + index % 5);
    // Ongeveer twee keer de straal: 32-44px, aan beide zijden goed zichtbaar.
    piece.style.setProperty('--x', isLeft ? `${-Math.round(size * 0.16)}px` : `calc(100% - ${Math.round(size * 0.84)}px)`);
    piece.style.setProperty('--size', `${size}px`);
    piece.style.setProperty('--duration', `${14 + index % 8}s`);
    piece.style.setProperty('--delay', `${-(index * 2.37)}s`);
    piece.style.setProperty('--sway', `${isLeft ? 3 : -3}px`);
    piece.style.setProperty('--opacity', `${isLeaf ? 0.4 : 0.46}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', isLeaf ? '#icon-leaf' : '#icon-snow');
    svg.appendChild(use);
    piece.appendChild(svg);
    weather.appendChild(piece);
  }

  function applyMotionPreference() {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.hidden = reducedMotion.matches;
    const label = paused ? 'Animaties afspelen' : 'Animaties pauzeren';
    motionButton.setAttribute('aria-label', label);
    motionButton.title = label;
    // User-triggered transitions also skip motion when paused or reduced.
    if ((paused || reducedMotion.matches) && busy) {
      cancelSequence();
      setPage('uitnodiging', true, true);
    }
  }

  motionButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (reducedMotion.matches) {
      // Respect the system preference; the control describes why it stays off.
      paused = true;
      motionButton.title = 'Animaties staan uit vanwege je systeeminstelling voor minder beweging.';
      return;
    }
    paused = !paused;
    applyMotionPreference();
  });
  const motionChange = () => {
    paused = reducedMotion.matches;
    applyMotionPreference();
  };
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', motionChange);
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(motionChange);
  }
  applyMotionPreference();

  function resetScene() {
    diver.setAttribute('transform', 'translate(315 250)');
    diver.setAttribute('opacity', '1');
    shadow.setAttribute('opacity', '.24');
    splash.setAttribute('opacity', '0');
    splash.setAttribute('transform', 'translate(140 295)');
    standingArms.style.display = '';
    divingArms.style.display = 'none';
    intro.classList.remove('is-diving');
    diveButton.removeAttribute('aria-disabled');
    diveButton.querySelector('span').textContent = 'Neem een duik';
    byId('tap-hint').textContent = 'Tik ergens om de uitnodiging te openen';
    byId('dive-status').textContent = '';
  }

  function cancelSequence() {
    sequence += 1;
    busy = false;
    cancelAnimationFrame(frame);
    if (pendingDive) {
      pendingDive(false);
      pendingDive = null;
    }
    if (activeAnimation) {
      activeAnimation.cancel();
      activeAnimation = null;
    }
    wave.style.display = 'none';
    resetScene();
  }

  function setPage(page, updateHistory = false, moveFocus = false) {
    const isInvitation = page === 'uitnodiging';
    intro.hidden = isInvitation;
    invitation.hidden = !isInvitation;
    document.body.dataset.page = isInvitation ? 'uitnodiging' : 'intro';
    document.title = isInvitation ? 'December-Dip \u00b7 Je bent uitgenodigd' : 'December-Dip \u00b7 Neem een duik';
    if (updateHistory) {
      const url = new URL(window.location.href);
      url.hash = isInvitation ? 'uitnodiging' : '';
      try {
        if (url.href !== window.location.href) window.history.pushState({ page }, '', url.href);
      } catch (_) {
        // Some file:// browser contexts restrict History. Navigation still works.
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (moveFocus) {
      const target = isInvitation ? byId('invite-title') : diveButton;
      target.focus({ preventScroll: true });
    }
  }

  function returnToShore(event) {
    event.preventDefault();
    cancelSequence();
    setPage('intro', true, true);
  }
  byId('back-link').addEventListener('click', returnToShore);
  byId('replay-link').addEventListener('click', returnToShore);

  // Ease along an actual arc, rotate the full figure and extend the arms.
  function animateDiver(token) {
    return new Promise((resolve) => {
      pendingDive = resolve;
      const started = performance.now();
      const duration = 1250;
      function tick(now) {
        if (token !== sequence) { resolve(false); return; }
        const t = Math.min((now - started) / duration, 1);
        if (t < 0.13) {
          const p = t / 0.13;
          diver.setAttribute('transform', `translate(${315 + p * 5} ${250 + p * 3}) rotate(${p * 8})`);
        } else {
          const p = Math.min((t - 0.13) / 0.75, 1);
          const q = 1 - p;
          const x = q * q * q * 320 + 3 * q * q * p * 279 + 3 * q * p * p * 188 + p * p * p * 155;
          const y = q * q * q * 253 + 3 * q * q * p * 99 + 3 * q * p * p * 139 + p * p * p * 405;
          const rotation = 8 - 174 * p;
          diver.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(2)})`);
          standingArms.style.display = 'none';
          divingArms.style.display = '';
          shadow.setAttribute('opacity', String(Math.max(0, .24 * (1 - p * 3))));
        }
        if (t > 0.63) {
          const p = Math.min((t - .63) / .37, 1);
          splash.setAttribute('opacity', String(Math.min(1, p * 6) * (1 - Math.max(0, (p - .65) / .35))));
          const scale = .45 + p * .8;
          splash.setAttribute('transform', `translate(140 295) scale(${scale.toFixed(3)})`);
        }
        if (t > 0.84) diver.setAttribute('opacity', '0');
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          pendingDive = null;
          resolve(true);
        }
      }
      frame = requestAnimationFrame(tick);
    });
  }

  async function animateWave(keyframes, duration) {
    if (typeof wave.animate !== 'function') return;
    const animation = wave.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(.45,0,.18,1)',
      fill: 'forwards'
    });
    activeAnimation = animation;
    try { await animation.finished; } catch (_) { /* Canceled navigation. */ }
    if (activeAnimation === animation) activeAnimation = null;
    // Filled animations are canceled after capturing their last frame.
    if (animation.playState === 'finished') {
      wave.style.transform = keyframes[keyframes.length - 1].transform;
      animation.cancel();
    }
  }

  async function takeDive(event) {
    if (event) event.preventDefault();
    if (busy || intro.hidden) return;
    if (paused || reducedMotion.matches) {
      setPage('uitnodiging', true, true);
      return;
    }
    busy = true;
    const token = ++sequence;
    intro.classList.add('is-diving');
    diveButton.setAttribute('aria-disabled', 'true');
    diveButton.querySelector('span').textContent = 'Daar gaan we...';
    byId('tap-hint').textContent = 'Van de eerste dip naar de tweede.';
    byId('dive-status').textContent = 'De zwemmer duikt. De uitnodiging wordt geopend.';
    try {
      await animateDiver(token);
      if (token !== sequence) return;
      wave.style.display = 'block';
      wave.style.transform = 'translateY(120vh)';
      await animateWave([{ transform: 'translateY(120vh)' }, { transform: 'translateY(-4vh)' }], 470);
      if (token !== sequence) return;
      setPage('uitnodiging', true, true);
      await animateWave([{ transform: 'translateY(-4vh)' }, { transform: 'translateY(-150vh)' }], 550);
      if (token !== sequence) return;
    } catch (error) {
      // A failed animation must never block the actual invitation.
      console.warn('December-Dip: animatie overgeslagen.', error);
      if (token === sequence) setPage('uitnodiging', true, true);
    } finally {
      if (token === sequence) {
        wave.style.display = 'none';
        busy = false;
        resetScene();
      }
    }
  }

  // The button is keyboard accessible; all other taps on the opening page
  // trigger the same action. Selecting text does not accidentally take a dive.
  intro.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.target.closest('a') && !event.target.closest('#dive-button')) return;
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;
    takeDive(event);
  });

  const readRoute = () => {
    cancelSequence();
    setPage(window.location.hash === '#uitnodiging' ? 'uitnodiging' : 'intro', false, true);
  };
  window.addEventListener('popstate', readRoute);
  window.addEventListener('hashchange', readRoute);
  setPage(window.location.hash === '#uitnodiging' ? 'uitnodiging' : 'intro');
})();
