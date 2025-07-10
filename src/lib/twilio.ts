import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export const isTwilioConfigured = !!(accountSid && authToken && verifyServiceSid);

const client = isTwilioConfigured ? twilio(accountSid, authToken) : null;

// Helper to normalize phone number to E.164 format for Twilio
const normalizePhoneForTwilio = (phone: string): string => {
  if (phone.startsWith('+')) {
    return phone;
  }
  // Assuming Indian numbers if no country code is provided
  return `+91${phone}`;
};


export async function sendVerificationOtp(to: string): Promise<{ success: boolean; message: string }> {
    if (!client || !verifyServiceSid) {
        throw new Error('Twilio Verify is not configured. Please check your environment variables.');
    }

    const normalizedPhone = normalizePhoneForTwilio(to);

    try {
        await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: normalizedPhone, channel: 'sms' });
        
        console.log(`Twilio Verify OTP sent to ${normalizedPhone}`);
        return { success: true, message: 'OTP sent successfully.' };
    } catch (error: any) {
        console.error('Failed to send OTP via Twilio Verify:', error);
        return { success: false, message: error.message || 'Could not send verification code.' };
    }
}

export async function verifyOtp(to: string, code: string): Promise<{ success: boolean; message: string }> {
    if (!client || !verifyServiceSid) {
        throw new Error('Twilio Verify is not configured. Please check your environment variables.');
    }
    
    const normalizedPhone = normalizePhoneForTwilio(to);

    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: normalizedPhone, code: code });

        if (verificationCheck.status === 'approved') {
            return { success: true, message: 'OTP verified successfully.' };
        } else {
            return { success: false, message: 'Invalid OTP.' };
        }
    } catch (error: any) {
        console.error('Failed to verify OTP with Twilio:', error);
        if (error.code === 20404) { // "Invalid parameter: Code"
            return { success: false, message: 'Invalid or expired OTP.' };
        }
        return { success: false, message: 'An error occurred during verification.' };
    }
}
