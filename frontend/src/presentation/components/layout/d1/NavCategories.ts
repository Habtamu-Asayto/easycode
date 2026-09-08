import {
  Users,
  Shield,
  Key,
  FileText,
  LayoutDashboard,
  Map,
  MapPin,
  Building2,
  Home,
  FlaskConical,
  Layers,
  Sprout,
  Sun,
  CalendarRange,
  Warehouse,
  Truck,
  Store,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
};

export type NavCategory = {
  label: string;
  collapsible?: boolean;
  items: NavItem[];
};

export const navCategories: NavCategory[] = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Administration",
    collapsible: true,
    items: [
      {
        label: "Users",
        href: "/users",
        icon: Users,
        permission: "users:read",
      },
      {
        label: "Roles",
        href: "/roles",
        icon: Shield,
        permission: "roles:read",
      },
      {
        label: "Permissions",
        href: "/permissions",
        icon: Key,
        permission: "permissions:read",
      },
      {
        label: "Audit Logs",
        href: "/audit-logs",
        icon: FileText,
        permission: "audit:read",
      },
    ],
  },

  {
    label: "Geography",
    collapsible: true,
    items: [
      {
        label: "Regions",
        href: "/geography/regions",
        icon: Map,
        permission: "geography:read",
      },
      {
        label: "Zones",
        href: "/geography/zones",
        icon: MapPin,
        permission: "geography:read",
      },
      {
        label: "Woredas",
        href: "/geography/woredas",
        icon: Building2,
        permission: "geography:read",
      },
      {
        label: "Kebeles",
        href: "/geography/kebeles",
        icon: Home,
        permission: "geography:read",
      },
    ],
  },

 
];