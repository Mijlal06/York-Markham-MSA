document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', () => {
    const toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearStatus();

    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      showSuccess('Thanks! Your message has been received.');
      form.reset();
      return;
    }

    const fname = form.querySelector('#fname');
    const lname = form.querySelector('#lname');
    const subject = form.querySelector('#subject');

    const allValid =
      validateMinLength(fname, 2) &&
      validateMinLength(lname, 2) &&
      validateMinLength(subject, 5);

    if (!allValid) {
      showError('Please complete all required fields (min length shown).');
      return;
    }

    let submitBtn = form.querySelector('input[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.value = 'Sending...';
    }

    fetch('https://your-endpoint.example/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: fname.value.trim(),
        lastname: lname.value.trim(),
        subject: subject.value.trim()
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json().catch(() => ({}));
      })
      .then(() => {
        showSuccess('Thank you! We will get back to you soon.');
        form.reset();
      })
      .catch(() => {
        showError('Sorry, something went wrong. Please try again later.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.value = 'Submit';
        }
      });
  });
}

function validateMinLength(field, min) {
  if (!field) return false;
  const ok = field.value.trim().length >= min;
  field.classList.toggle('is-invalid', !ok);
  return ok;
}

function clearStatus() {
  statusEl.textContent = '';
  statusEl.classList.remove('success', 'error');
}

function showSuccess(msg) {
  statusEl.textContent = msg;
  statusEl.classList.remove('error');
  statusEl.classList.add('success');
}

function showError(msg) {
  statusEl.textContent = msg;
  statusEl.classList.remove('success');
  statusEl.classList.add('error');
}
