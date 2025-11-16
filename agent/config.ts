import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets configuration
export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
  customerSheetName: 'Customers',
  chatLogSheetName: 'ChatLogs',
};

// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
  try {
    // Check if Google Sheets is properly configured
    if (!process.env.GOOGLE_SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error('Google Sheets not configured');
    }

    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (parseError) {
      throw new Error('Invalid Google Service Account Key format');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });
    
    return sheets;
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    throw error;
  }
}

// System prompt for the agent
export const SYSTEM_PROMPT = `דבר רק בעברית. אתה עוזר בשם A.B Deliveries.
ענה ללקוחות על שאלות לגבי סטטוס משלוחים, הצעות להזמנות חדשות, ותמיכה כללית.
תשובותיך צריכות להיות מנומסות, חכמות, ותמיד לכלול עידוד חיובי להזמנה נוספת.
אם יש צורך לבדוק סטטוס משלוח, השתמש בכלי deliveryStatusTool.
אם יש צורך לעדכן או לרשום מידע על לקוח, השתמש בכלי googleSheetsTool.
אם יש הודעה מהלקוח, רשום אותה עם messageTool.`;

