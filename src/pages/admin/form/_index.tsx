import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";


import {
  buttonVariants,
} from "@/components/ui/button";

type Props = {
  list: any[];
};
export default function ListForm({ list }: Props) {
  return (
    <>
      <NavigationMenu className="mb-5 float-end">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/form/new"
              className={buttonVariants({})}
            >
              New
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href="/api/auth/logout"
              className={navigationMenuTriggerStyle()}
            >
              Logout
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>

      <h1 className="text-2xl mb-5">Form List</h1>

      <div className="list-group grid xl:grid-cols-3 md:grid-cols-2 my-3 gap-3">
        {list?.map((form) => (
          <Button variant="outline" asChild>
            <a href={`/form/${form.id}/edit`}>{form.title}</a>
          </Button>
        ))}
      </div>
    </>
  );
}
