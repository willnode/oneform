import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/sidebar/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebarToggle, useStore } from "@/lib/hooks";

export function SheetMenu() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  
  if(!sidebar) return null;

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <a href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <h1 className="font-bold text-lg">OneForm</h1>
            </a>
          </Button>
        </SheetHeader>
        <Menu isOpen pathname="menu" />
      </SheetContent>
    </Sheet>
  );
}