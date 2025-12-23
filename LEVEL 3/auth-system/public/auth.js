document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('auth-form');
  const toggle = document.getElementById('toggle-pw');
  const pw = document.getElementById('password');
  const confirmField = document.getElementById('confirm-field');
  const nameField = document.getElementById('name-field');
  const submitBtn = document.getElementById('submit-btn');
  const switchToRegister = document.getElementById('switch-to-register');
  const formTitle = document.getElementById('form-title');
  const formSub = document.getElementById('form-sub');

  // auth-visual image for color sampling
  const visualImg = document.querySelector('.auth-visual img');

  let mode = 'signin'; // or 'register'

  if(toggle && pw){
    toggle.addEventListener('click', ()=>{
      if(pw.type === 'password'){ pw.type = 'text'; toggle.textContent = '🙈'; }
      else { pw.type = 'password'; toggle.textContent = '👁️'; }
    });
  }

  // Simple client-side auth demo using localStorage
  function usersKey(){ return 'auth_demo_users_v1'; }
  function loadUsers(){ try{ return JSON.parse(localStorage.getItem(usersKey())||'[]'); }catch(e){ return []; } }
  function saveUsers(list){ localStorage.setItem(usersKey(), JSON.stringify(list)); }

  function switchMode(next){
    mode = next;
    if(mode === 'register'){
      confirmField.classList.remove('hidden');
      nameField.classList.remove('hidden');
      submitBtn.textContent = 'Create account';
      formTitle.textContent = "Create your account.";
      formSub.textContent = "Join us — it's quick and easy.";
      document.getElementById('switch-hint').innerHTML = 'Already have an account? <a href="#" id="switch-to-signin">Sign in</a>';
      // re-bind the sign-in link
      document.getElementById('switch-to-signin').addEventListener('click', e=>{ e.preventDefault(); switchMode('signin'); });
    } else {
      confirmField.classList.add('hidden');
      nameField.classList.add('hidden');
      submitBtn.textContent = 'Sign in now';
      formTitle.textContent = "Let's sign you in.";
      formSub.textContent = "Hello, welcome back to your account";
      document.getElementById('switch-hint').innerHTML = 'Don\'t have an account? <a href="#" id="switch-to-register">Register</a>';
      document.getElementById('switch-to-register').addEventListener('click', e=>{ e.preventDefault(); switchMode('register'); });
    }
  }

  if(switchToRegister){
    switchToRegister.addEventListener('click', e=>{ e.preventDefault(); switchMode('register'); });
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
      if(!email || !password){ alert('Please enter both email and password'); return; }

      if(mode === 'register'){
        const name = (form.name && form.name.value)||'';
        const confirm = form['confirm-password'] && form['confirm-password'].value;
        if(!confirm || confirm !== password){ alert('Passwords do not match'); return; }
        const users = loadUsers();
        if(users.find(u=>u.email === email)){ alert('An account with that email already exists (demo). Try signing in.'); return; }
        users.push({ email, password, name, created: Date.now() });
        saveUsers(users);
        alert('Account created (demo). You can now sign in.');
        form.reset();
        switchMode('signin');
        return;
      }

      // signin
      const users = loadUsers();
      const user = users.find(u=>u.email === email && u.password === password);
      if(!user){ alert('No matching account found (demo). Please register first.'); return; }
      alert('Signed in (demo): ' + email);
      form.reset();
    });
  }

  const googleBtn = document.getElementById('google-signin');
  if(googleBtn){
    googleBtn.addEventListener('click', ()=>{
      alert('Google Sign-in (demo)');
    });
  }

  // Color sampling from the illustration image. This will attempt to read pixels from a same-origin image.
  function setThemeFromRgb(r,g,b){
    const css = document.documentElement.style;
    const primary = `rgb(${r},${g},${b})`;
    // create a lighter/darker variant for gradient
    const lighten = (v,amt)=> Math.min(255, Math.round(v + amt));
    const darken = (v,amt)=> Math.max(0, Math.round(v - amt));
    const r2 = lighten(r,36), g2 = lighten(g,36), b2 = lighten(b,36);
    const r3 = darken(r,50), g3 = darken(g,50), b3 = darken(b,50);
    css.setProperty('--bg-start', `rgb(${r2},${g2},${b2})`);
    css.setProperty('--bg-end', `rgb(${r},${g},${b})`);
    css.setProperty('--primary', `rgb(${r3},${g3},${b3})`);
    // muted color: desaturate
    css.setProperty('--muted', `rgba(${Math.round((r+g+b)/3)},${Math.round((r+g+b)/3)},${Math.round((r+g+b)/3)},0.6)`);
  }

  function sampleImage(imgEl){
    if(!imgEl) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgEl.src;
    img.onload = ()=>{
      try{
        const canvas = document.createElement('canvas');
        const w = 40, h = 40; // small for speed
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0,0,w,h).data;
        let r=0,g=0,b=0,count=0;
        for(let i=0;i<data.length;i+=4){
          const alpha = data[i+3];
          if(alpha < 125) continue;
          r += data[i]; g += data[i+1]; b += data[i+2]; count++;
        }
        if(count === 0) return;
        r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count);
        setThemeFromRgb(r,g,b);
      }catch(err){
        // likely CORS tainting. Fall back to a safe default and inform in console.
        console.warn('Could not sample image due to CORS or other error. Provide a local image in the repo for color extraction.', err);
      }
    };
    img.onerror = ()=>{ console.warn('Image failed to load for sampling:', imgEl.src); };
  }

  // try sampling the visual image (if same-origin or allows CORS)
  if(visualImg){ sampleImage(visualImg); }
});
