export const emailTemplates = {
  welcome: (name: string): string => `
    <h1>Welcome to HomePulse!</h1>
    <p>Hi ${name},</p>
    <p>Thank you for joining HomePulse. We're excited to help you find your perfect home.</p>
    <p>Get started by exploring available properties in your area.</p>
    <p>Best regards,<br>The HomePulse Team</p>
  `,
  passwordReset: (name: string, resetLink: string): string => `
    <h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `,
  paymentConfirmation: (name: string, amount: number, property: string): string => `
    <h1>Payment Confirmation</h1>
    <p>Hi ${name},</p>
    <p>Your payment of ${amount} for ${property} has been processed successfully.</p>
    <p>You can view your payment history in your account.</p>
  `,
  propertyApproval: (name: string, propertyTitle: string): string => `
    <h1>Property Listing Approved</h1>
    <p>Hi ${name},</p>
    <p>Your property listing "${propertyTitle}" has been approved and is now live.</p>
    <p>Start receiving inquiries from potential tenants!</p>
  `,
  maintenanceUpdate: (name: string, requestTitle: string, status: string): string => `
    <h1>Maintenance Request Update</h1>
    <p>Hi ${name},</p>
    <p>Your maintenance request "${requestTitle}" has been updated to: ${status}</p>
  `,
  escrowUpdate: (name: string, propertyTitle: string, status: string): string => `
    <h1>Escrow Update</h1>
    <p>Hi ${name},</p>
    <p>The escrow transaction for "${propertyTitle}" is now: ${status}</p>
  `,
};
