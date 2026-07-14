const https = require('https');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const data = body.payload?.data || {};
    const email = data.email;
    const name = (data.name || '').split(' ')[0] || 'melder';

    if (!email) return { statusCode: 200, body: 'No email' };

    const emailBody = JSON.stringify({
      from: 'Lenvi Letselschade <noreply@lenviletselschade.nl>',
      to: [email],
      subject: 'Bevestiging van uw letselschademelding',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <p>Beste ${name},</p>
          <p>Bedankt voor uw melding.</p>
          <p>Wij hebben uw letselschademelding in goede orde ontvangen en nemen <strong>binnen 24 uur</strong> contact met u op.</p>
          <p>In de tussentijd hoeft u niets te doen.</p>
          <p>Heeft u nog vragen? Neem dan gerust contact met ons op via telefoon of WhatsApp.</p>
          <p>Wij helpen u graag verder.</p>
          <p>Met vriendelijke groet,</p>
          <p>
            <strong>Lenvi Letselschade</strong><br>
            📞 +31 6 45 13 46 53<br>
            💬 WhatsApp (ook 's avonds en in het weekend bereikbaar voor dringende zaken)<br>
            ✉️ info@lenviletselschade.nl
          </p>
        </div>
      `
    });

    await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.resend.com',
        port: 443,
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(emailBody)
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          res.statusCode >= 200 && res.statusCode < 300 ? resolve() : reject(new Error(`HTTP ${res.statusCode}`));
        });
      });
      req.on('error', reject);
      req.write(emailBody);
      req.end();
    });

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Email error:', err);
    return { statusCode: 200, body: 'Handled' };
  }
};
