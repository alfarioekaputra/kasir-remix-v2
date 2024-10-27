import {
    sessionStorage,
    requireUserSession
} from "~/services/session.server";

import { useState } from "react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
    return await requireUserSession(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = request.headers.get("cookie");
  const session = await sessionStorage.getSession(cookie);
  session.unset("credentials");

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export default function Admin() {
    return (
        <h1>Admin</h1>
    )
}