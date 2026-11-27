/* Dev C — branch feature/schedule-validation */
const Schedule = {
  all() { return App.load('bookings', []); },
  toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; },
  // Mengembalikan pesan error, atau null jika jadwal valid
  validate(b) {
    const s = Schedule.toMin(b.start), e = Schedule.toMin(b.end);
    if (e <= s) return 'Jam selesai harus lebih besar dari jam mulai.';
    if (s < 7 * 60 || e > 21 * 60) return 'Ruang hanya dapat dipinjam pukul 07:00 - 21:00.';
    const today = new Date().toISOString().slice(0, 10);
    if (b.date < today) return 'Tanggal peminjaman tidak boleh di masa lalu.';
    const clash = Schedule.all().find(x =>
      x.room === b.room && x.date === b.date &&
      s < Schedule.toMin(x.end) && e > Schedule.toMin(x.start));
    if (clash) return 'Bentrok dengan jadwal ' + clash.start + '-' + clash.end + ' (' + clash.purpose + ').';
    return null;
  },
  add(b) { const l = Schedule.all(); l.push(b); App.save('bookings', l); },
  remove(id) {
    App.save('bookings', Schedule.all().filter(x => x.id !== id));
    Schedule.render();
  },
  render() {
    const user = Login.current();
    const rows = Schedule.all().sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
    const body = document.getElementById('scheduleBody');
    if (!rows.length) { body.innerHTML = '<tr><td colspan="6">Belum ada peminjaman.</td></tr>'; return; }
    body.innerHTML = rows.map(r => {
      const can = user && (user.role === 'Admin' || user.username === r.user);
      return '<tr><td>' + App.esc(r.date) + '</td><td>' + App.esc(r.room) + '</td><td>' +
        App.esc(r.start) + ' - ' + App.esc(r.end) + '</td><td>' + App.esc(r.user) + '</td><td>' +
        App.esc(r.purpose) + '</td><td>' +
        (can ? '<button class="ghost" data-id="' + r.id + '">Batal</button>' : '') + '</td></tr>';
    }).join('');
    body.querySelectorAll('button[data-id]').forEach(b => b.addEventListener('click', () => {
      Schedule.remove(b.dataset.id);
      Notif.push('Peminjaman dibatalkan.', 'info');
    }));
  }
};
