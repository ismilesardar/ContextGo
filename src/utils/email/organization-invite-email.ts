import { BASE_URL } from '@/config/url.config';
import { sendMail } from '@/lib/send-mail';
import { buildEmailLayout } from '@/utils/email/email-layout';

const BRAND_COLOR = '#f97316';

export async function sendOrganizationInviteEmail({
  invitation,
  inviter,
  organization,
  email
}: {
  invitation: { id: string };
  inviter: { name: string };
  organization: { name: string };
  email: string;
}) {
  const inviteUrl = `${BASE_URL}/workspaces/invites/${invitation.id}`;

  const bodyHtml = `
    <table border="0" cellpadding="10" cellspacing="0" class="paragraph_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
            <td class="pad">
                <div
                    style="color:#393d47;font-family:Tahoma,Verdana,Segoe,sans-serif;font-size:14px;line-height:150%;text-align:center;mso-line-height-alt:21px;">
                    <p style="margin: 0; word-break: break-word;">${inviter.name} invited you to join the ${organization.name} organization. Click the button below to accept or reject the invitation:</p>
                </div>
            </td>
        </tr>
    </table>
    <table border="0" cellpadding="10" cellspacing="0" class="heading_block" role="presentation"
        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
            <td class="pad" style="text-align: center;">
                <a href="${inviteUrl}"
                    style="background-color: ${BRAND_COLOR}; color: white; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; font-weight: 700; padding: 10px 30px; text-decoration: none; border-radius: 50px; display: inline-block;">Manage Invitation</a>
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
                    <a href="${inviteUrl}" style="color: ${BRAND_COLOR};">${inviteUrl}</a>
                </div>
            </td>
        </tr>
    </table>
  `;

  await sendMail({
    receiver: email,
    subject: `You're invited to join the ${organization.name} organization`,
    body: buildEmailLayout({
      heading: `Join ${organization.name}`,
      bodyHtml
    })
  });
}
