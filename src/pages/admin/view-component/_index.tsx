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
              href="/admin/view-component/new/"
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

      <h1 className="text-2xl mb-5">View Component List</h1>

      <div className="list-group grid xl:grid-cols-3 md:grid-cols-2 my-3 gap-3">
        {list?.map((view, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{view.title}</CardTitle>
              <CardDescription>{view.identifier}</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href={`/admin/view-component/${view.id}/edit`}>Edit</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/admin/view-component/${view.id}/builder`}>Builder</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
