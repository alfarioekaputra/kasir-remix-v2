import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("cookie");
  const session = await sessionStorage.getSession(cookie);
  session.unset("credentials");

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}