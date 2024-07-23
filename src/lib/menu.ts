import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LayoutList,
  type LucideIcon,
  Image
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Admin",
      menus: [
        {
          href: "/admin/form/",
          label: "Forms",
          active: pathname.startsWith("/admin/form/"),
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "/admin/view/",
          label: "Views",
          active: pathname.startsWith("/admin/view/"),
          icon: LayoutList,
          submenus: []
        },
        {
          href: "/admin/view-component/",
          label: "View Components",
          active: pathname.startsWith("/admin/view-component/"),
          icon: Bookmark,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/admin/entry/",
          label: "Entries",
          active: pathname.includes("/admin/entry/"),
          icon: SquarePen,
          submenus: []
        },
        {
          href: "/admin/file/",
          label: "File",
          active: pathname.includes("/admin/file/"),
          icon: Image,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/admin/user/",
          label: "Users",
          active: pathname.includes("/admin/user/"),
          icon: Users,
          submenus: []
        },
        {
          href: "/admin/account/",
          label: "Account",
          active: pathname.includes("/admin/account/"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}