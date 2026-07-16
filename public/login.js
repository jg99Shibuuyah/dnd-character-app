// Sign in / create account / forgot password — the only page script that runs
// without a login. On success the browser lands on the character sheet.
(function(){
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  const err = document.getElementById('authError');
  const ok = document.getElementById('authOk');

  function showMode(mode){
    err.hidden = true; ok.hidden = true;
    forms.forEach(f => { f.hidden = f.dataset.mode !== mode; });
    tabs.forEach(t => t.classList.toggle('on', t.dataset.mode === mode));
    const first = document.querySelector(`.auth-form[data-mode="${mode}"] input`);
    if(first) first.focus();
  }

  tabs.forEach(t => t.addEventListener('click', () => showMode(t.dataset.mode)));
  document.getElementById('forgotLink').addEventListener('click', () => showMode('forgot'));
  document.getElementById('backToLogin').addEventListener('click', () => showMode('login'));

  async function post(url, body){
    err.hidden = true; ok.hidden = true;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json().catch(() => ({}));
    if(!r.ok){
      err.textContent = data.error || 'Something went wrong';
      err.hidden = false;
      return null;
    }
    return data;
  }

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await post('/api/auth/login', {
      username: document.getElementById('loginUsername').value.trim(),
      password: document.getElementById('loginPassword').value
    });
    if(data) location.href = '/';
  });

  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await post('/api/auth/register', {
      username: document.getElementById('regUsername').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      password: document.getElementById('regPassword').value
    });
    if(data) location.href = '/';
  });

  document.getElementById('forgotForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await post('/api/auth/forgot', {
      identifier: document.getElementById('forgotIdentifier').value.trim()
    });
    if(data){ ok.textContent = data.message; ok.hidden = false; }
  });
})();
