// This file is no longer in use and has been deprecated.
// The Twilio dependency has been removed from package.json.

export const isTwilioConfigured = false;

export async function sendOtpSms(to: string, otp: string): Promise<void> {
    console.warn("sendOtpSms is deprecated and should not be called.");
    return;
}
