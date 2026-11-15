const grid = document.querySelector('#course-grid');
const courseSelect = document.querySelector('#course-select');
const filters = document.querySelectorAll('.filters button');
let courses = [];

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

function renderCourses(track = 'all') {
  const visible = track === 'all' ? courses : courses.filter((course) => course.track === track);
  grid.innerHTML = visible.map((course) => `
    <article class="course-card">
      <header><span class="track">${escapeHtml(course.track)}</span><span class="level">${escapeHtml(course.level)}</span></header>
      <h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.description)}</p>
      <div class="skills">${course.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join('')}</div>
      <footer><span>${escapeHtml(course.duration)}</span><span>${escapeHtml(course.schedule)}</span></footer>
    </article>`).join('') || '<p class="loading">No programs in this track yet.</p>';
}

async function loadCourses() {
  try {
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Could not load programs');
    courses = await response.json();
    renderCourses();
    courseSelect.insertAdjacentHTML('beforeend', courses.map((course) => `<option value="${escapeHtml(course.id)}">${escapeHtml(course.title)}</option>`).join(''));
  } catch {
    grid.innerHTML = '<p class="loading">Programs are temporarily unavailable. Please try again soon.</p>';
  }
}

filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  renderCourses(button.dataset.track);
}));

document.querySelector('.menu').addEventListener('click', (event) => {
  const open = document.querySelector('#nav').classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

document.querySelector('#application-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button');
  status.className = 'form-status'; status.textContent = 'Sending…'; button.disabled = true;
  try {
    const response = await fetch('/api/enrollments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not submit application.');
    status.classList.add('success'); status.textContent = result.message; form.reset();
  } catch (error) {
    status.classList.add('error'); status.textContent = error.message;
  } finally { button.disabled = false; }
});

document.querySelector('#year').textContent = new Date().getFullYear();
loadCourses();
