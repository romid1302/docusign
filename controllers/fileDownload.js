const express = require('express');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());

const baseUrl = 'https://demo.docusign.net/restapi/v2.1';

const downloadDocument = async (req, res) => {
  try {
    const envelopeId = req.body.envelopeId;
    const accessToken = req.headers.authorization;

    if (!envelopeId || !accessToken) {
      return res.status(400).json({ error: 'Missing envelopeId or Authorization header.' });
    }

    const url = `${baseUrl}/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/documents/combined`;

    const fetchRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/pdf'
      }
    });

    if (!fetchRes.ok) {
      const errorText = await fetchRes.text();
      console.error('DocuSign error response:', errorText);
      return res.status(fetchRes.status).json({ error: 'Failed to fetch document from DocuSign.' });
    }

    const buffer = Buffer.from(await fetchRes.arrayBuffer());

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=combined.pdf');
    res.send(buffer);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { downloadDocument };