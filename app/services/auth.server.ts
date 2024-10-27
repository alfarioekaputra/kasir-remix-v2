// app/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { JwtStrategy } from "remix-auth-jwt";
import { SessionStorage } from "@remix-run/node";

export type User = { identity: string; password: string };
export const authenticator = new Authenticator<User>(
  sessionStorage as SessionStorage
);

// The rest of the code above here...
authenticator.use(
  new JwtStrategy(
    {
      algorithms: ["HS256"],
      secret: process.env.SESSION_SECRET as string,
    },
    // Define what to do when the request is authenticated
    async ({ payload }) => {
      // You can access decoded token values here using payload
      // and also use `context` to access more things from the server
      return payload as User;
    }
  ),
  // each strategy has a name and can be changed to use another one
  "jwt"
);
