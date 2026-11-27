/* Integrasi: state bersama, navigasi, helper */
const App = {
  rooms: ['Ruang A101', 'Ruang A102', 'Lab Komputer 1', 'Aula Utama'],
  load(k, d) {
    try { const v = localStorage.getItem('pinjamruang_' + k); return v ? JSON.parse(v) : d; }
    catch (e) { return d; }
  },
  save(k, v) {
    try { localStorage.setItem('pinjamruang_' + k, JSON.stringify(v)); } catch (e) {}
  },
  esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
  show(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById('view-' + name).classList.remove('hidden');
    document.querySelectorAll('#nav button[data-view]').forEach(b =>
      b.classList.toggle('active', b.dataset.view === name));
    if (name === 'schedule') Schedule.render();
    if (name === 'notif') Notif.render(true);
  },
  enter() {
    const u = Login.current();
    document.getElementById('nav').classList.toggle('hidden', !u);
    if (!u) return App.show('login');
    document.getElementById('welcome').textContent = 'Halo, ' + u.username + ' (' + u.role + ')';
    Notif.updateBadge();
    App.show('booking');
  },
  init() {
    document.querySelectorAll('#nav button[data-view]').forEach(b =>
      b.addEventListener('click', () => App.show(b.dataset.view)));
    Login.init(); Booking.init(); Notif.init();
    App.enter();
  }
};
