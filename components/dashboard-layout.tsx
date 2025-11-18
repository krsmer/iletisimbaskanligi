'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { getCurrentUser, getUserProfile } from '@/lib/appwrite';
import type { UserProfile } from '@/lib/appwrite';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUser() {
      try {
        const userResult = await getCurrentUser();
        
        if (!userResult.success || !userResult.data) {
          router.push('/login');
          return;
        }

        const profileResult = await getUserProfile(userResult.data.$id);
        
        if (profileResult.success && profileResult.data) {
          setUserProfile(profileResult.data);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-12 w-[250px]" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar userProfile={userProfile} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
