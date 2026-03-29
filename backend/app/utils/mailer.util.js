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

  const from = `Fresh Mart <${process.env.MAIL_USER}>`;
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

async function sendResetPasswordEmail({ to, name, resetLink, expiresMinutes }) {
  const transporter = createTransporter();

  const from = `Fresh Mart <${process.env.MAIL_USER}>`;
  const subject = "Đặt lại mật khẩu";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Xin chào ${name || "bạn"},</h2>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Bấm nút bên dưới để tiếp tục:</p>
      <p>
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">
          Đặt lại mật khẩu
        </a>
      </p>
      <p>Link sẽ hết hạn sau <b>${expiresMinutes || 15} phút</b>.</p>
      <p>Nếu không phải bạn, hãy bỏ qua email này.</p>
    </div>
  `;

  return transporter.sendMail({ from, to, subject, html });
}

async function sendContactReplyEmail({
  to,
  name,
  subject,
  originalContent,
  adminReply,
}) {
  const transporter = createTransporter();

  const from = `Fresh Mart <${process.env.MAIL_USER}>`;
  const mailSubject = `Phản hồi liên hệ: ${subject}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333">
      <h2>Xin chào ${name || "bạn"},</h2>

      <p>Chúng tôi đã nhận được liên hệ của bạn với nội dung:</p>

      <div style="padding:12px;background:#f5f7fa;border-left:4px solid #999;margin:10px 0">
        ${String(originalContent).replace(/\n/g, "<br>")}
      </div>

      <p><strong>Phản hồi từ chúng tôi:</strong></p>

      <div style="padding:12px;background:#e8f7f5;border-left:4px solid #49c5b6;margin:10px 0">
        ${String(adminReply).replace(/\n/g, "<br>")}
      </div>

      <p>Trân trọng,<br><strong>Fresh Mart</strong></p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to,
    subject: mailSubject,
    html,
  });
}

module.exports = {
  sendActivationEmail,
  sendResetPasswordEmail,
  sendContactReplyEmail,
};
