import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  Building2,
  Wallet,
  BarChart3,
  type LucideIcon,
  Shield,
  Key,
  FileText,
  MapPin,
  Home,
  MapIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  // icon: React.ComponentType<{ className?: string }>;
  permission?: string;
};

export type NavCategory = {
  label: string;
  collapsible?: boolean;
  items: NavItem[];
};

export const navCategories: NavCategory[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Appointments",
        href: "/appointments",
        icon: CalendarDays,
        badge: "12",
        permission: "appointment:read",
      },
      {
        label: "Patients",
        href: "/patients",
        icon: Users,
        permission: "appointment:read",
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
        icon: MapIcon,
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

  {
    label: "Clinical",
    collapsible: true,
    items: [
      {
        label: "Doctors",
        href: "/doctors",
        icon: Stethoscope,
        permission: "appointment:read",
      },
      {
        label: "Diagnostics",
        href: "/diagnostics",
        icon: FlaskConical,
        badge: "4",

        permission: "appointment:read",
      },
      {
        label: "Pharmacy",
        href: "/pharmacy",
        icon: Pill,
        permission: "appointment:read",
      },
    ],
  },
  {
    label: "Management",
    collapsible: true,
    items: [
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
        permission: "appointment:read",
      },
      {
        label: "Billing",
        href: "/billing",
        icon: Wallet,
        permission: "appointment:read",
      },
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
        permission: "appointment:read",
      },
    ],
  },
];

export const currentUser = {
  firstName: "Amara",
  lastName: "Bekele",
  email: "amara.bekele@medicare.io",
  role: "Clinic Administrator",
};
