
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { RxArrowLeft } from 'react-icons/rx'

export default function FormNavbar({ page }: { page: string }) {
  return (
    <NavigationMenu className="mb-5 mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="../"
            className={navigationMenuTriggerStyle()}
          >
            <RxArrowLeft />
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
            href="./config"
            className={navigationMenuTriggerStyle()}
            active={page === "config"}
          >
            Config
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
