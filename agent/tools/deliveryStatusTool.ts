import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Mock delivery data - in production, this would call a real API
const mockDeliveries: Record<string, any> = {
  '12345': {
    id: '12345',
    status: 'בדרך',
    location: 'תל אביב - מרכז חלוקה',
    estimatedDelivery: '2025-11-10 14:00',
    lastUpdate: '2025-11-09 10:30',
  },
  '67890': {
    id: '67890',
    status: 'נמסר',
    location: 'ירושלים - נמסר בכתובת',
    estimatedDelivery: '2025-11-08 16:00',
    lastUpdate: '2025-11-08 15:45',
  },
};

// Tool for checking delivery status
export const deliveryStatusTool = new DynamicStructuredTool({
  name: 'deliveryStatusTool',
  description: `כלי לבדיקת סטטוס משלוח.
  השתמש בכלי זה כדי:
  - לבדוק את מיקום החבילה הנוכחי
  - לקבל זמן משלוח משוער
  - לראות את העדכון האחרון על המשלוח`,
  schema: z.object({
    shipmentId: z.string().describe('מספר המשלוח/מעקב'),
  }),
  func: async ({ shipmentId }) => {
    try {
      // In production, this would call a real delivery API
      // For example: const response = await fetch(`/api/shipments/${shipmentId}`);
      
      const delivery = mockDeliveries[shipmentId];

      if (delivery) {
        return JSON.stringify({
          success: true,
          data: {
            id: delivery.id,
            status: delivery.status,
            location: delivery.location,
            estimatedDelivery: delivery.estimatedDelivery,
            lastUpdate: delivery.lastUpdate,
          },
          message: `המשלוח ${shipmentId} נמצא כעת ב${delivery.location}. סטטוס: ${delivery.status}`,
        });
      } else {
        return JSON.stringify({
          success: false,
          message: `משלוח מספר ${shipmentId} לא נמצא במערכת. אנא בדוק את המספר ונסה שוב.`,
        });
      }
    } catch (error: any) {
      console.error('Error in deliveryStatusTool:', error);
      return JSON.stringify({
        error: 'שגיאה בבדיקת סטטוס המשלוח',
        details: error.message,
      });
    }
  },
});

