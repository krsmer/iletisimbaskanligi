'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getCurrentUser,
  getUserProfile,
  getActivityByUser,
  listAllActivities,
  getUserProfilesByIds,
} from '@/lib/appwrite';
import type { Activity } from '@/lib/appwrite';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

interface NotificationActivity extends Activity {
  participantIds?: string[];
}

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationActivity[]>([]);
  const [participantMap, setParticipantMap] = useState<Record<string, string>>({});
  const [isYonetici, setIsYonetici] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const userResult = await getCurrentUser();
        if (!userResult.success || !userResult.data) {
          router.push('/login');
          return;
        }

        const profile = await getUserProfile(userResult.data.$id);
        setIsYonetici(profile.role === 'yonetici');

        let activitiesData: NotificationActivity[] = [];

        if (profile.role === 'yonetici') {
          const allActivities = await listAllActivities(100);
          if (allActivities.success && allActivities.data) {
            activitiesData = allActivities.data.documents.map((doc: any) => ({
              $id: doc.$id,
              userId: doc.userId,
              userName: doc.userName,
              category: doc.category,
              description: doc.description,
              date: doc.date,
              managerComment: doc.managerComment,
              participantIds: Array.isArray(doc.participantIds) && doc.participantIds.length > 0 ? doc.participantIds : [doc.userId],
              participantNames: doc.participantNames,
              $createdAt: doc.$createdAt,
            }));
          }
        } else {
          const activitiesResult = await getActivityByUser(userResult.data.$id);
          if (activitiesResult.success && activitiesResult.data) {
            activitiesData = activitiesResult.data.documents.map((doc: any) => ({
              $id: doc.$id,
              userId: doc.userId,
              userName: doc.userName,
              category: doc.category,
              description: doc.description,
              date: doc.date,
              managerComment: doc.managerComment,
              participantIds: Array.isArray(doc.participantIds) && doc.participantIds.length > 0 ? doc.participantIds : [doc.userId],
              participantNames: doc.participantNames,
              $createdAt: doc.$createdAt,
            }));
          }
        }

        const filtered = activitiesData.filter(
          (activity) => activity.managerComment && activity.managerComment.trim().length > 0
        );

        const participantIds = new Set<string>();
        filtered.forEach((activity) => {
          (activity.participantIds || [activity.userId]).forEach((id) => participantIds.add(id));
        });

        if (participantIds.size > 0) {
          const profiles = await getUserProfilesByIds(Array.from(participantIds));
          const map: Record<string, string> = {};
          Object.values(profiles).forEach((p) => {
            map[p.userId] = p.name;
          });
          setParticipantMap(map);
        }

        setNotifications(filtered);
      } catch (error) {
        console.error('Bildirimler yüklenirken hata:', error);
        toast.error('Bildirimler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [router]);

  const getParticipantNames = (activity: NotificationActivity) => {
    const ids = activity.participantIds && activity.participantIds.length > 0
      ? activity.participantIds
      : [activity.userId];
    return ids
      .map((id) => participantMap[id])
      .filter((name): name is string => Boolean(name));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Bildirimler
          </h1>
          <p className="text-gray-600 mt-1">
            {isYonetici
              ? 'Bıraktığınız tüm yorumları ve ilgili aktiviteleri görüntüleyin.'
              : 'Yöneticinizden gelen yorumlar burada listelenir.'}
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">Bildirimler yükleniyor...</p>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500">
                Henüz görüntülenecek bildirim bulunmuyor.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((activity) => (
              <Card key={activity.$id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{activity.category}</CardTitle>
                    <CardDescription>
                      {format(new Date(activity.date), 'd MMMM yyyy', { locale: tr })}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {activity.participantIds?.length || 1} stajyer
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stajyerler</p>
                    <p className="text-sm text-gray-900">
                      {getParticipantNames(activity).length > 0
                        ? getParticipantNames(activity).join(', ')
                        : activity.participantNames?.join(', ') || 'Bilgi yok'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Aktivite Açıklaması</p>
                    <p className="text-sm text-gray-900">{activity.description}</p>
                  </div>
                  <div className="rounded-md bg-blue-50 p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Yönetici Yorumu</p>
                    <p className="text-sm text-blue-900">{activity.managerComment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
