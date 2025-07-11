
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

const FormSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number.'),
  otp: z.string().optional(),
  password: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

type Stage = 'phone' | 'otp' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: '',
      otp: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (stage === 'phone') {
        const res = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, isPasswordReset: true }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message);
        setStage('otp');
        toast({ title: 'OTP Sent', description: 'An OTP has been sent to your phone.' });
      } else if (stage === 'otp') {
        const res = await fetch('/api/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, otp: data.otp }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message);
        setStage('password');
        toast({ title: 'OTP Verified', description: 'Please enter your new password.' });
      } else if (stage === 'password') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, otp: data.otp, newPassword: data.password }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message);
        toast({ title: 'Success!', description: 'Your password has been reset. Please log in.' });
        router.push('/login');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {stage === 'phone' && 'Enter your phone number to receive a verification code.'}
            {stage === 'otp' && `We've sent a code to ${form.getValues('phone')}.`}
            {stage === 'password' && 'Your OTP is verified. Set your new password.'}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {stage === 'phone' && (
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Phone Number</Label>
                      <FormControl>
                        <Input placeholder="Enter your 10-digit phone number" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}

            {stage === 'otp' && (
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
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
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}

            {stage === 'password' && (
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>New Password</Label>
                      <FormControl>
                        <Input type="password" placeholder="Enter your new password" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}

            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="animate-spin" />}
                {stage === 'phone' && 'Send OTP'}
                {stage === 'otp' && 'Verify OTP'}
                {stage === 'password' && 'Reset Password'}
              </Button>
            </CardFooter>
          </form>
        </Form>

        <p className="px-6 pb-4 text-center text-sm">
          <Link href="/login" className="underline hover:text-primary">
            Back to Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
