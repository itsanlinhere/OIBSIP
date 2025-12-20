document.addEventListener('DOMContentLoaded', function(){
  const track = document.querySelector('.swipe-track');
  const prev = document.querySelectorAll('.swipe-arrow')[0];
  const next = document.querySelectorAll('.swipe-arrow')[1];
  const announcer = document.getElementById('announcer');
  if(!track || !prev || !next) return;

  let index = 0;
  const items = Array.from(track.children);
  let itemWidth = items[0] ? items[0].getBoundingClientRect().width + parseInt(getComputedStyle(items[0]).marginRight || 12) : 260;

  // ensure width recalculates on resize
  window.addEventListener('resize', ()=>{
    itemWidth = items[0] ? items[0].getBoundingClientRect().width + parseInt(getComputedStyle(items[0]).marginRight || 12) : 260;
    snapTo(index);
  });

  function setTransform(x){
    track.style.transform = `translateX(${x}px)`;
  }

  function snapTo(i){
    track.style.transition = 'transform 300ms ease';
    const x = -i * itemWidth;
    setTransform(x);
    index = Math.max(0, Math.min(items.length-1, i));
    announce();
  }

  function announce(){
    if(!announcer) return;
    const title = items[index].querySelector('h3')?.textContent || `Item ${index+1}`;
    announcer.textContent = `${title} — ${index+1} of ${items.length}`;
  }

  // arrow handlers
  prev.addEventListener('click', ()=>{ snapTo(index-1); });
  next.addEventListener('click', ()=>{ snapTo(index+1); });

  // keyboard support
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prev.click();
    if(e.key === 'ArrowRight') next.click();
  });

  // pointer (touch/mouse) swipe support with snapping
  let startX = 0, currentX = 0, dragging = false;

  function onPointerDown(e){
    dragging = true;
    track.style.transition = 'none';
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    track.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e){
    if(!dragging) return;
    currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const delta = currentX - startX;
    const base = -index * itemWidth;
    setTransform(base + delta);
  }

  function onPointerUp(e){
    if(!dragging) return;
    dragging = false;
    const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const delta = endX - startX;
    const threshold = itemWidth * 0.2;
    if(delta > threshold) snapTo(index-1);
    else if(delta < -threshold) snapTo(index+1);
    else snapTo(index);
  }

  // add listeners that work for pointer and touch
  track.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  // fallback for touch events on older browsers
  track.addEventListener('touchstart', onPointerDown, {passive:true});
  window.addEventListener('touchmove', onPointerMove, {passive:true});
  window.addEventListener('touchend', onPointerUp);

  // initialize
  track.style.willChange = 'transform';
  announce();
  snapTo(0);
});
