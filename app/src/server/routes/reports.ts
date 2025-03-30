import express, { Request, Response } from 'express';
import {
  generatePDF,
  generateExcel,
  sendReportEmail,
  getReportData,
} from '../api/reports';

const router = express.Router();

// GET /api/reports - Вземане на данни за справката
router.get('/', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end date' });
    }
    const reportData = await getReportData(start as string, end as string);
    res.json(reportData);
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

// POST /api/reports/pdf - Генериране на PDF
router.post('/pdf', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end date' });
    }
    const reportData = await getReportData(start, end);
    const pdfBuffer = await generatePDF(reportData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=financial-report.pdf',
    );
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// POST /api/reports/excel - Генериране на Excel
router.post('/excel', async (req: Request, res: Response) => {
  try {
    const { start, end } = req.body;
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing start or end date' });
    }
    const reportData = await getReportData(start, end);
    const excelBuffer = await generateExcel(reportData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=financial-report.xlsx',
    );
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

// POST /api/reports/email - Изпращане на справка по имейл
router.post('/email', async (req: Request, res: Response) => {
  try {
    const { email, start, end } = req.body;
    if (!email || !start || !end) {
      return res
        .status(400)
        .json({ error: 'Missing email, start, or end date' });
    }
    const reportData = await getReportData(start, end);
    await sendReportEmail(email, reportData);
    res.json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
