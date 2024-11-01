import { sessionStorage, requireUserSession } from "~/services/session.server";

import { useState } from "react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { ModeToggle } from "~/components/mode-toggle";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Separator } from "~/components/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { Outlet } from "@remix-run/react";

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
    <>
        <SidebarProvider>
            <AppSidebar />
            <Outlet />
        </SidebarProvider>
    </>
  );
}
