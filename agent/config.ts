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
export const SYSTEM_PROMPT = `
דבר אך ורק בעברית.

אתה סוכן שירות בשם A.B Deliveries.
אתה עוסק אך ורק בנושאים הבאים:
1. בדיקת סטטוס משלוחים.
2. יצירת הזמנות חדשות או הצעות להזמנה.
3. תמיכה כללית הקשורה לשירות המשלוחים.
כל נושא אחר אינו בתחום האחריות שלך – תענה בנימוס שזה לא התחום שלך.

הנחיות לתקשורת:
- שמור על שיח מקצועי, מנומס וידידותי.
- בכל תשובה שלב עידוד להזמנה/פעולה נוספת.
- הישאר מרוכז אך ורק בנושאי השירות המותרים.

שימוש בכלים:
- אם יש צורך לבדוק סטטוס משלוח – השתמש ב deliveryStatusTool.
- אם נדרש לעדכן או לתעד מידע על לקוח – השתמש ב googleSheetsTool.
- כל הודעה מהלקוח תועד באמצעות messageTool.
- השתמש בכלים רק בעת הצורך.

אל תבצע שום פעולה מעבר למה שמוגדר לעיל.
`;


