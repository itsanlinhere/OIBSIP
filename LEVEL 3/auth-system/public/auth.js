document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('signin-form');
  const toggle = document.getElementById('toggle-pw');
  const pw = document.getElementById('password');

  if(toggle && pw){
    toggle.addEventListener('click', ()=>{
      if(pw.type === 'password'){ pw.type = 'text'; toggle.textContent = '🙈'; }
      else { pw.type = 'password'; toggle.textContent = '👁️'; }
    });
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      if(!email || !password){
        alert('Please enter both email and password');
        return;
      }
      // Simple client-side validation passed.
      // Replace this with real authentication call to your backend.
      alert('Signed in (demo): ' + email);
      // For demo: clear form
      form.reset();
    });
  }

  const googleBtn = document.getElementById('google-signin');
  if(googleBtn){
    googleBtn.addEventListener('click', ()=>{
      alert('Google Sign-in (demo)');
    });
  }
});
