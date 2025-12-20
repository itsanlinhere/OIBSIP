document.addEventListener('DOMContentLoaded', function(){
  const track = document.querySelector('.swipe-track');
  const prev = document.querySelectorAll('.swipe-arrow')[0];
  const next = document.querySelectorAll('.swipe-arrow')[1];
  if(!track || !prev || !next) return;

  let index = 0;
  const items = Array.from(track.children);
  const itemWidth = items[0] ? items[0].getBoundingClientRect().width + parseInt(getComputedStyle(items[0]).marginRight || 12) : 260;

  function update(){
    const x = -index * itemWidth;
    track.style.transform = `translateX(${x}px)`;
  }

  prev.addEventListener('click', ()=>{
    index = Math.max(0, index-1);
    update();
  });
  next.addEventListener('click', ()=>{
    index = Math.min(items.length-1, index+1);
    update();
  });

  // keyboard support
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prev.click();
    if(e.key === 'ArrowRight') next.click();
  });
});
