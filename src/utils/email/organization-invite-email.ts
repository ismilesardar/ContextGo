import { BASE_URL } from '@/config/url.config';
import { sendMail } from '@/lib/send-mail';

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
  await sendMail({
    receiver: email,
    subject: `You're invited to join the ${organization.name} organization`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">You're invited to join ${organization.name}</h2>
        <p>Hello ${inviter.name},</p>
        <p>${inviter.name} invited you to join the ${organization.name} organization. Please click the button below to accept/reject the invitation:</p>
        <a href="${BASE_URL}/workspaces/invites/${invitation.id}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Manage Invitation</a>
        <p>If the button above doesn’t work, you can copy and paste the following link into your browser:</p>
        <a href="${BASE_URL}/workspaces/invites/${invitation.id}">${BASE_URL}/workspaces/invites/${invitation.id}</a>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `
  });
}
