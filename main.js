const snInput = document.getElementById('sn');
const genBtn = document.getElementById('gen');
const resultContainer = document.getElementById('result-container');
const resultEl = document.getElementById('result');
const terminalWrapper = document.getElementById('terminal-wrapper');
const terminalContent = document.getElementById('terminal-content');
const terminalBody = document.getElementById('terminal-body');

const WE_FAKE_LOGS = [
  "> Đang khởi động môi trường Wine trong /wine...",
  "> Đang kết nối tới màn hình ảo Xvfb :99...",
  "> Đang đăng ký thành phần ActiveX: zkemkeeper.dll...",
  "> Đang tải các thư viện phụ thuộc: commpro.dll, plcommpro.dll...",
  "> Đang khởi tạo giao diện COM WiseEyeExtDevice.wseClass...",
  "> Đang phân tích số Serial: {SN}",
  "> Đang đảo ngược SN và tính toán tổng kiểm s1...",
  "> Đang chuyển quyền thực thi cho giao diện COM...",
  "> Đang chờ phản hồi từ DLL..."
];

const RJ_FAKE_LOGS = [
  "> Đang phân tích chuỗi Serial thiết bị Ronald Jack...",
  "> Đang trích xuất các chữ số: {SN}",
  "> Đang phân tách chuỗi thành các phân đoạn a, b, c...",
  "> Đang áp dụng thuật toán tổng kiểm mã chuẩn...",
  "> Hoàn tất tính toán mã."
];

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
    }, 300 + Math.random() * 300); // 300-600ms
  });
}

function calculateRJ(rawSerial) {
  let numericSerial = '';
  for (let char of rawSerial) {
    if (char >= '0' && char <= '9') {
      numericSerial += char;
    }
  }

  if (numericSerial.length < 4) {
    return { error: 'Số Serial quá ngắn' };
  }

  const strA = numericSerial.substring(0, 2);
  const strB = numericSerial.substring(numericSerial.length - 4);

  const a = parseInt(strA, 10);
  const b = parseInt(strB, 10);

  if (isNaN(a) || isNaN(b)) {
    return { error: 'Lỗi phân tích cú pháp số Serial.' };
  }

  const standardKey = a + b + 2598118;
  const legacyKey = a + b + 140893;

  return {
    key: `${standardKey}`
  };
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

  if (deviceType === 'ronaldjack') {
    const simulationPromise = simulateLogs(sn, RJ_FAKE_LOGS);
    const rjResult = calculateRJ(sn);

    await simulationPromise;

    if (rjResult.error) {
      resultContainer.classList.add('error');
      appendLog(`> LỖI: ${rjResult.error}`, 'error');
      resultEl.textContent = `❌ ${rjResult.error}`;
    } else {
      resultContainer.classList.remove('error');
      appendLog(`> THÀNH CÔNG: Đã tạo mã!`, 'success');
      resultEl.textContent = `🔑 ${rjResult.key}`;
    }

    resultContainer.classList.remove('hidden');
    genBtn.disabled = false;
    snInput.disabled = false;
    return;
  }

  // WiseEye Flow
  const simulationPromise = simulateLogs(sn, WE_FAKE_LOGS);
  let isFetchComplete = false;

  const wakeUpTimeout = setTimeout(() => {
    if (!isFetchComplete) {
      appendLog("> Đang đánh thức máy chủ Render... Vui lòng đợi khoảng 1 phút...", "warning");
    }
  }, 5000); // 5 seconds wait indicates Render is asleep

  try {
    const resp = await fetch(`https://keymcc.onrender.com/api/key?sn=${encodeURIComponent(sn)}`);
    isFetchComplete = true;
    clearTimeout(wakeUpTimeout);

    const data = await resp.json();
    await simulationPromise;

    if (data.error && data.error === "Failed to capture the required strings for key calculation.") {
      data.error = "Không thể trích xuất chuỗi yêu cầu để tính toán mã.";
    }

    if (resp.ok) {
      resultContainer.classList.remove('error');
      appendLog(`> THÀNH CÔNG: Đã tạo mã -> ${data.key}`, 'success');
      resultEl.textContent = `🔑 ${data.key}`;
    } else {
      resultContainer.classList.add('error');
      appendLog(`> LỖI: ${data.error}`, 'error');
      resultEl.textContent = `❌ ${data.error}`;
    }
  } catch (e) {
    isFetchComplete = true;
    clearTimeout(wakeUpTimeout);
    clearInterval(logInterval);

    resultContainer.classList.add('error');
    appendLog('> LỖI: Không thể kết nối tới máy chủ', 'error');
    resultEl.textContent = '❌ Không thể kết nối tới máy chủ';
  } finally {
    resultContainer.classList.remove('hidden');
    genBtn.disabled = false;
    snInput.disabled = false;
  }
});

