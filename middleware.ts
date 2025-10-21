// /middleware.ts
// gemini-chatbot의 기존 내용을 다 지우고 이 코드로 덮어쓰세요.

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPass = process.env.BASIC_AUTH_PASS;

  // 1. BASIC_AUTH 변수가 설정되어 있을 때만 암호를 실행
  if (basicAuthUser && basicAuthPass) {
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      try {
        const [user, pass] = atob(authValue).split(':');
        // 2. ID/PW가 일치하면 통과
        if (user === basicAuthUser && pass === basicAuthPass) {
          return NextResponse.next();
        }
      } catch (e) {
        console.error('Auth header decoding failed:', e);
      }
    }
    // 3. ID/PW가 없거나 틀리면 팝업창 띄움
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }
  // 4. BASIC_AUTH 변수 자체가 없으면 그냥 통과
  return NextResponse.next();
}

// 5. 팝업창 무한반복을 막기 위해 필수 파일들은 검사에서 제외
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
};
