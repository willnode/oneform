import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function FormNavbar({ page }: { page: string }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="../"
            className={navigationMenuTriggerStyle()}
          >
            Back
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="./edit"
            className={navigationMenuTriggerStyle()}
            active={page === "edit"}
          >
            Edit
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="./view"
            className={navigationMenuTriggerStyle()}
            active={page === "view"}
          >
            View
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="./entries"
            className={navigationMenuTriggerStyle()}
            active={page === "entries"}
          >
            Entries
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="./formats"
            className={navigationMenuTriggerStyle()}
            active={page === "formats"}
          >
            Formats
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="./hooks"
            className={navigationMenuTriggerStyle()}
            active={page === "hooks"}
          >
            Hooks
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}