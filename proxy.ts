import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth gerektirmeyen sayfalar
const PUBLIC_ROUTES = ['/login', '/register'];

// Sadece yöneticilerin erişebileceği sayfalar
const ADMIN_ONLY_ROUTES = ['/dashboard', '/students'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public route kontrolü
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  // Tüm Appwrite session cookie'lerini kontrol et
  const cookies = request.cookies;
  const hasSession = Array.from(cookies.getAll()).some(cookie => 
    cookie.name.startsWith('a_session_')
  );
  
  // Eğer kullanıcı giriş yapmamışsa ve public route değilse login'e yönlendir
  if (!hasSession && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Eğer kullanıcı giriş yapmışsa ve login/register sayfasına gitmeye çalışıyorsa activities'e yönlendir
  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL('/activities', request.url));
  }
  
  // Admin route kontrolü burada yapılabilir ama rol bilgisi cookie'de olmadığı için
  // sayfa içinde kontrol yapacağız
  
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
