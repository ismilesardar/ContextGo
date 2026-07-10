import { APP_NAME } from '@/config/url.config';
import { buildEmailLayout } from '@/utils/email/email-layout';

export const welcomeEmail = (name: string) => {
  const bodyHtml = `
    <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
            <td class="pad">
                <div
                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                    <p style="margin: 0 0 10px;">Hi ${name || 'there'},</p>
                    <p style="margin: 0;">Welcome to ${APP_NAME}! We're excited to have you on board.</p>
                </div>
            </td>
        </tr>
    </table>
  `;

  return buildEmailLayout({
    heading: `Welcome to ${APP_NAME}`,
    bodyHtml
  });
};
