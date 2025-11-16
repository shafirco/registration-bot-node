import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getGoogleSheetsClient, GOOGLE_SHEETS_CONFIG } from '../config.js';

// Tool for reading and writing customer data to Google Sheets
export const googleSheetsTool = new DynamicStructuredTool({
  name: 'googleSheetsTool',
  description: `כלי לקריאה וכתיבה של מידע לקוחות ב-Google Sheets.
  השתמש בכלי זה כדי:
  - לקרוא מידע על לקוח לפי מספר טלפון
  - לעדכן או להוסיף מידע לקוח חדש
  - לרשום הזמנות ופרטי משלוח`,
  schema: z.object({
    action: z.enum(['read', 'write', 'update']).describe('הפעולה לביצוע: read (קריאה), write (כתיבה), update (עדכון)'),
    phone: z.string().describe('מספר הטלפון של הלקוח'),
    data: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      address: z.string().optional(),
      lastOrder: z.string().optional(),
    }).optional().describe('מידע נוסף על הלקוח (רק לכתיבה ועדכון)'),
  }),
  func: async ({ action, phone, data }) => {
    try {
      const sheets = await getGoogleSheetsClient();
      const { spreadsheetId, customerSheetName } = GOOGLE_SHEETS_CONFIG;

      if (!spreadsheetId) {
        return JSON.stringify({ error: 'Google Spreadsheet ID is not configured' });
      }

      if (action === 'read') {
        // Read customer data
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${customerSheetName}!A:E`,
        });

        const rows = response.data.values || [];
        const customerRow = rows.find((row) => row[1] === phone);

        if (customerRow) {
          return JSON.stringify({
            success: true,
            data: {
              name: customerRow[0],
              phone: customerRow[1],
              email: customerRow[2],
              address: customerRow[3],
              lastOrder: customerRow[4],
            },
          });
        } else {
          return JSON.stringify({
            success: false,
            message: 'לקוח לא נמצא במערכת',
          });
        }
      } else if (action === 'write' || action === 'update') {
        // Write or update customer data
        const newRow = [
          data?.name || '',
          phone,
          data?.email || '',
          data?.address || '',
          data?.lastOrder || new Date().toISOString(),
        ];

        // Check if customer exists
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${customerSheetName}!A:E`,
        });

        const rows = response.data.values || [];
        const rowIndex = rows.findIndex((row) => row[1] === phone);

        if (rowIndex >= 0 && action === 'update') {
          // Update existing row
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${customerSheetName}!A${rowIndex + 1}:E${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [newRow] },
          });

          return JSON.stringify({
            success: true,
            message: 'מידע הלקוח עודכן בהצלחה',
          });
        } else {
          // Append new row
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${customerSheetName}!A:E`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [newRow] },
          });

          return JSON.stringify({
            success: true,
            message: 'לקוח חדש נוסף למערכת',
          });
        }
      }

      return JSON.stringify({ error: 'Invalid action' });
    } catch (error: any) {
      console.error('Error in googleSheetsTool:', error);
      return JSON.stringify({
        error: 'שגיאה בגישה ל-Google Sheets',
        details: error.message,
      });
    }
  },
});

