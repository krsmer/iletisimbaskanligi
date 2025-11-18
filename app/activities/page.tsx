'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser, getActivityByUser } from '@/lib/appwrite';
import type { Activity } from '@/lib/appwrite';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Plus, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<string>('');

  React.useEffect(() => {
    async function loadActivities() {
      try {
        const userResult = await getCurrentUser();
        
        if (!userResult.success || !userResult.data) {
          router.push('/login');
          return;
        }

        setUserId(userResult.data.$id);
        
        const activitiesResult = await getActivityByUser(userResult.data.$id);
        
        if (activitiesResult.success && activitiesResult.data) {
          const activitiesData = activitiesResult.data.documents.map((doc: any) => ({
            $id: doc.$id,
            userId: doc.userId,
            userName: doc.userName,
            category: doc.category,
            description: doc.description,
            date: doc.date,
            $createdAt: doc.$createdAt,
            $updatedAt: doc.$updatedAt,
          }));
          setActivities(activitiesData);
        }
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadActivities();
  }, [router]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Yazılım': 'bg-blue-500',
      'Tasarım': 'bg-purple-500',
      'Analiz': 'bg-green-500',
      'Toplantı': 'bg-yellow-500',
      'Eğitim': 'bg-red-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Aktivitelerim</h1>
            <p className="text-muted-foreground">
              Tüm aktivitelerinizi görüntüleyin ve yönetin
            </p>
          </div>
          <Button asChild>
            <Link href="/activities/new">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Aktivite
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Toplam Aktivite
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activities.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bu Hafta
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activities.filter(a => {
                  const activityDate = new Date(a.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return activityDate > weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Kategoriler
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(activities.map(a => a.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktivite Listesi</CardTitle>
            <CardDescription>
              Son eklenen aktiviteleriniz tarih sırasına göre
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Henüz aktivite eklemediniz
                </p>
                <Button asChild>
                  <Link href="/activities/new">
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Aktivitenizi Ekleyin
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Açıklama</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.$id}>
                      <TableCell className="font-medium">
                        {format(new Date(activity.date), 'dd MMMM yyyy', { locale: tr })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(activity.category)}>
                          {activity.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {activity.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
