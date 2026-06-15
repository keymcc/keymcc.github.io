export const MC5_FAKE_LOGS = [
  "> Đang khởi tạo công cụ cấp phép MITACO5 V2...",
  "> Đang tải module bảo vệ: armadillo.sys...",
  "> Đang đọc chuỗi Serial thiết bị: {SN}",
  "> Đang tính toán Base: SN * 2006...",
  "> Đang tạo Checksum từ chữ số cuối...",
  "> Đang hợp nhất mã cấp phép cuối cùng..."
];

function generateMitaco5Key(rawSerial) {
  let numericStr = '';
  for (let char of rawSerial) {
    if (char >= '0' && char <= '9') numericStr += char;
  }
  const sn = parseInt(numericStr, 10);
  if (isNaN(sn)) {
    return { error: 'Serial phải là số' };
  }
  const base = sn * 2006;
  const C_last = (sn % 10 * 4) % 10;
  const C = 7937740 + C_last - 10 * Math.floor(C_last / 8);
  return { key: String(base + C) };
}

export const MC5_MACHINE = {
  logs: MC5_FAKE_LOGS,
  calculate: generateMitaco5Key
};
