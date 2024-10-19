import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
    const cookie = request.cookies.get("token");

    console.log("cookie", cookie);
    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtected && !cookie) {
        const absoluteUrl = new URL("/", request.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
