
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const PhoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.'),
});

const OTPSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits.'),
});

const NewPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type Stage = 'phone' | 'otp' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const phoneForm = useForm<z.infer<typeof PhoneSchema>>({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: { otp: '' },
  });

  const passwordForm = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '' },
  });

  const handleSendOtp = async (data: z.infer<typeof PhoneSchema>) => {
    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone, isPasswordReset: true }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      
      setPhone(data.phone);
      setStage('otp');
      toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (data: z.infer<typeof OTPSchema>) => {
    setIsVerifyingOtp(true);
    try {
        const res = await fetch('/api/auth/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp: data.otp }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message);
        
        setOtp(data.otp);
        setStage('password');
        toast({ title: 'OTP Verified', description: 'Please enter your new password.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (data: z.infer<typeof NewPasswordSchema>) => {
    setIsResettingPassword(true);
     try {
        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp, newPassword: data.password }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message);
        
        toast({ title: 'Success!', description: 'Your password has been reset. Please log in.' });
        router.push('/login');
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
        setIsResettingPassword(false);
    }
  };
  
  const renderStage = () => {
    switch (stage) {
      case 'phone':
        return (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handleSendOtp)}>
              <CardContent className="grid gap-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Phone Number</Label>
                      <FormControl>
                        <Input placeholder="Enter your 10-digit phone number" {...field} disabled={isSendingOtp} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isSendingOtp}>
                  {isSendingOtp ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        );
      case 'otp':
        return (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)}>
              <CardContent className="grid gap-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Enter OTP</Label>
                       <FormControl>
                        <Input
                          type="text"
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="6-digit OTP"
                          {...field}
                          disabled={isVerifyingOtp}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isVerifyingOtp}>
                   {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        );
      case 'password':
        return (
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handleResetPassword)}>
              <CardContent className="grid gap-4">
                 <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>New Password</Label>
                       <FormControl>
                        <Input type="password" placeholder="Enter your new password" {...field} disabled={isResettingPassword} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                 <Button className="w-full" type="submit" disabled={isResettingPassword}>
                   {isResettingPassword ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        );
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {stage === 'phone' && 'Enter your phone number to receive a verification code.'}
            {stage === 'otp' && `We've sent a code to ${phone}.`}
            {stage === 'password' && 'Your OTP is verified. Set your new password.'}
          </CardDescription>
        </CardHeader>
        {renderStage()}
         <p className="px-6 pb-4 text-center text-sm">
            <Link href="/login" className="underline hover:text-primary">
                Back to Login
            </Link>
        </p>
      </Card>
    </div>
  );
}
