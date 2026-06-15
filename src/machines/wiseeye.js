export const WE_FAKE_LOGS = [
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

async function calculateWE(sn, log) {
  let isFetchComplete = false;

  const wakeUpTimeout = setTimeout(() => {
    if (!isFetchComplete && log) {
      log("> Đang đánh thức máy chủ Render... Vui lòng đợi khoảng 1 phút...", "warning");
    }
  }, 5000);

  try {
    const resp = await fetch(`https://keymcc.onrender.com/api/key?sn=${encodeURIComponent(sn)}`);
    isFetchComplete = true;
    clearTimeout(wakeUpTimeout);

    const data = await resp.json();

    if (data.error && data.error === "Failed to capture the required strings for key calculation.") {
      data.error = "Không thể trích xuất chuỗi yêu cầu để tính toán mã.";
    }

    if (resp.ok) {
      return { key: data.key };
    } else {
      return { error: data.error };
    }
  } catch (e) {
    isFetchComplete = true;
    clearTimeout(wakeUpTimeout);
    return { error: 'Không thể kết nối tới máy chủ' };
  }
}

export const WE_MACHINE = {
  logs: WE_FAKE_LOGS,
  calculate: calculateWE
};
