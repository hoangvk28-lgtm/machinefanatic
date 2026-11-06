import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Scraper/SEO-tool bots and generic HTTP clients: no referral traffic, but they
// crawl thousands of guide URLs and drive billed ISR Reads / Fast Origin Transfer.
// Search + AI-search crawlers (Googlebot, Bingbot, GPTBot, ClaudeBot...) are not listed.
const BLOCKED_USER_AGENTS = /Bytespider|CCBot|PetalBot|AhrefsBot|SemrushBot|MJ12bot|DotBot|BLEXBot|DataForSeoBot|Barkrowler|serpstatbot|SeekportBot|ImagesiftBot|Amazonbot|meta-externalagent|Sogou|YisouSpider|Baiduspider|AliyunSecBot|HeadlessChrome|python-requests|python-urllib|aiohttp|httpx|Go-http-client|Scrapy|curl\/|wget|node-fetch|axios|okhttp|Java\/|libwww-perl/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BLOCKED_USER_AGENTS.test(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Protect all /admin routes except the login page
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("ss_admin_session");
    if (!sessionCookie?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("ss_admin_session");
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Admin auth + bot blocking on pages; skip static assets so they don't cost an invocation.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|css|js)$).*)",
  ],
};
