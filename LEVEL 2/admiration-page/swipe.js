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

    // arrow handlers — use native scroll to move
    function scrollToIndex(i){
      const clamped = Math.max(0, Math.min(items.length-1, i));
      const target = items[clamped];
      if(!target) return;
      // Use the element's offsetLeft so variable widths and gaps are handled correctly
      const left = target.offsetLeft;
      track.scrollTo({ left, behavior: 'smooth' });
      index = clamped;
      // move focus to the item for accessibility
      target.setAttribute('tabindex','0');
      target.focus({ preventScroll: true });
      announce();
    }
    prev.addEventListener('click', ()=> scrollToIndex(index-1));
    next.addEventListener('click', ()=> scrollToIndex(index+1));

    // keyboard within card: left/right when focus inside
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(index-1); }
      if(e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(index+1); }
    });

    // update index when user scrolls (native scrolling / touch)
    let scrollTimeout;
    function onScroll(){
      if(scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(()=>{
        // find nearest item by offsetLeft to account for variable widths
        const left = track.scrollLeft;
        let nearest = 0;
        let best = Infinity;
        items.forEach((it, idx)=>{
          const d = Math.abs(it.offsetLeft - left);
          if(d < best){ best = d; nearest = idx; }
        });
        index = nearest;
        announce();
      }, 80);
    }
    track.addEventListener('scroll', onScroll, {passive:true});

    // init
    track.style.willChange = 'scroll-position';
    // ensure images loaded then recalc and snap
    window.requestAnimationFrame(()=>{
      recalc();
      track.scrollLeft = 0;
      announce();
    });
  });
});
