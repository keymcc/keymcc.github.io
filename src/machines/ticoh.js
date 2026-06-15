export const TH_FAKE_LOGS = [
  "> Đang khởi tạo module TicoH...",
  "> Đang đọc chuỗi Serial: {SN}",
  "> Đang trích xuất phân đoạn a",
  "> Đang trích xuất phân đoạn b",
  "> Đang tính toán mã",
  "> Hoàn tất tạo mã."
];

function calculateTH(rawSerial) {
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

  const key = a + b + 110421;

  return { key: String(key) };
}

export const TH_MACHINE = {
  logs: TH_FAKE_LOGS,
  calculate: calculateTH
};
