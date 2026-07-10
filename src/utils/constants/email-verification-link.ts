import { buildEmailLayout } from '@/utils/email/email-layout';

const BRAND_COLOR = '#f97316';

interface EmailVerificationLinkOptions {
  heading?: string;
  description?: string;
  buttonText?: string;
  expiryNote?: string;
}

export const emailVerificationLink = (
  link: string,
  {
    heading = 'Verify your email',
    description = 'We received a request to verify your identity. Use the following link to complete the verification process:',
    buttonText = 'Verify',
    expiryNote = 'This link will expire in 8 hours. If you did not request this, you can safely ignore this email.'
  }: EmailVerificationLinkOptions = {}
) => {
  const bodyHtml = `
    <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
            <td class="pad">
                <div
                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                    <p style="margin: 0; word-break: break-word;">${description}</p>
                </div>
            </td>
        </tr>
    </table>
    <table border="0" cellpadding="10" cellspacing="0" class="heading_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
            <td class="pad" style="text-align: center;">
                <a href="${link}"
                    style="background-color: ${BRAND_COLOR}; color: white; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; font-weight: 700; padding: 10px 30px; text-decoration: none; border-radius: 50px; display: inline-block;">${buttonText}</a>
            </td>
        </tr>
    </table>
    <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
            <td class="pad">
                <div
                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                    <p style="margin: 0; word-break: break-word;">If the button above doesn’t work, you can copy and
                        paste the following link into your browser:</p>
                    <a href="${link}" style="color: ${BRAND_COLOR};">${link}</a>
                </div>
            </td>
        </tr>
    </table>
  `;

  return buildEmailLayout({
    heading,
    bodyHtml,
    footerNote: `<strong>Note:</strong> ${expiryNote}`
  });
};
