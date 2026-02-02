const nodemailer = require("nodemailer");

function createTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Mail user or app password is not defined in environment variables.",
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}
async function sendActivationEmail({ to, name, activationLink }) {
  const transporter = createTransporter();

  const from = `MyShop <${process.env.MAIL_USER}>`;
  const subject = "Kích hoạt tài khoản của bạn";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Xin chào ${name || "bạn"},</h2>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng bấm vào nút bên dưới để kích hoạt tài khoản:</p>
      <p>
        <a href="${activationLink}"
           style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">
          Kích hoạt tài khoản
        </a>
      </p>
      <p>Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
    </div>
  `;

  return transporter.sendMail({ from, to, subject, html });
}

async function sendResetPasswordEmail({ to, name, resetLink }) {
  const transporter = createTransporter();

  const from = `MyShop <${process.env.MAIL_USER}>`;
  const subject = "Đặt lại mật khẩu của bạn";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Xin chào ${name || "bạn"},</h2>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng bấm vào nút bên dưới để đặt lại mật khẩu:</p>
      <p>
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">
          Đặt lại mật khẩu
        </a>
      </p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
    </div>
  `;

  return transporter.sendMail({ from, to, subject, html });
}

module.exports = { sendActivationEmail, sendResetPasswordEmail };
