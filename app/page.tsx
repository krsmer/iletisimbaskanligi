'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/appwrite';
import { ROLES } from '@/utils/roles';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const userResult = await getCurrentUser();
        if (userResult.success && userResult.data) {
          // Kullanıcı giriş yapmış, rolüne göre yönlendir
          const profile = await getUserProfile(userResult.data.$id);
          if (profile.role === ROLES.YONETICI) {
            router.replace('/dashboard');
          } else {
            router.replace('/activities');
          }
        } else {
          // Giriş yapılmamış, login'e yönlendir
          router.replace('/login');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        // Hata durumunda login'e yönlendir
        router.replace('/login');
      }
    };

    redirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin h-10 w-10 border-4 border-[#161F9C] border-t-transparent rounded-full"></div>
    </div>
  );
}
