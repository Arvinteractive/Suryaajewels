import './editorialCarousel.css'

  (() => {
    'use strict';
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    let instanceId = 0;
    const defaultLabels = {
      instructions: 'Drag horizontally to explore. Use Left and Right arrow keys, Home, or End to choose a slide.',
      viewport: 'Workshop photographs', choose: 'Choose a photograph',
      previous: 'Previous photograph', next: 'Next photograph',
      play: 'Play autoplay', pause: 'Pause autoplay', playShort: 'Play', pauseShort: 'Pause',
      atYourPace: 'At your own pace', interacting: 'Paused while you interact',
      reduced: 'Reduced motion', unavailable: 'Autoplay unavailable with reduced motion',
      interval: seconds => `A new view every ${seconds}s`,
      position: (index, total) => `Photograph ${index} of ${total}`,
      slide: (index, total) => `Go to photograph ${index} of ${total}`,
      retry: 'Try again', loadingTitle: 'A little anticipation.', loadingBody: 'The photographs are on their way.',
      emptyTitle: 'A fresh perspective awaits.', emptyBody: 'There are no photographs to explore just yet.',
      errorTitle: 'Let’s try another angle.', errorBody: 'The photographs couldn’t be loaded. Please try again.'
    };
    const arrowIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
    const playIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 8 5-8 5Z" fill="currentColor"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" stroke-width="2"/></svg>';
    class CCarousel extends HTMLElement {
      static get observedAttributes() { return ['autoplay', 'interval', 'dir', 'state']; }
      constructor() {
        super();
        this._uid = 'carousel-' + (++instanceId);
        this._index = this._targetIndex = 0;
        this._position = this._velocity = this._step = this._max = 0;
        this._frame = this._resizeFrame = this._timer = 0;
        this._connected = false;
        this._pointer = null;
        this._pauses = new Set();
        this._slideData = null;
        this._labels = { ...defaultLabels };
        this._inView = true;
      }
      connectedCallback() {
        if (this._connected) return;
        this._connected = true;
        this._controller = new AbortController();
        this._pauses.clear();
        this._build();
        // Preserve properties assigned before customElements.define().
        if (Object.prototype.hasOwnProperty.call(this, 'slides')) {
          const slides = this.slides; delete this.slides; this.slides = slides;
        } else if (this._slideData) this._renderSlides();
        this.setAttribute('role', 'region');
        this.setAttribute('aria-roledescription', 'carousel');
        if (!this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) this.setAttribute('aria-label', 'Study carousel');
        this._instructions.id = this._uid + '-instructions';
        this._instructions.textContent = this._labels.instructions;
        this._viewport.setAttribute('aria-describedby', this._instructions.id);
        this._viewport.id = this._uid + '-viewport';
        this._track.setAttribute('aria-live', 'off');
        this.setAttribute('data-enhanced', '');
        this._collect();
        this._applyLabels();
        this._listen(this._viewport, 'pointerdown', event => this._pointerDown(event));
        this._listen(window, 'pointermove', event => this._pointerMove(event), { passive: false });
        this._listen(window, 'pointerup', event => this._pointerEnd(event, false));
        this._listen(window, 'pointercancel', event => this._pointerEnd(event, true));
        this._listen(this._viewport, 'lostpointercapture', event => {
          // Touch starts with implicit capture on the article. Moving capture to
          // the viewport bubbles a loss from that article; the drag is still valid.
          if (event.target === this._viewport && !this._viewport.hasPointerCapture(event.pointerId)) this._pointerEnd(event, true);
        });
        this._listen(this._viewport, 'dragstart', event => event.preventDefault());
        this._listen(this._viewport, 'click', event => {
          if (performance.now() < (this._suppressClickUntil || 0)) { event.preventDefault(); event.stopPropagation(); }
        }, { capture: true });
        this._listen(this, 'keydown', event => this._keyDown(event));
        this._listen(this._controls, 'click', event => this._controlClick(event));
        this._listen(this._retry, 'click', () => this.dispatchEvent(new CustomEvent('carousel-retry', { bubbles: true, composed: true })));
        this._listen(this, 'pointerenter', event => { if (event.pointerType !== 'touch') this._setPause('hover', true); });
        this._listen(this, 'pointerleave', () => this._setPause('hover', false));
        this._listen(this, 'focusin', event => {
          this._setPause('focus', true);
          const slide = event.target.closest('[data-slide]');
          if (slide && this._items.includes(slide) && this._items.indexOf(slide) !== this._targetIndex) this.goTo(this._items.indexOf(slide), { source: 'focus' });
        });
        this._listen(this, 'focusout', event => {
          if (!this.contains(event.relatedTarget)) { this._setPause('focus', false); this._markSlides(); }
        });
        this._listen(document, 'visibilitychange', () => {
          this._setPause('hidden', document.hidden);
          if (document.hidden && this._frame) this._finish(this._source);
        });
        this._listen(window, 'blur', () => { this._cancelPointer(); this._setPause('window', true); });
        this._listen(window, 'focus', () => this._setPause('window', false));
        this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this._motionListener = event => this._applyMotion(event.matches);
        if (this._motionQuery.addEventListener) this._motionQuery.addEventListener('change', this._motionListener);
        else this._motionQuery.addListener(this._motionListener);
        this._autoplayRequested = this.hasAttribute('autoplay') && this.getAttribute('autoplay') !== 'false';
        this._applyMotion(this._motionQuery.matches);
        this._setPause('hidden', document.hidden);
        this._setPause('focus', this.contains(document.activeElement));
        if (this.matches(':hover')) this._setPause('hover', true);
        if ('ResizeObserver' in window) {
          this._resizeObserver = new ResizeObserver(() => this._queueMeasure());
          this._resizeObserver.observe(this._viewport);
          if (this._items[0]) this._resizeObserver.observe(this._items[0]);
        } else this._listen(window, 'resize', () => this._queueMeasure());
        if ('IntersectionObserver' in window) {
          this._inView = false;
          this._setPause('offscreen', true);
          this._intersectionObserver = new IntersectionObserver(entries => {
            const entry = entries[entries.length - 1];
            this._inView = entry.isIntersecting && entry.intersectionRatio > 0;
            this._setPause('offscreen', !this._inView);
            if (!this._inView && this._frame) this._finish(this._source);
          }, { threshold: [0, .01] });
          this._intersectionObserver.observe(this);
        } else {
          const checkVisibility = () => {
            const rect = this.getBoundingClientRect();
            this._inView = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
            this._setPause('offscreen', !this._inView);
          };
          this._listen(window, 'scroll', checkVisibility, { passive: true });
          this._listen(window, 'resize', checkVisibility, { passive: true });
          checkVisibility();
        }
        // Direction may be inherited from any ancestor.
        if ('MutationObserver' in window) {
          this._directionObserver = new MutationObserver(() => { if ((getComputedStyle(this).direction === 'rtl') !== this._rtl) this._queueMeasure(); });
          for (let ancestor = this.parentElement; ancestor; ancestor = ancestor.parentElement) this._directionObserver.observe(ancestor, { attributes: true, attributeFilter: ['dir', 'class', 'style'] });
          this._contentObserver = new MutationObserver(() => {
            this._cancelPointer(); this._stopSpring(); this._collect(); this._measure();
          });
          this._contentObserver.observe(this._track, { childList: true });
        }
        this._measure();
        if (document.fonts) document.fonts.ready.then(() => { if (this._connected) this._queueMeasure(); });
      }
      disconnectedCallback() {
        this._connected = false;
        this._cancelPointer(false);
        this._stopSpring();
        clearTimeout(this._timer); this._timer = 0;
        cancelAnimationFrame(this._resizeFrame); this._resizeFrame = 0;
        this._controller?.abort();
        this._resizeObserver?.disconnect(); this._intersectionObserver?.disconnect();
        this._directionObserver?.disconnect(); this._contentObserver?.disconnect();
        this._resizeObserver = this._intersectionObserver = this._directionObserver = this._contentObserver = null;
        if (this._motionQuery && this._motionListener) {
          if (this._motionQuery.removeEventListener) this._motionQuery.removeEventListener('change', this._motionListener);
          else this._motionQuery.removeListener(this._motionListener);
        }
        this._pauses.clear();
        this._viewport?.removeAttribute('aria-describedby');
        this.removeAttribute('data-enhanced');
        if (this._track) this._track.style.transform = '';
        for (const slide of this._items || []) { slide.inert = false; slide.removeAttribute('aria-hidden'); }
      }
      attributeChangedCallback(name) {
        if (!this._connected) return;
        if (name === 'dir') this._queueMeasure();
        else if (name === 'state') { this._cancelPointer(); this._stopSpring(); this._updateState(); this._queueMeasure(); }
        else {
          this._autoplayRequested = this.hasAttribute('autoplay') && this.getAttribute('autoplay') !== 'false';
          if (this._reduced && this._autoplayRequested) { this.pause(); return; }
          this._scheduleAutoplay();
        }
      }
      get currentIndex() { return this._index; }
      get labels() { return { ...this._labels }; }
      set labels(value) {
        this._labels = { ...defaultLabels, ...value };
        if (this._connected) { this._live.textContent = ''; this._collect(); this._applyLabels(); this._queueMeasure(); }
      }
      _applyLabels() {
        this._instructions.textContent = this._labels.instructions;
        this._viewport.setAttribute('aria-label', this._labels.viewport);
        this._dots.setAttribute('aria-label', this._labels.choose);
        this._prev.setAttribute('aria-label', this._labels.previous);
        this._next.setAttribute('aria-label', this._labels.next);
        this._retry.textContent = this._labels.retry;
        this._updateControls();
      }
      get slides() {
        if (this._slideData) return this._slideData.map(slide => ({ ...slide }));
        return Array.from(this.querySelectorAll('[data-slide]')).map(slide => ({
          type: slide.dataset.type || 'organic', category: slide.querySelector('.study-category')?.textContent || '',
          label: slide.querySelector('.study-label')?.textContent || '', heading: slide.querySelector('h2,h3,[data-slide-title]')?.textContent || '', caption: slide.querySelector('.slide-caption')?.textContent || '', image: slide.querySelector('img')?.getAttribute('src') || '', alt: slide.querySelector('img')?.getAttribute('alt') || ''
        }));
      }
      set slides(value) {
        if (!Array.isArray(value)) throw new TypeError('c-carousel.slides must be an array.');
        this._slideData = value.map((slide, index) => {
          if (!slide || typeof slide !== 'object') throw new TypeError('Each slide must be an object.');
          return { type: ['organic', 'structure', 'balance', 'connection'].includes(slide.type) ? slide.type : 'organic', category: String(slide.category ?? slide.type ?? 'Study'), label: String(slide.label ?? 'STUDY ' + String(index + 1).padStart(3, '0')), heading: String(slide.heading ?? ''), caption: String(slide.caption ?? ''), image: String(slide.image ?? ''), alt: String(slide.alt ?? '') };
        });
        if (this._connected) { this._cancelPointer(); this._stopSpring(); this._renderSlides(); this._collect(); this._measure(); }
      }
      play() { if (!this._reduced) this.setAttribute('autoplay', ''); }
      pause() { this._autoplayRequested = false; this.removeAttribute('autoplay'); if (this._connected) this._scheduleAutoplay(); }
      goTo(index, options = {}) {
        if (!Number.isFinite(index)) throw new TypeError('goTo(index) requires a finite number.');
        if (!this._connected || !this._items.length || !['ready', 'single'].includes(this.dataset.state)) return;
        this._cancelPointer(false);
        this._stopSpring();
        clearTimeout(this._timer); this._timer = 0;
        this._targetIndex = clamp(Math.round(index), 0, this._items.length - 1);
        this._source = options.source || 'api';
        this._target = this._targetIndex * this._step;
        this._updateControls();
        if (this._reduced || options.immediate || !this._step || Math.abs(this._target - this._position) < .35) { this._finish(this._source); return; }
        this._velocity = clamp(options.velocity || 0, -4000, 4000);
        this._lastTime = 0;
        this._elapsed = 0;
        this.setAttribute('data-animating', '');
        this._frame = requestAnimationFrame(time => this._spring(time));
      }
      _listen(target, name, callback, options = {}) { target.addEventListener(name, callback, { ...options, signal: this._controller.signal }); }
      _build() {
        this._viewport = this.querySelector(':scope > .carousel-viewport');
        if (!this._viewport) {
          this._viewport = document.createElement('div'); this._viewport.className = 'carousel-viewport';
          this._viewport.tabIndex = 0; this._viewport.setAttribute('role', 'group'); this._viewport.setAttribute('aria-label', 'Slides');
          const track = document.createElement('div'); track.className = 'carousel-track';
          for (const slide of Array.from(this.children).filter(child => child.matches('[data-slide]'))) track.append(slide);
          this._viewport.append(track); this.append(this._viewport);
        }
        this._track = this._viewport.querySelector('.carousel-track');
        if (!this._track) { this._track = document.createElement('div'); this._track.className = 'carousel-track'; this._viewport.append(this._track); }
        this._instructions = this.querySelector(':scope > [data-instructions]');
        if (!this._instructions) { this._instructions = document.createElement('p'); this._instructions.className = 'sr-only'; this._instructions.dataset.instructions = ''; this.prepend(this._instructions); }
        this._controls = this.querySelector(':scope > .carousel-controls');
        if (!this._controls) {
          this._controls = document.createElement('div'); this._controls.className = 'carousel-controls';
          this._controls.innerHTML = '<div class="position-group"><div class="slide-status" aria-hidden="true"><span data-current>01</span><span class="status-divider">/</span><span class="status-total" data-total>04</span></div><div class="carousel-dots" role="group" aria-label="Choose a slide"></div></div><div class="movement-group"><span class="play-caption" data-play-caption>At your own pace</span><button type="button" class="autoplay-button" data-action="play" aria-label="Play autoplay" aria-pressed="false"></button><button type="button" class="arrow" data-action="prev" aria-label="Previous slide">' + arrowIcon.replace('M4 12h15m-6-6 6 6-6 6', 'M20 12H5m6-6-6 6 6 6') + '</button><button type="button" class="arrow" data-action="next" aria-label="Next slide">' + arrowIcon + '</button></div>';
          this.append(this._controls);
        }
        this._dots = this._controls.querySelector('.carousel-dots');
        this._prev = this._controls.querySelector('[data-action="prev"]'); this._next = this._controls.querySelector('[data-action="next"]');
        this._play = this._controls.querySelector('[data-action="play"]');
        this._caption = this._controls.querySelector('[data-play-caption]');
        this._statusCurrent = this._controls.querySelector('[data-current]'); this._statusTotal = this._controls.querySelector('[data-total]');
        this._live = this.querySelector(':scope > [data-live]');
        if (!this._live) { this._live = document.createElement('p'); this._live.className = 'sr-only'; this._live.dataset.live = ''; this._live.setAttribute('role', 'status'); this._live.setAttribute('aria-live', 'polite'); this._live.setAttribute('aria-atomic', 'true'); this.append(this._live); }
        this._statePanel = this.querySelector(':scope > .carousel-state');
        if (!this._statePanel) { this._statePanel = document.createElement('div'); this._statePanel.className = 'carousel-state'; this._statePanel.hidden = true; this._statePanel.innerHTML = '<span class="state-mark" aria-hidden="true">S.</span><h2></h2><p></p><button type="button" class="state-retry" hidden>Try again</button>'; this.append(this._statePanel); }
        this._retry = this._statePanel.querySelector('button');
        for (const button of [this._prev, this._next, this._play]) button.setAttribute('aria-controls', this._uid + '-viewport');
      }
      _renderSlides() {
        this._contentObserver?.disconnect(); this._track.replaceChildren();
        this._slideData.forEach((data, index) => {
          const slide = document.createElement('article'); slide.className = 'slide'; slide.dataset.slide = '';
          const copy = document.createElement('div'); copy.className = 'slide-copy';
          const label = document.createElement('p'); label.className = 'study-label'; label.textContent = data.label;
          const heading = document.createElement('h3'); heading.textContent = data.heading;
          const caption = document.createElement('p'); caption.className = 'slide-caption'; caption.textContent = data.caption;
          copy.append(label, heading, caption); slide.append(copy);
          if (data.image) {
            const photo = document.createElement('figure'); photo.className = 'workshop-photo';
            const image = document.createElement('img'); image.src = data.image; image.alt = data.alt;
            image.loading = index === 0 ? 'eager' : 'lazy'; image.decoding = 'async'; image.draggable = false;
            image.width = 1792; image.height = 2400; photo.append(image); slide.append(photo);
          }
          this._track.append(slide);
        });
        this._contentObserver?.observe(this._track, { childList: true });
      }
      _collect() {
        this._items = Array.from(this._track.children).filter(child => child.matches('[data-slide]'));
        if (this._resizeObserver) {
          this._resizeObserver.disconnect(); this._resizeObserver.observe(this._viewport);
          if (this._items[0]) this._resizeObserver.observe(this._items[0]);
        }
        this._index = clamp(this._index, 0, Math.max(0, this._items.length - 1));
        this._targetIndex = clamp(this._targetIndex, 0, Math.max(0, this._items.length - 1));
        this._dots.replaceChildren();
        this._items.forEach((slide, index) => {
          slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide');
          const heading = slide.querySelector('h2,h3,[data-slide-title]')?.textContent || 'Study';
          slide.setAttribute('aria-label', this._labels.position(index + 1, this._items.length) + ': ' + heading);
          const dot = document.createElement('button'); dot.type = 'button'; dot.className = 'dot'; dot.dataset.index = index;
          dot.setAttribute('aria-label', this._labels.slide(index + 1, this._items.length) + ': ' + heading); dot.setAttribute('aria-controls', this._viewport.id); this._dots.append(dot);
        });
        this._updateState(); this._markSlides();
      }
      _updateState() {
        const explicit = this.getAttribute('state');
        const state = ['loading', 'empty', 'error'].includes(explicit) ? explicit : !this._items.length ? 'empty' : this._items.length === 1 ? 'single' : 'ready';
        this.dataset.state = state;
        const unavailable = !['ready', 'single'].includes(state);
        this._viewport.hidden = unavailable; this._controls.hidden = unavailable; this._statePanel.hidden = !unavailable;
        this.setAttribute('aria-busy', String(state === 'loading'));
        if (unavailable) {
          const copy = { loading: [this._labels.loadingTitle, this._labels.loadingBody], empty: [this._labels.emptyTitle, this._labels.emptyBody], error: [this._labels.errorTitle, this._labels.errorBody] }[state];
          this._statePanel.querySelector('h2').textContent = copy[0]; this._statePanel.querySelector('p').textContent = copy[1];
          this._statePanel.setAttribute('role', 'status'); this._retry.hidden = state !== 'error';
          for (const slide of this._items) { slide.inert = false; slide.removeAttribute('aria-hidden'); }
        }
        for (const element of [this._dots, this._prev, this._next, this._play, this._caption]) element.hidden = state === 'single';
        this._updateControls(); this._scheduleAutoplay();
      }
      _queueMeasure() {
        if (!this._connected || this._resizeFrame) return;
        this._resizeFrame = requestAnimationFrame(() => { this._resizeFrame = 0; if (this._connected) this._measure(); });
      }
      _measure() {
        if (!this._connected) return;
        this._cancelPointer(false); this._stopSpring();
        this._rtl = getComputedStyle(this).direction === 'rtl';
        const styles = getComputedStyle(this._track);
        this._width = this._viewport.clientWidth;
        this._step = this._items.length ? this._items[0].getBoundingClientRect().width + (parseFloat(styles.columnGap) || 0) : 0;
        this._max = Math.max(0, (this._items.length - 1) * this._step);
        const tokens = getComputedStyle(this);
        this._stiffness = clamp(parseFloat(tokens.getPropertyValue('--carousel-spring-stiffness')) || 190, 80, 500);
        this._damping = clamp(parseFloat(tokens.getPropertyValue('--carousel-spring-damping')) || 26, 15, 80);
        this._viewport.scrollLeft = 0;
        this._position = this._targetIndex * this._step;
        this._draw(); this._commit('resize'); this._scheduleAutoplay();
      }
      _draw() { this._track.style.transform = 'translate3d(' + ((this._rtl ? 1 : -1) * this._position).toFixed(3) + 'px,0,0)'; }
      _stopSpring() { cancelAnimationFrame(this._frame); this._frame = 0; this.removeAttribute('data-animating'); }
      _spring(time) {
        this._frame = 0;
        if (!this._connected) return;
        const dt = this._lastTime ? Math.min((time - this._lastTime) / 1000, .034) : 1 / 60;
        this._lastTime = time; this._elapsed += dt;
        const steps = Math.max(1, Math.ceil(dt / (1 / 120))); const delta = dt / steps;
        for (let i = 0; i < steps; i++) {
          const acceleration = -this._stiffness * (this._position - this._target) - this._damping * this._velocity;
          this._velocity += acceleration * delta; this._position += this._velocity * delta;
        }
        this._draw();
        if ((Math.abs(this._target - this._position) < .35 && Math.abs(this._velocity) < 3) || this._elapsed > 5) this._finish(this._source);
        else this._frame = requestAnimationFrame(next => this._spring(next));
      }
      _finish(source) { this._stopSpring(); this._position = this._targetIndex * this._step; this._velocity = 0; this._draw(); this._commit(source); this._scheduleAutoplay(); }
      _commit(source) {
        const previousIndex = this._index; this._index = this._targetIndex; this._updateControls(); this._markSlides();
        if (source && !['autoplay', 'resize', 'initial'].includes(source)) {
          const heading = this._items[this._index]?.querySelector('h2,h3,[data-slide-title]')?.textContent || 'Study';
          this._live.textContent = this._labels.position(this._index + 1, this._items.length) + '. ' + heading;
        }
        if (previousIndex !== this._index) this.dispatchEvent(new CustomEvent('slide-change', { detail: { index: this._index, previousIndex, total: this._items.length, source: source || 'api' }, bubbles: true, composed: true }));
      }
      _markSlides() {
        this._items.forEach((slide, index) => {
          const active = index === this._index; const focused = slide.contains(document.activeElement);
          slide.toggleAttribute('data-current-slide', active);
          slide.setAttribute('aria-current', String(active));
          // Never remove or move focus when the selected slide changes.
          slide.inert = !active && !focused;
          slide.setAttribute('aria-hidden', String(!active && !focused));
        });
      }
      _updateControls() {
        if (!this._controls) return;
        this._statusCurrent.textContent = String(this._items.length ? this._targetIndex + 1 : 0).padStart(2, '0');
        this._statusTotal.textContent = String(this._items.length).padStart(2, '0');
        Array.from(this._dots.children).forEach((dot, index) => dot.setAttribute('aria-current', String(index === this._targetIndex)));
        this._prev.setAttribute('aria-disabled', String(this._targetIndex === 0)); this._next.setAttribute('aria-disabled', String(this._targetIndex >= this._items.length - 1));
        this._play.setAttribute('aria-pressed', String(!!this._autoplayRequested)); this._play.setAttribute('aria-disabled', String(!!this._reduced));
        this._play.setAttribute('aria-label', this._reduced ? this._labels.unavailable : this._autoplayRequested ? this._labels.pause : this._labels.play);
        const mode = this._autoplayRequested ? this._labels.pauseShort : this._labels.playShort;
        if (this._play.dataset.mode !== mode) {
          this._play.dataset.mode = mode; this._play.innerHTML = this._autoplayRequested ? pauseIcon : playIcon;
          const text = document.createElement('span'); text.textContent = mode; this._play.append(text);
        }
        this._caption.textContent = this._reduced ? this._labels.reduced : !this._autoplayRequested ? this._labels.atYourPace : this._pauses.size ? this._labels.interacting : this._labels.interval(this._interval / 1000);
      }
      _controlClick(event) {
        const button = event.target.closest('button'); if (!button || !this._controls.contains(button) || button.getAttribute('aria-disabled') === 'true') return;
        if (button.dataset.index != null) this.goTo(Number(button.dataset.index), { source: 'dot' });
        else if (button.dataset.action === 'prev') this.goTo(this._targetIndex - 1, { source: 'button' });
        else if (button.dataset.action === 'next') this.goTo(this._targetIndex + 1, { source: 'button' });
        else if (button.dataset.action === 'play') this._autoplayRequested ? this.pause() : this.play();
      }
      _keyDown(event) {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
        if (!['ready', 'single'].includes(this.dataset.state)) return;
        let index;
        if (event.key === 'ArrowRight') index = this._targetIndex + (this._rtl ? -1 : 1);
        else if (event.key === 'ArrowLeft') index = this._targetIndex + (this._rtl ? 1 : -1);
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = this._items.length - 1;
        else return;
        event.preventDefault(); this.goTo(index, { source: 'keyboard' });
      }
      _pointerDown(event) {
        if (this._pointer && !event.isPrimary) { this._cancelPointer(); return; }
        if (event.isPrimary === false || event.button !== 0 || this.dataset.state !== 'ready' || event.target.closest('a,button,input,textarea,select,[contenteditable="true"]')) return;
        this._stopSpring(); clearTimeout(this._timer); this._timer = 0;
        this._pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, start: this._position, dragging: false, samples: [{ time: event.timeStamp, value: this._position }] };
        this._setPause('drag', true);
      }
      _pointerMove(event) {
        const pointer = this._pointer; if (!pointer || event.pointerId !== pointer.id) return;
        const dx = event.clientX - pointer.x; const dy = event.clientY - pointer.y;
        if (!pointer.dragging) {
          if (Math.abs(dy) > 7 && Math.abs(dy) > Math.abs(dx)) { this._cancelPointer(); return; }
          if (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy) * 1.12) return;
          pointer.dragging = true; this.setAttribute('data-dragging', '');
          try { this._viewport.setPointerCapture(pointer.id); } catch (_) { /* Pointer may already have been cancelled by the browser. */ }
        }
        if (event.cancelable) event.preventDefault();
        const events = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
        for (const sample of events.length ? events : [event]) {
          const raw = pointer.start - (sample.clientX - pointer.x) * (this._rtl ? -1 : 1);
          const limit = Math.min(80, this._width * .13);
          this._position = raw < 0 ? -limit * (1 - Math.exp(raw / limit)) : raw > this._max ? this._max + limit * (1 - Math.exp((this._max - raw) / limit)) : raw;
          pointer.samples.push({ time: sample.timeStamp, value: this._position });
          while (pointer.samples.length > 2 && sample.timeStamp - pointer.samples[0].time > 110) pointer.samples.shift();
        }
        this._draw();
      }
      _pointerEnd(event, cancelled) {
        const pointer = this._pointer; if (!pointer || event.pointerId !== pointer.id) return;
        const samples = pointer.samples;
        let velocity = 0;
        if (!cancelled && pointer.dragging && samples.length > 1 && event.timeStamp - samples[samples.length - 1].time < 100) {
          const first = samples[0], last = samples[samples.length - 1];
          velocity = clamp((last.value - first.value) / Math.max(1, last.time - first.time), -2.8, 2.8);
        }
        if (pointer.dragging) this._suppressClickUntil = performance.now() + 350;
        const projected = this._position + (this._reduced ? 0 : velocity * 240);
        const index = this._step ? Math.round(clamp(projected, 0, this._max) / this._step) : 0;
        this._releasePointer(); this.goTo(index, { source: cancelled ? 'cancel' : 'drag', velocity: velocity * 1000 });
      }
      _releasePointer() {
        const id = this._pointer?.id; this._pointer = null; this.removeAttribute('data-dragging');
        if (id != null) { try { if (this._viewport.hasPointerCapture(id)) this._viewport.releasePointerCapture(id); } catch (_) {} }
        this._setPause('drag', false);
      }
      _cancelPointer(settle = true) {
        if (!this._pointer) return;
        this._releasePointer();
        if (settle && this._connected) this.goTo(this._step ? Math.round(clamp(this._position, 0, this._max) / this._step) : 0, { source: 'cancel' });
      }
      _applyMotion(reduced) {
        this._reduced = !!reduced;
        if (this._reduced) { this.pause(); if (this._frame) this._finish(this._source); }
        this._scheduleAutoplay();
      }
      _setPause(reason, paused) { paused ? this._pauses.add(reason) : this._pauses.delete(reason); this._scheduleAutoplay(); }
      get _interval() { const value = Number(this.getAttribute('interval')); return Number.isFinite(value) && value > 0 ? Math.max(1000, value) : 5000; }
      _scheduleAutoplay() {
        clearTimeout(this._timer); this._timer = 0;
        if (!this._connected || !this._controls) return;
        this._updateControls();
        if (!this._autoplayRequested || this._reduced || this._pauses.size || this._frame || this._pointer || this.dataset.state !== 'ready' || this._items.length < 2) return;
        this._timer = setTimeout(() => { this._timer = 0; this.goTo((this._targetIndex + 1) % this._items.length, { source: 'autoplay' }); }, this._interval);
      }
    }
    if (!customElements.get('c-carousel')) customElements.define('c-carousel', CCarousel);
    window.CCarousel = CCarousel;
  })();
  
