const verifyEmailTemplate = (url) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2>Please Verify Your Email</h2>
      <p>Click the button below to verify your email address:</p>
      <a href="${url}" style="
        background-color: #04AA6D;
        color: white;
        padding: 15px 32px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 12px 0;
        cursor: pointer;
        text-decoration: none;
        border-radius: 4px;
      ">Verify Email</a>
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
  `;
};

const resetPasswordTemplate = (url) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${url}" style="
        background-color: #04AA6D;
        color: white;
        padding: 15px 32px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 12px 0;
        cursor: pointer;
        text-decoration: none;
        border-radius: 4px;
      ">Reset Password</a>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
};

const requestApprovedTemplate = (userName, requestType) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2>Hello ${userName},</h2>
      <p>Your <strong>${requestType}</strong> request has been <span style="color:green;"><strong>approved</strong></span>.</p>
      <p>Thank you!</p>
    </div>
  `;
};

const requestRejectedTemplate = (userName, requestType) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h2>Hello ${userName},</h2>
      <p>Unfortunately, your <strong>${requestType}</strong> request has been <span style="color:red;"><strong>rejected</strong></span>.</p>
      <p>If you have any questions, feel free to contact support.</p>
      <p>Regards,</p>
      <p>Blog App</p>
    </div>
  `;
};

module.exports = {
  verifyEmailTemplate,
  resetPasswordTemplate,
  requestApprovedTemplate,
  requestRejectedTemplate,
};
