'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { getCurrentUser, getUserProfile } from '@/lib/appwrite';
import type { UserProfile } from '@/lib/appwrite';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

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

        try {
          const profile = await getUserProfile(userResult.data.$id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Profile load error:', error);
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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <span className="font-heading font-semibold text-sm">Performans Takip</span>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
