import { client } from "@/api/client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");

  async function onSubmit(json: any) {
    setError("");
    let r = await client.api.auth.login.$post({ json });
    let rj = await r.json();
    if (rj.status == "ok") {
      window.location.assign("/");
    } else {
      setError(rj.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="grid gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...control.register("email")}
            type="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            {...control.register("password")}
            type="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <Button>Login</Button>
        {error && <Alert>{error}</Alert>}
      </CardContent>
    </form>
  );
}
