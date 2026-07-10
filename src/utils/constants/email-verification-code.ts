import { buildEmailLayout } from '@/utils/email/email-layout';

const BRAND_COLOR = '#f97316';

interface EmailVerificationCodeProps {
  otp: string;
  time: number;
}

export const emailVerificationCode = ({
  otp,
  time
}: EmailVerificationCodeProps) => {
  const bodyHtml = `
    <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
            <td class="pad">
                <div
                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                    <p style="margin: 0;">We received a request to verify your identity. Please use the following One-Time Password (OTP) to complete the process:</p>
                </div>
            </td>
        </tr>
    </table>
    <table border="0" cellpadding="10" cellspacing="0" class="heading_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
            <td class="pad">
                <div align="center">
                    <div
                        style="background-color: #fff7ed; border: 1px dashed ${BRAND_COLOR}; color: ${BRAND_COLOR}; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; padding: 15px 25px; display: inline-block; border-radius: 8px;">
                        ${otp}
                    </div>
                </div>
            </td>
        </tr>
    </table>
  `;

  return buildEmailLayout({
    heading: 'OTP Verification',
    bodyHtml,
    footerNote: `<strong>Note:</strong> This code is valid for ${time} minutes. If you did not request this, please ignore this email.`
  });
};
