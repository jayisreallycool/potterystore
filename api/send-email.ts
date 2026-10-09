// Vercel Function for sending emails
// Feature 6: Email Notifications
// Supports: order confirmation, shipping updates, review requests, restock alerts

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, type, data } = req.body;

  if (!to || !subject || !type) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, type' });
  }

  try {
    // Email templates by type
    const templates: Record<string, (data: any) => string> = {
      order_confirmation: (data) => `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order! Here's what you ordered:</p>
        <ul>
          ${data.items?.map((item: any) => `<li>${item.name} - $${item.price}</li>`).join('')}
        </ul>
        <p><strong>Total: $${data.total}</strong></p>
        <p>Order ID: ${data.orderId}</p>
      `,
      shipping_update: (data) => `
        <h2>Your Order Shipped!</h2>
        <p>Your order #${data.orderId} is on its way!</p>
        <p>Tracking Number: ${data.trackingNumber}</p>
        <a href="${data.trackingUrl}">Track your package</a>
      `,
      review_request: (data) => `
        <h2>How was your ${data.productName}?</h2>
        <p>We'd love to hear what you think about your recent purchase.</p>
        <a href="${data.reviewUrl}">Leave a review</a>
      `,
      restock_alert: (data) => `
        <h2>${data.productName} is Back in Stock!</h2>
        <p>The pottery piece you were waiting for is now available.</p>
        <a href="${data.productUrl}">Shop now</a>
      `
    };

    const htmlContent = templates[type]?.(data) || '';

    if (!htmlContent) {
      return res.status(400).json({ error: `Unknown email type: ${type}` });
    }

    // In production, integrate with Resend, SendGrid, or similar
    // For now, we'll log the email payload
    console.log('Email notification queued:', {
      to,
      subject,
      type,
      timestamp: new Date().toISOString()
    });

    // Mock success response
    // Replace with actual email service integration
    return res.status(200).json({
      success: true,
      message: `Email queued: ${subject}`,
      email: {
        to,
        subject,
        type,
        sentAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
