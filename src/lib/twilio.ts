import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export const isTwilioConfigured = !!(accountSid && authToken && twilioPhoneNumber);

const client = isTwilioConfigured ? twilio(accountSid, authToken) : null;

export async function sendOtpSms(to: string, otp: string): Promise<void> {
    if (!client || !twilioPhoneNumber) {
        throw new Error('Twilio is not configured. Please check your environment variables.');
    }

    try {
        await client.messages.create({
            body: `Your FableFront verification code is: ${otp}`,
            from: twilioPhoneNumber,
            to: to,
        });
        console.log(`OTP SMS sent to ${to}`);
    } catch (error) {
        console.error('Failed to send OTP SMS via Twilio:', error);
        // Depending on requirements, you might want to re-throw or handle this differently
        throw new Error('Could not send verification code.');
    }
}
