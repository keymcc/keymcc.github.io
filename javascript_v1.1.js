const snInput = document.getElementById('sn');
const genBtn = document.getElementById('gen');
const resultContainer = document.getElementById('result-container');
const resultEl = document.getElementById('result');
const terminalWrapper = document.getElementById('terminal-wrapper');
const terminalContent = document.getElementById('terminal-content');
const terminalBody = document.getElementById('terminal-body');

let logInterval;

function appendLog(text, className = '') {
  const div = document.createElement('div');
  div.className = `log-line ${className}`;
  div.textContent = text;
  terminalContent.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

async function simulateLogs(sn, logsArray) {
  terminalContent.innerHTML = '';
  terminalWrapper.classList.remove('hidden');
  resultContainer.classList.add('hidden');

  let i = 0;
  return new Promise((resolve) => {
    logInterval = setInterval(() => {
      if (i < logsArray.length) {
        let msg = logsArray[i].replace('{SN}', sn);
        appendLog(msg);
        i++;
      } else {
        clearInterval(logInterval);
        resolve();
      }
    }, 300 + Math.random() * 300);
  });
}

genBtn.addEventListener('click', async () => {
  const sn = snInput.value.trim();
  if (!sn) {
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('error');
    resultEl.textContent = '❌ Vui lòng nhập số Serial';
    return;
  }

  const deviceType = document.querySelector('input[name="device"]:checked').value;

  genBtn.disabled = true;
  snInput.disabled = true;

  const machine = deviceType === 'ronaldjack' ? RJ_MACHINE :
                  deviceType === 'mitaco5' ? MC5_MACHINE :
                  deviceType === 'ticoh' ? TH_MACHINE :
                  WE_MACHINE;

  const calcResult = machine.calculate(sn);
  const simPromise = simulateLogs(sn, machine.logs);

  const result = await calcResult;
  await simPromise;

  if (result.error) {
    resultContainer.classList.add('error');
    appendLog(`> LỖI: ${result.error}`, 'error');
    resultEl.textContent = `❌ ${result.error}`;
  } else {
    resultContainer.classList.remove('error');
    appendLog(`> THÀNH CÔNG: Đã tạo mã -> ${result.key}`, 'success');
    resultEl.textContent = `🔑 ${result.key}`;
  }

  resultContainer.classList.remove('hidden');
  genBtn.disabled = false;
  snInput.disabled = false;
});
