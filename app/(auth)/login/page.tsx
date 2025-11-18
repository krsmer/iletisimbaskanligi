'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !email.includes('@')) {
      toast.error('Geçerli bir e-posta adresi giriniz');
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Giriş başarılı!');
        router.push('/activities');
      } else {
        toast.error(result.error || 'Giriş başarısız');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0A1A2F] via-[#1A2F4F] to-[#2A3F5F] p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D9FF] text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-white font-heading font-semibold text-xl">İletişim Başkanlığı</span>
        </div>
        
        <div className="text-white space-y-4">
          <h2 className="text-4xl font-heading font-bold leading-tight">
            Stajyer Performans<br />Takip Sistemi
          </h2>
          <p className="text-gray-300 text-lg">
            Aktivitelerinizi takip edin, performansınızı analiz edin ve gelişiminizi görün.
          </p>
        </div>

        <div className="text-gray-400 text-sm">
          © 2025 İletişim Başkanlığı. Tüm hakları saklıdır.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Hesabınıza Giriş Yapın</h1>
            <p className="text-muted-foreground">E-posta ve şifrenizi girerek giriş yapın</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-posta</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@example.com"
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Şifre</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                />
                <FieldDescription>
                  En az 8 karakter uzunluğunda olmalıdır
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Hesabınız yok mu?{' '}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
