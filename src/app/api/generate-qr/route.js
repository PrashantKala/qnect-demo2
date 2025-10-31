import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

// --- NODEMAILER SETUP ---
// This is the most complex part. You MUST use an email service.
// For testing, you can use a "throwaway" Gmail account with an "App Password".
// 1. Go to your Google Account -> Security -> 2-Step Verification (must be ON)
// 2. Go to "App Passwords"
// 3. Create a new password for "Mail" on "Other (Custom name)" -> "QNect App"
// 4. Use the 16-character password it gives you below.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'prasahnt.golu12@gmail.com',     // <-- REPLACE THIS
    pass: 'szsgiruqixjoimhy', // <-- REPLACE THIS
  },
});
// -------------------------

// Your backend server
const BACKEND_API_URL = 'https://qnect-backend.onrender.com/api';

export async function POST(request) {
  try {
    // 1. --- Verify User is Logged In ---
    const headersList = request.headers;
    const authHeader = headersList.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    const userEmail = decoded.email;
    if (!userId || !userEmail) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 2. --- Create New QR Record in Backend ---
    const newQrId = uuidv4();
    const backendResponse = await axios.post(
      `${BACKEND_API_URL}/qrs/create`,
      { qrId: newQrId },
      { headers: { Authorization: `Bearer ${token}` } } // Pass the token to the backend
    );
    if (backendResponse.status !== 201) {
      throw new Error('Could not create QR record in backend.');
    }

    // 3. --- Generate PDF ---
    const qrDataUrl = await QRCode.toDataURL(`https://qnect.com/c/${newQrId}`, {
      width: 400,
      margin: 2,
    });
    
    // Load logo image (must be in /public folder)
    const logoPath = path.join(process.cwd(), 'public', 'Qnect.jpg');
    const logoImageBytes = await fs.readFile(logoPath);

    // Create a new PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    // Embed the logo
    const logoImage = await pdfDoc.embedJpg(logoImageBytes);
    page.drawImage(logoImage, {
      x: width / 2 - 50,
      y: height - 150,
      width: 100,
      height: 100,
    });
    
    // Embed the QR Code
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImage, {
      x: width / 2 - 150,
      y: height - 500,
      width: 300,
      height: 300,
    });

    // Add Tagline
    page.drawText("Cars can't talk, but QNect can.", {
      x: width / 2 - 120,
      y: height - 180,
      size: 16,
      color: rgb(0.04, 0.14, 0.28), // primary-blue
    });
    
    // Add instructions
    page.drawText('Print this, cut it out, and place it on your dashboard.', {
      x: width / 2 - 160,
      y: height - 550,
      size: 14,
      color: rgb(0.42, 0.46, 0.49), // text-secondary
    });

    const pdfBytes = await pdfDoc.save();

    // 4. --- Email the PDF to the User ---
    await transporter.sendMail({
      from: '"QNect Support" <YOUR_EMAIL@gmail.com>', // <-- REPLACE THIS
      to: userEmail,
      subject: 'Your QNect QR Code is Ready!',
      html: `
        <p>Hi there,</p>
        <p>Thank you for purchasing your QNect QR! Please find your printable QR code attached to this email.</p>
        <p>Your next step is to download the <strong>QNect App</strong> from the app store to activate your QR and start receiving calls.</p>
        <p>Thanks,<br/>The QNect Team</p>
      `,
      attachments: [
        {
          filename: 'QNect_QR.pdf',
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    });

    // 5. --- Send Success Response to Frontend ---
    return NextResponse.json({ message: 'Success! QR generated and emailed.' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}