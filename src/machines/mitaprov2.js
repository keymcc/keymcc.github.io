export const MP2_FAKE_LOGS = [
  "> Đang khởi tạo MitaAttendance.Program::Main...",
  "> Đang tải MitaAttendance.exe.config...",
  "> Đang mở kết nối SQL Server / Access...",
  "> Đang kết nối ZKTeco qua interop.zkemkeeper...",
  "> Đang gọi CZKEMClass::GetSerialNumber...",
  "> Đọc chuỗi Serial thiết bị: {SN}",
  "> Đang phân tách: Substring(0,2) + Substring(len-4)...",
  "> Đang thực thi ActiveKey() trong frmDangKyMayChamCong...",
  "> a = Int32.Parse(_a), b = Int32.Parse(_b)...",
  "> Đang gọi stored procedure MAYCHAMCONG_activeKey..."
];

function calculateMP2(rawSerial) {
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

  const key = a + b + 240789;

  return { key: String(key) };
}

export const MP2_MACHINE = {
  logs: MP2_FAKE_LOGS,
  calculate: calculateMP2
};