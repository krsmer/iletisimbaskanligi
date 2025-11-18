'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createActivity, getCurrentUser, getUserProfile } from '@/lib/appwrite';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const activitySchema = z.object({
  category: z.string().min(1, { message: 'Kategori seçiniz' }),
  description: z.string().min(10, { message: 'Açıklama en az 10 karakter olmalıdır' }),
  date: z.date(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const categories = [
  'Yazılım',
  'Tasarım',
  'Analiz',
  'Toplantı',
  'Eğitim',
  'Diğer',
];

export default function NewActivityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [userId, setUserId] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      category: '',
      description: '',
      date: new Date(),
    },
  });

  React.useEffect(() => {
    async function loadUser() {
      const userResult = await getCurrentUser();
      if (userResult.success && userResult.data) {
        setUserId(userResult.data.$id);
        try {
          const profile = await getUserProfile(userResult.data.$id);
          setUserName(profile.name);
        } catch (error) {
          console.error('Profile load error:', error);
        }
      }
    }
    loadUser();
  }, []);

  async function onSubmit(data: ActivityFormValues) {
    setIsLoading(true);
    try {
      const result = await createActivity({
        userId,
        userName,
        category: data.category,
        description: data.description,
        date: data.date.toISOString(),
      });

      if (result.success) {
        toast.success('Aktivite başarıyla eklendi!');
        router.push('/activities');
      } else {
        toast.error(result.error || 'Aktivite eklenemedi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Yeni Aktivite Ekle</CardTitle>
            <CardDescription>
              Günlük çalışmalarınızı ve yaptığınız aktiviteleri kaydedin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Aktivitenizin kategorisini seçin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Açıklama</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bugün neler yaptınız? Detaylı açıklama..."
                          className="min-h-[120px]"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Yaptığınız işi detaylı bir şekilde açıklayın
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tarih</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, 'dd MMMM yyyy', { locale: tr })
                              ) : (
                                <span>Tarih seçiniz</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('2024-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Aktivitenin yapıldığı tarihi seçin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Kaydediliyor...' : 'Aktivite Ekle'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
