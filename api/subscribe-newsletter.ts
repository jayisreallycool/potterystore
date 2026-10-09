// Vercel Function for newsletter subscriptions
// Feature: Email Newsletter Signup

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source, timestamp } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Log subscription for analytics
    console.log('Newsletter subscription:', {
      email,
      source,
      timestamp,
      receivedAt: new Date().toISOString()
    });

    // In production, integrate with:
    // - Resend: await resend.emails.send({ from: "noreply@cliffcooks.com", to: email, ... })
    // - SendGrid: sgMail.send({ to: email, from: "noreply@cliffcooks.com", ... })
    // - Mailchimp API: POST to /lists/{list_id}/members
    // - ConvertKit: POST to /subscribers with email and tag

    // For demo: store in a simple log
    const subscribers = {
      email,
      subscribedAt: new Date().toISOString(),
      source: source || 'direct',
      status: 'active'
    };

    // Optionally send welcome email
    // await notificationService.sendWelcomeEmail(email)

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      email,
      subscribedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
}
