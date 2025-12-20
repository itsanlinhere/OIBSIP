document.addEventListener('DOMContentLoaded', function(){
  // Initialize each carousel/swipe-card on the page separately.
  const cards = document.querySelectorAll('.swipe-card');
  if(!cards.length) return;

  cards.forEach((card, cardIndex) => {
    const track = card.querySelector('.swipe-track');
    const arrows = card.querySelectorAll('.swipe-arrow');
    if(!track || arrows.length < 2) return; // need prev & next
    const prev = arrows[0];
    const next = arrows[arrows.length-1];

    // announcer: find existing sr-only inside card or create one
    let announcer = card.querySelector('.sr-only[aria-live]');
    if(!announcer){
      announcer = document.createElement('div');
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      card.appendChild(announcer);
    }

    let index = 0;
    const items = Array.from(track.children).filter(n => n.nodeType === 1); // element children
    let itemWidth = items[0] ? items[0].getBoundingClientRect().width + parseInt(getComputedStyle(items[0]).marginRight || 12) : 260;

    function recalc(){
      itemWidth = items[0] ? items[0].getBoundingClientRect().width + parseInt(getComputedStyle(items[0]).marginRight || 12) : 260;
      snapTo(index, false);
    }

    window.addEventListener('resize', recalc);

    function setTransform(x){ track.style.transform = `translateX(${x}px)`; }

    function snapTo(i, announceNow = true){
      const clamped = Math.max(0, Math.min(items.length-1, i));
      track.style.transition = 'transform 300ms ease';
      const x = -clamped * itemWidth;
      setTransform(x);
      index = clamped;
      if(announceNow) announce();
    }

    function announce(){
      const title = items[index]?.querySelector('h3')?.textContent || `Item ${index+1}`;
      announcer.textContent = `${title} — ${index+1} of ${items.length}`;
    }

    // arrow handlers
    prev.addEventListener('click', ()=> snapTo(index-1));
    next.addEventListener('click', ()=> snapTo(index+1));

    // keyboard within card: left/right when focus inside
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
      if(e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    });

    // pointer/touch support
    let startX = 0, dragging = false;

    function pointerDown(e){
      dragging = true;
      track.style.transition = 'none';
      startX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    }
    function pointerMove(e){
      if(!dragging) return;
      const currentX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
      const delta = currentX - startX;
      const base = -index * itemWidth;
      setTransform(base + delta);
    }
    function pointerUp(e){
      if(!dragging) return;
      dragging = false;
      const endX = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX) ?? 0;
      const delta = endX - startX;
      const threshold = itemWidth * 0.18;
      if(delta > threshold) snapTo(index-1);
      else if(delta < -threshold) snapTo(index+1);
      else snapTo(index);
    }

    // attach listeners to the track (pointer) and card (touch fallbacks)
    track.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);

    track.addEventListener('touchstart', pointerDown, {passive:true});
    window.addEventListener('touchmove', pointerMove, {passive:true});
    window.addEventListener('touchend', pointerUp);

    // init
    track.style.willChange = 'transform';
    announce();
    snapTo(0, false);
  });
});
