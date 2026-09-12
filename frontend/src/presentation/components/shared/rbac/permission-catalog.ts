export const PERMISSION_ACTIONS = [
  {
    value: "create",
    label: "Create",
    description: "Create new records",
  },
  {
    value: "read",
    label: "Read",
    description: "View and list records",
  },
  {
    value: "update",
    label: "Update",
    description: "Modify existing records",
  },
  {
    value: "delete",
    label: "Delete",
    description: "Delete or deactivate records",
  },
  {
    value: "manage",
    label: "Manage",
    description: "Full administrative control",
  },
  {
    value: "export",
    label: "Export",
    description: "Export records or reports",
  },
  {
    value: "import",
    label: "Import",
    description: "Import records in bulk",
  },
  {
    value: "approve",
    label: "Approve",
    description: "Approve submitted records",
  },
  {
    value: "reject",
    label: "Reject",
    description: "Reject submitted records",
  },
  {
    value: "assign",
    label: "Assign",
    description: "Assign records or responsibility",
  },
  {
    value: "restore",
    label: "Restore",
    description: "Restore archived or deleted records",
  },
  {
    value: "archive",
    label: "Archive",
    description: "Archive records",
  },
  {
    value: "publish",
    label: "Publish",
    description: "Publish records or content",
  },
  {
    value: "execute",
    label: "Execute",
    description: "Run an operation or process",
  },
] as const;

export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[number]["value"];

export function formatPermissionLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildPermissionName(module: string, action: string) {
  if (!module.trim() || !action.trim()) {
    return "";
  }

  return `${module.trim().toLowerCase()}:${action.trim().toLowerCase()}`;
}

export function buildPermissionDisplayName(
  module: string,
  action: string,
) {
  if (!module.trim() || !action.trim()) {
    return "";
  }

  return `${formatPermissionLabel(action)} ${formatPermissionLabel(module)}`;
}

export function normalizePermissionModule(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}