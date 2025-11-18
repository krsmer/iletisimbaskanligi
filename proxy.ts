import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth gerektirmeyen sayfalar
const PUBLIC_ROUTES = ['/login', '/register'];

// Sadece yöneticilerin erişebileceği sayfalar
const ADMIN_ONLY_ROUTES = ['/dashboard', '/students'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Şimdilik tüm route'lara izin ver, auth kontrolünü sayfa içinde yap
  // Çünkü Appwrite localStorage kullanıyor, cookie'de session yok
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
