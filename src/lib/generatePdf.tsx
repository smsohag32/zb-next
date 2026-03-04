import { pdf } from '@react-pdf/renderer';
import React from 'react';
import CustomerInvoicePdf from '@/components/order/CustomerInvoicePdf';

/**
 * Generates a high-quality, small-size vector PDF invoice for the customer.
 * Leverages @react-pdf/renderer for proper Bangla shaping and minimal file size.
 */
export const generateInvoice = async (order: any, storeData: any) => {
   try {
      // 1. Create the PDF blob
      const blob = await pdf(
         <CustomerInvoicePdf order={order} storeData={storeData} />
      ).toBlob();
      const url = URL.createObjectURL(blob);

      // 2. Download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.orderNumber}.pdf`;
      link.click();

      // 3. Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 10000);
   } catch (error) {
      console.error('Failed to generate frontend invoice:', error);
      throw error;
   }
};
