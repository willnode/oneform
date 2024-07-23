import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


import {
  buttonVariants,
} from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorFileControl } from "@/components/control/FormControl";
import { useState } from "react";
import { toast } from "sonner";
import { client } from "@/api/client";
import { extractFormData, formatBytes } from "@/components/helper";

type Props = {
  list: any[];
};
export default function ListForm({ list }: Props) {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(
    json: any,
    e: React.BaseSyntheticEvent<object, any, HTMLFormElement> | undefined,
  ) {
    try {
      setLoading(true);
      const form: any = extractFormData(new FormData(e?.target));
      let r = await client.api.file.upload.$post({
        form,
      });
      let rj = await r.json();
      if (rj.status == "ok") {
        toast("Form is saved");
        window.location.reload();
      } else {
        setError(rj.message);
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  function onClick() {
    let input = document.querySelector('form input[name=file]') as HTMLInputElement;
    input.onchange = () => {
      requestAnimationFrame(() => {
        document.querySelector('form')?.requestSubmit();
      })
    }
    input.dispatchEvent(new PointerEvent("click"));

  }
  return (
    <>
      <div className="hidden">
        <EditorFileControl value={{}} onSubmit={onSubmit} />
      </div>
      <NavigationMenu className="mb-5 float-end">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              href="/admin/file/new/"
            >
              <Button onClick={onClick}>
                New
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <h1 className="text-2xl mb-5">File List</h1>

      <div className="list-group grid xl:grid-cols-3 md:grid-cols-2 my-3 gap-3">
        {list?.map((view, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{view.name}</CardTitle>
              <CardDescription>{view.created.toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})} - 
                {view.type} - {formatBytes(view.size)}</CardDescription>
            </CardHeader>
            <CardContent>
              {view.type.startsWith('image/') && <img src={`/upload/file/${view.id}/${view.name}`} className="w-100" alt=""/>}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href={`/upload/file/${view.id}/${view.name}`} download>Download</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
