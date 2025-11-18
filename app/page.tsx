import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart3, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A1A2F] via-[#1A2F4F] to-[#2A3F5F]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white">
            Stajyer Performans Takip Sistemi
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            İletişim Başkanlığı stajyer aktivitelerini takip edin ve performansı analiz edin
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Link href="/register">Kayıt Ol</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Activity className="h-10 w-10 text-[#00D9FF] mb-2" />
              <CardTitle className="text-white">Aktivite Takibi</CardTitle>
              <CardDescription className="text-gray-300">
                Günlük aktivitelerinizi kaydedin ve ilerleyişinizi görün
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-[#00D9FF] mb-2" />
              <CardTitle className="text-white">Detaylı Analiz</CardTitle>
              <CardDescription className="text-gray-300">
                Grafikler ve istatistiklerle performansınızı analiz edin
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Users className="h-10 w-10 text-[#00D9FF] mb-2" />
              <CardTitle className="text-white">Yönetici Paneli</CardTitle>
              <CardDescription className="text-gray-300">
                Tüm stajyerlerin performansını tek bir yerden yönetin
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
