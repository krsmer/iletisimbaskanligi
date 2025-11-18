'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, TrendingUp, Award } from 'lucide-react';
import {
  getTotalInterns,
  getTodayActiveInterns,
  getTotalActivities,
  getMostActiveIntern,
} from '@/lib/appwrite';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterns: 0,
    todayActive: 0,
    totalActivities: 0,
    mostActiveIntern: { name: '-', count: 0 },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [totalInterns, todayActive, totalActivities, mostActive] =
          await Promise.all([
            getTotalInterns(),
            getTodayActiveInterns(),
            getTotalActivities(),
            getMostActiveIntern(),
          ]);

        setStats({
          totalInterns,
          todayActive,
          totalActivities,
          mostActiveIntern: mostActive,
        });
      } catch (error) {
        console.error('Dashboard yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-8 w-8 border-4 border-[#161F9C] border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Stajyer performans istatistiklerine genel bakış
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Toplam Stajyer
              </CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalInterns}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bugün Aktif
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.todayActive}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Toplam Aktivite
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#161F9C]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalActivities}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                En Aktif Stajyer
              </CardTitle>
              <Award className="h-4 w-4 text-[#00D9FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 truncate">
                {stats.mostActiveIntern.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.mostActiveIntern.count} aktivite
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
