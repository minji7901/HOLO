import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            (
              { name, value }, // TODO: options
            ) => request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (
  //   !user && // 인증되지 않은 사용자
  //   !request.nextUrl.pathname.startsWith("/sign-up") && // 현재 URL이 '/sign-up'이 아닐 때
  //   // !request.nextUrl.pathname.startsWith("/auth") && // 현재 URL이 '/auth'가 아닐 때
  //   !request.nextUrl.pathname.startsWith("/sign-in") // 현재 URL이 '/login'도 아닐 때
  // ) {
  //   // 인증되지 않은 사용자이므로 로그인 페이지로 리디렉션
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/sign-up";
  //   return NextResponse.redirect(url);
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
};

export default updateSession;
