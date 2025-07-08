import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, ShoppingBag, Phone, Mail } from 'lucide-react';
import type { UserPayload } from '@/lib/auth';


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
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center"><Phone className="mr-2 h-4 w-4" /> Phone Number</p>
                <p className="text-lg pl-6">{user.phone}</p>
            </div>
             {user.email && (
                 <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center"><Mail className="mr-2 h-4 w-4" /> Email</p>
                    <p className="text-lg pl-6">{user.email}</p>
                </div>
            )}
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4" /> User ID</p>
                <p className="text-sm font-mono pl-6">{user.userId}</p>
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
