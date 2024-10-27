import { zodResolver } from "@hookform/resolvers/zod"
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Api from "~/api"
import {
    sessionStorage
} from "~/services/session.server";

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"

const formSchema = z.object({
  identity: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identity: "",
            password: "",
        },
    })
    return (
        <>
            <div className="flex items-center justify-center bg-cover bg-center h-screen">
                <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                    <Form {...form}>
                    <form method="post" className="space-y-8">
                        <FormField
                        control={form.control}
                        name="identity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Input Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit">Login</Button>
                    </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: ActionFunctionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  // return await authenticator.authenticate("jwt", request, {
  //   successRedirect: "/dashboard",
  //   failureRedirect: "/login",
  // });
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const identity = body.get("identity");
  const password = body.get("password");
  console.log(identity);
  const payload = {
    identity,
    password,
  };

  console.log(typeof identity);

  const api = new Api();
  try {
    const response = await api.loginUser(payload);
    const sessionPayload = {
      token: response.data.token,
      user: {
        email: response.data.record.email,
        name: response.data.record.name,
      },
    };

    session.set("credentials", sessionPayload);
    return redirect("/admin/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error: any) {
    console.log(error);
    return json("error.response");
  }
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  // return await authenticator.isAuthenticated(request, {
  //   successRedirect: "/dashboard",
  // });
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await sessionStorage.getSession(cookie);

  // if the user is logged in, redirect them to the dashboard
  if (session.has("credentials")) {
    return redirect("/admin/dashboard");
  } else {
    return json({ message: "Please login" });
  }
}