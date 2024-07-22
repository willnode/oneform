import { client } from "@/api/client";
import { EditorViewComponentControl } from "@/components/control/FormControl";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { extractFormData } from "@/components/helper";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function NewForm({ value }: any) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    json: any,
    e: React.BaseSyntheticEvent<object, any, HTMLFormElement> | undefined,
  ) {
    try {
      setLoading(true);
      const form: any = extractFormData(new FormData(e?.target));
      let r = await client.api["view-component"].new.$post({
        form,
      });
      let rj = await r.json();
      if (rj.status == "ok") {
        toast("Form is saved");
        window.location.assign(`/admin/view-component/${rj.data}/edit`)
      } else {
        setError(rj.message);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <div>
      <NavigationMenu className="mb-5 mx-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="../"
              className={navigationMenuTriggerStyle()}
            >
              Back
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <EditorViewComponentControl onSubmit={onSubmit} disabled={loading} value={value} />
      <Toaster />
    </div>
  );
}
