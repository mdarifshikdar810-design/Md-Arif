
import { PaymentData } from '../types';
import { PAYMENT_URL } from '../constants';

export const submitPayment = async (data: PaymentData): Promise<string> => {
  const queryParams = new URLSearchParams({
    username: data.username,
    ign: data.ign || '',
    password: data.password || '',
    amount: data.amount.toString(),
    trx: data.trx,
    productNo: data.productNo,
    email: data.email || '',
    senderNumber: data.senderNumber || ''
  });

  try {
    const response = await fetch(`${PAYMENT_URL}?${queryParams.toString()}`, {
      method: 'GET',
      mode: 'no-cors'
    });
    
    return "Submission request sent";
  } catch (error) {
    console.error("Payment submission error:", error);
    throw new Error("Failed to submit payment. Please check your connection.");
  }
};
