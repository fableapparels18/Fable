import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// A simple check to see if the core variables are present.
export const isTwilioConfigured = !!(accountSid && authToken && twilioPhoneNumber);

const client = isTwilioConfigured ? twilio(accountSid, authToken) : null;

/**
 * Sends an OTP SMS using Twilio.
 * If Twilio is not configured, it will log the OTP to the console as a fallback.
 * @param to The recipient's phone number. Should not include the leading '+'.
 * @param otp The 6-digit one-time password.
 */
export async function sendOtpSms(to: string, otp: string): Promise<void> {
  if (!client) {
    console.warn("Twilio is not configured. Falling back to console log for OTP.");
    // --- MOCK OTP SENDING ---
    console.log(`\n\n--- FableFront Registration OTP (Twilio not configured) ---`);
    console.log(`To: ${to}`);
    console.log(`OTP: ${otp}`);
    console.log(`This will expire in 5 minutes.`);
    console.log(`----------------------------------------------------------\n\n`);
    return;
  }
  
  // IMPORTANT: Twilio requires phone numbers in E.164 format (e.g., +11234567890).
  // This code assumes the user's phone number needs a '+' prepended if not present.
  const formattedTo = to.startsWith('+') ? to : `+${to}`;

  try {
    await client.messages.create({
      body: `Your FableFront verification code is: ${otp}. This code expires in 5 minutes.`,
      from: twilioPhoneNumber!,
      to: formattedTo,
    });
    console.log(`OTP sent to ${formattedTo} via Twilio.`);
  } catch (error) {
    console.error('Failed to send SMS via Twilio:', error);
    // Re-throwing the error allows the calling API route to handle it and return a proper response.
    throw new Error('Failed to send OTP message via Twilio.');
  }
}
