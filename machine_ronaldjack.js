const RJ_FAKE_LOGS = [
  "> Đang phân tích chuỗi Serial thiết bị Ronald Jack...",
  "> Đang trích xuất các chữ số: {SN}",
  "> Đang phân tách chuỗi thành các phân đoạn a, b, c...",
  "> Đang áp dụng thuật toán tổng kiểm mã chuẩn...",
  "> Hoàn tất tính toán mã."
];

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

const RJ_MACHINE = {
  logs: RJ_FAKE_LOGS,
  calculate: calculateRJ
};
