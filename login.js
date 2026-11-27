/* Dev A — branch feature/login */
const Login = {
  users: [
    { username: 'mahasiswa', password: '1234', role: 'Mahasiswa' },
    { username: 'admin', password: 'admin123', role: 'Admin' }
  ],
  current() { return App.load('session', null); },
  init() {
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value;
      const found = Login.users.find(x => x.username === u && x.password === p);
      const err = document.getElementById('loginError');
      if (!found) { err.textContent = 'Username atau password salah.'; return; }
      err.textContent = '';
      App.save('session', { username: found.username, role: found.role });
      e.target.reset();
      App.enter();
    });
    document.getElementById('btnLogout').addEventListener('click', () => {
      App.save('session', null);
      App.enter();
    });
  }
};
