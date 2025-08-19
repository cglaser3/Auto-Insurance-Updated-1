const app = document.getElementById('app');
const progressBar = document.getElementById('progress');
let currentStep = 0;
const formData = {
  zip: "",
  birthdate: {},
  homeowner: '',
  insured: '',
  insurer: '',
  maritalStatus: '',
  coverage: '',
  vehicles: []
};
let fromAddAnother = false;

const steps = [
  renderBirthdate,
  renderHomeowner,
  renderInsured,
  renderInsurer,
  renderMaritalStatus,
  renderCoverage,
  renderVehicleYear,
  renderAddVehicle
];

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep();
  } else {
    showLoadingScreen();
  }
}

function prevStep() {
  if (fromAddAnother && currentStep === steps.indexOf(renderVehicleYear)) {
    currentStep = steps.indexOf(renderAddVehicle);
    fromAddAnother = false;
  } else if (currentStep > 0) {
    currentStep--;
  }
  renderStep();
}

function renderStep() {
  steps[currentStep]();
  updateProgress();
}

function updateProgress() {
  const percent = (currentStep) / (steps.length - 1) * 100;
  progressBar.style.width = percent + '%';
}

function backButtonHTML() {
  return currentStep > 0 ? '<button id="back" class="back-btn">Back</button>' : '';
}

function renderBirthdate() {
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
  const days = Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
  let years = '';
  for (let y = currentYear; y >= currentYear - 100; y--) {
    years += `<option value="${y}">${y}</option>`;
  }
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>What year were you born?</h2>
    <div>
      <select id="birth-month"><option value="">Month</option>${months}</select>
      <select id="birth-day"><option value="">Day</option>${days}</select>
      <select id="birth-year"><option value="">Year</option>${years}</select>
    </div>
    <button class="option-btn" id="next">Next</button>
  `;
  if (currentStep > 0) document.getElementById('back').onclick = prevStep;
  document.getElementById('next').onclick = () => {
    const m = document.getElementById('birth-month').value;
    const d = document.getElementById('birth-day').value;
    const y = document.getElementById('birth-year').value;
    if (m && d && y) {
      formData.birthdate = { month: m, day: d, year: y };
      nextStep();
    }
  };
}

function renderHomeowner() {
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>Are you a homeowner?</h2>
    <div class="options">
      <button class="option-btn" data-val="Yes">Yes</button>
      <button class="option-btn" data-val="No">No</button>
    </div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.homeowner = btn.dataset.val;
      nextStep();
    };
  });
}

function renderInsured() {
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>Are you currently insured?</h2>
    <div class="options">
      <button class="option-btn" data-val="Yes">Yes</button>
      <button class="option-btn" data-val="No">No</button>
    </div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.insured = btn.dataset.val;
      nextStep();
    };
  });
}

function renderInsurer() {
  const insurers = ['Geico', 'Allstate', 'State Farm', 'Progressive', 'Liberty Mutual', 'Other'];
  const buttons = insurers.map(name => `<button class="option-btn" data-val="${name}">${name}</button>`).join('');
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>Who is your current insurer?</h2>
    <div class="grid">${buttons}</div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.insurer = btn.dataset.val;
      nextStep();
    };
  });
}

function renderMaritalStatus() {
  const statuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const buttons = statuses.map(s => `<button class="option-btn" data-val="${s}">${s}</button>`).join('');
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>What is your marital status?</h2>
    <div class="options">${buttons}</div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.maritalStatus = btn.dataset.val;
      nextStep();
    };
  });
}

function renderCoverage() {
  const coverages = ['Minimum', 'Basic', 'Standard', 'Superior'];
  const buttons = coverages.map(c => `<button class="option-btn" data-val="${c}">${c}</button>`).join('');
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>How much coverage do you need?</h2>
    <div class="options">${buttons}</div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.coverage = btn.dataset.val;
      nextStep();
    };
  });
}

function renderVehicleYear() {
  const currentYear = new Date().getFullYear();
  let years = '';
  for (let y = currentYear; y >= 1990; y--) {
    years += `<button class="option-btn" data-year="${y}">${y}</button>`;
  }
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>What year is your vehicle?</h2>
    <div class="grid">${years}</div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      formData.vehicles.push({ year: btn.dataset.year });
      nextStep();
    };
  });
}

function renderAddVehicle() {
  const list = formData.vehicles.map((v, i) => `<div class="vehicle">Vehicle ${i + 1}: ${v.year}</div>`).join('');
  app.innerHTML = `
    ${backButtonHTML()}
    <h2>Would you like to insure another vehicle?</h2>
    <div>${list}</div>
    <div class="options">
      <button class="option-btn" id="yes">Yes</button>
      <button class="option-btn" id="no">No</button>
    </div>
  `;
  document.getElementById('back').onclick = prevStep;
  document.getElementById('yes').onclick = () => {
    fromAddAnother = true;
    currentStep = steps.indexOf(renderVehicleYear);
    renderStep();
  };
  document.getElementById('no').onclick = nextStep;
}

function showLoadingScreen() {
  progressBar.style.width = '100%';
  app.innerHTML = `
    <div class="final-screen">
      <h2>Preparing your quote...</h2>
      <div class="fake-progress"><div id="fakeBar"></div></div>
      <p id="loading-msg">Gathering data...</p>
    </div>
  `;
  let width = 0;
  const messages = ['Gathering data...', 'Finding best rates...', 'Almost done...'];
  let msgIndex = 0;
  const bar = document.getElementById('fakeBar');
  const msgEl = document.getElementById('loading-msg');
  const interval = setInterval(() => {
    width += 100 / 15;
    bar.style.width = width + '%';
    if (width >= (msgIndex + 1) * 33 && msgIndex < messages.length - 1) {
      msgIndex++;
      msgEl.textContent = messages[msgIndex];
    }
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(showThankYou, 500);
    }
  }, 1000);
}

function showThankYou() {
  app.innerHTML = `
    <div class="thank-you">
      <h2>Thank you!</h2>
      <p>Your information has been received.</p>
    </div>
  `;
  console.log('Collected data:', formData);
}

document.getElementById('zip-form').addEventListener('submit', e => {
  e.preventDefault();
  const zip = document.getElementById('zip').value.trim();
  if (/^\d{5}$/.test(zip)) {
    formData.zip = zip;
    document.querySelector('.overlay').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('progress-container').classList.remove('hidden');
    document.querySelector('footer').classList.add('hidden');
    currentStep = 0;
    renderStep();
  }
});
