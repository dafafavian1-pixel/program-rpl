/* Dev B — branch feature/booking */
const Booking = {
  init() {
    const room = document.getElementById('room');
    room.innerHTML = App.rooms.map(r => '<option>' + App.esc(r) + '</option>').join('');
    document.getElementById('date').min = new Date().toISOString().slice(0, 10);
    document.getElementById('bookingForm').addEventListener('submit', e => {
      e.preventDefault();
      const user = Login.current();
      const b = {
        id: String(Date.now()),
        user: user ? user.username : '-',
        room: room.value,
        date: document.getElementById('date').value,
        start: document.getElementById('start').value,
        end: document.getElementById('end').value,
        purpose: document.getElementById('purpose').value.trim()
      };
      const err = document.getElementById('bookingError');
      const problem = Schedule.validate(b);   // validasi dari Dev C
      if (problem) { err.textContent = problem; Notif.push(problem, 'error'); return; }
      err.textContent = '';
      Schedule.add(b);
      Notif.push('Peminjaman ' + b.room + ' pada ' + b.date + ' (' + b.start + '-' + b.end + ') berhasil diajukan.', 'success');
      e.target.reset();
    });
  }
};
