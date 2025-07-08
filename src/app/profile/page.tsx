import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ShoppingBag } from 'lucide-react';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
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
  
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
            </Avatar>
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <CardDescription>Welcome back to your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono">{user.userId}</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" asChild>
              <Link href="/profile/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Order History
              </Link>
          </Button>

          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
}
