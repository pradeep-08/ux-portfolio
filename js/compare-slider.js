/**
 * Pradeep UX Portfolio - Before / after compare slider (.cf-compare)
 * - Drag anywhere on the panel (mouse, pen or touch) to move the divider
 * - The handle is a keyboard slider: arrows, Page Up/Down, Home/End
 * - Sweeps once when it first scrolls into view to show it can be dragged
 */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.cf-compare').forEach(compare => {
    const handle = compare.querySelector('.cf-compare__handle');
    let pos = 50;
    let touched = false;

    function set(value) {
      pos = Math.min(100, Math.max(0, value));
      compare.style.setProperty('--pos', pos + '%');
      if (handle) {
        const v = Math.round(pos);
        handle.setAttribute('aria-valuenow', String(v));
        handle.setAttribute('aria-valuetext', v + '% before');
      }
    }

    function fromPointer(e) {
      const r = compare.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }

    compare.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      touched = true;
      compare.setPointerCapture(e.pointerId);
      compare.classList.add('is-dragging');
      fromPointer(e);
    });
    compare.addEventListener('pointermove', e => {
      if (compare.classList.contains('is-dragging')) fromPointer(e);
    });
    const stop = () => compare.classList.remove('is-dragging');
    compare.addEventListener('pointerup', stop);
    compare.addEventListener('pointercancel', stop);

    if (handle) {
      handle.addEventListener('keydown', e => {
        const steps = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 };
        if (e.key in steps) set(pos + steps[e.key]);
        else if (e.key === 'Home') set(0);
        else if (e.key === 'End') set(100);
        else return;
        touched = true;
        e.preventDefault();
      });
    }

    set(50);

    // One gentle sweep (50 -> 68 -> 32 -> 50) the first time it's visible
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const keys = [50, 68, 32, 50];
      const seg = 600;
      const start = performance.now() + 300;
      const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      (function frame(now) {
        if (touched) return;
        const t = Math.max(0, now - start);
        const i = Math.min(keys.length - 2, Math.floor(t / seg));
        const p = Math.min(1, (t - i * seg) / seg);
        set(keys[i] + (keys[i + 1] - keys[i]) * ease(p));
        if (t < seg * (keys.length - 1)) requestAnimationFrame(frame);
      })(performance.now());
    }, { threshold: 0.6 });
    io.observe(compare);
  });
})();
