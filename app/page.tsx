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
        const user = await getCurrentUser();
        if (user) {
          // Kullanıcı giriş yapmış, rolüne göre yönlendir
          const profile = await getUserProfile();
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
