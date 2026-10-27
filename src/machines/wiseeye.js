export const WE_FAKE_LOGS = [
  "> Đang đọc số Serial: {SN}",
  "> Đang tách ký tự số và ký tự chữ...",
  "> Đang đảo chuỗi số và tính Int(rev / 11)...",
  "> Đang cộng hằng số 1978 + 1984...",
  "> Đang ánh xạ chữ số: 0→2, 1→3, ..., 8→8, 9→9...",
  "> Đang nhân hệ số NormalClient (x4)...",
  "> Đang tổng hợp mã kích hoạt..."
];

const DIVISOR = 11;
const CONST_A = 1978;
const CONST_B = 1984;
const SERVICE_MULTIPLIER = 4; // 2 (fadd st,st) × service type 2 (NormalClient)
const NON_DIGIT_SCALE = 301;
const NON_DIGIT_BIAS = 1984 + 1978;
const NON_DIGIT_MULT = 4020;

function mapDigit(d) {
  return d + 2 <= 9 ? d + 2 : d;
}

// VB6: sum 9-digit chunks until the value fits in 9 digits.
function reduce9(value) {
  let s = String(value);
  for (;;) {
    let total = 0;
    let pos = 0;
    while (s.length > 9) {
      pos += 10;
      total += Number(s.slice(0, 9));
      s = pos - 1 < s.length ? s.slice(pos - 1) : '';
    }
    if (s.length > 0) total += Number(s);
    s = String(total);
    if (s.length <= 9) return total;
  }
}

export function generateWiseEyeKey(rawSerial) {
  const serial = String(rawSerial).trim();
  let digits = '';
  let nonDigits = '';

  for (const ch of serial) {
    if (ch >= '0' && ch <= '9') digits += ch;
    else nonDigits += ch;
  }

  if (digits.length === 0) {
    return { error: 'Serial phải chứa ít nhất một chữ số' };
  }

  // CDbl(StrReverse(digits)) — leading zeros drop out.
  const reversed = Number(digits.split('').reverse().join(''));
  const v = Math.floor(reversed / DIVISOR) + CONST_A + CONST_B;
  const mapped = Number(String(v).split('').map(d => mapDigit(Number(d))).join(''));
  const keyTerm = mapped * SERVICE_MULTIPLIER;

  if (nonDigits.length === 0) {
    return { key: String(keyTerm) };
  }

  let nonDigitSum = 0;
  for (const ch of nonDigits) nonDigitSum += ch.charCodeAt(0);

  const score = (NON_DIGIT_SCALE * nonDigitSum + NON_DIGIT_BIAS) * NON_DIGIT_MULT;
  return { key: String(reduce9(keyTerm + score)) };
}

export const WE_MACHINE = {
  logs: WE_FAKE_LOGS,
  calculate: generateWiseEyeKey
};
