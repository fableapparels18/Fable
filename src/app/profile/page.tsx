import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';

interface UserPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export default function ProfilePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let user: UserPayload | null = null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    user = decoded as UserPayload;
  } catch (error) {
    console.error('Invalid token', error);
    redirect('/login');
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
           <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-lg font-mono text-sm">{user.userId}</p>
          </div>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}

