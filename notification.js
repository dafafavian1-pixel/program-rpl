/* Dev D — branch feature/notification */
const Notif = {
  all() { return App.load('notifs', []); },
  push(msg, type) {
    const l = Notif.all();
    l.unshift({ msg, type: type || 'info', time: new Date().toLocaleString('id-ID'), read: false });
    App.save('notifs', l.slice(0, 50));
    Notif.updateBadge();
    Notif.toast(msg, type);
  },
  toast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (type === 'error' ? ' error' : '');
    clearTimeout(Notif._t);
    Notif._t = setTimeout(() => t.classList.add('hidden'), 3500);
  },
  updateBadge() {
    const n = Notif.all().filter(x => !x.read).length;
    const b = document.getElementById('badge');
    b.textContent = n;
    b.classList.toggle('hidden', n === 0);
  },
  render(markRead) {
    let l = Notif.all();
    document.getElementById('notifList').innerHTML = l.length
      ? l.map(n => '<li class="' + (n.type === 'error' ? 'error' : '') + '">' + App.esc(n.msg) +
          '<small>' + App.esc(n.time) + '</small></li>').join('')
      : '<li>Belum ada notifikasi.</li>';
    if (markRead) { l = l.map(n => ({ ...n, read: true })); App.save('notifs', l); Notif.updateBadge(); }
  },
  init() {
    document.getElementById('btnClearNotif').addEventListener('click', () => {
      App.save('notifs', []); Notif.render(); Notif.updateBadge();
    });
  }
};
