// app/services/session.server.ts
import {
  createCookieSessionStorage,
  redirect,
  SessionStorage,
} from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";

type SessionData = {
  credentials: {
    token: string;
    user: {
      email: string;
      // name: string;
    };
  };
};

type SessionFlashData = {
  error: string;
};

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 1000 * 60 * 60,
    secrets: [process.env.SESSION_SECRET as string],
    secure: true,
  },
});

// export sessionStorage;

export async function requireUserSession(request: Request) {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await sessionStorage.getSession(cookie);

  // check if session has the credentials
  if (!session.has("credentials")) {
    console.log(session.get("credentials"));

    // if there is no user session, redirect to login
    throw redirect("/login");
  }

  return session;
}

export const themeSessionResolver = createThemeSessionResolver(
  sessionStorage as SessionStorage
);
