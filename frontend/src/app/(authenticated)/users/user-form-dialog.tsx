"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usersApi, rolesApi } from "@/infrastructure/rbac/api";
import {
  regionsApi 
} from "@/infrastructure/geography/api/geography.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/domain/rbac/entities";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = !!user;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Geography cascading state
  const [regionId, setRegionId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [woredaId, setWoredaId] = useState("");
  const [kebeleId, setKebeleId] = useState("");

  const { data: rolesData } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => rolesApi.getAll({ limit: 100 }),
    enabled: open,
  });

  const { data: regions } = useQuery({
    queryKey: ["regions-lookup"],
    queryFn: () => regionsApi.lookup(),
    enabled: open,
  });
   useEffect(() => {
    if (open) {
      if (user) {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUsername(user.username ?? "");
        setEmail(user.email);
        setMobileNumber(user.mobileNumber ?? "");
        setPassword("");
        setSelectedRoles(user.roles?.map((r) => r.id) || []);
        // Set geography (cascade will auto-load children)
        setRegionId(user.region?.id ?? "");
        setZoneId(user.zone?.id ?? "");
        setWoredaId(user.woreda?.id ?? "");
        setKebeleId(user.kebele?.id ?? "");
      } else {
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setMobileNumber("");
        setPassword("");
        setSelectedRoles([]);
        setRegionId("");
        setZoneId("");
        setWoredaId("");
        setKebeleId("");
      }
    }
  }, [open, user]);

  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: () => {
      toast.success("User created successfully");
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.update(user!.id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      onSuccess();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user");
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const geoFields = {
      regionId: regionId || null,
      zoneId: zoneId || null,
      woredaId: woredaId || null,
      kebeleId: kebeleId || null,
    };

    if (isEdit) {
      updateMutation.mutate({
        firstName,
        lastName,
        email,
        mobileNumber: mobileNumber || null,
        roleIds: selectedRoles,
        ...geoFields,
      });
    } else {
      createMutation.mutate({
        firstName,
        lastName,
        username,
        email,
        password,
        mobileNumber: mobileNumber || null,
        roleIds: selectedRoles,
        ...geoFields,
      });
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user details and role assignments."
              : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+251 or 09..."
                disabled={isLoading}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEdit}
                  disabled={isLoading}
                  placeholder="Min 8 chars, uppercase, lowercase, number, special"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Geography assignment */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Geography Assignment
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={regionId}
                  onValueChange={(v) => {
                    setRegionId(v ?? "");
                    setZoneId("");
                    setWoredaId("");
                    setKebeleId("");
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions?.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Zone</Label>
                <Select
                  value={zoneId}
                  onValueChange={(v) => {
                    setZoneId(v ?? "");
                    setWoredaId("");
                    setKebeleId("");
                  }}
                  disabled={isLoading || !regionId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        regionId ? "Select zone" : "Select region first"
                      }
                    />
                  </SelectTrigger>
                  
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Woreda</Label>
                <Select
                  value={woredaId}
                  onValueChange={(v) => {
                    setWoredaId(v ?? "");
                    setKebeleId("");
                  }}
                  disabled={isLoading || !zoneId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        zoneId ? "Select woreda" : "Select zone first"
                      }
                    />
                  </SelectTrigger>
                  
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kebele</Label>
                <Select
                  value={kebeleId}
                  onValueChange={(v) => setKebeleId(v ?? "")}
                  disabled={isLoading || !woredaId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        woredaId ? "Select kebele" : "Select woreda first"
                      }
                    />
                  </SelectTrigger>
                  
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Roles</Label>
            <ScrollArea className="h-36 rounded-md border p-3">
              <div className="space-y-2">
                {rolesData?.data?.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 rounded p-1.5 hover:bg-accent cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                      disabled={isLoading}
                    />
                    <div>
                      <span className="text-sm font-medium">
                        {role.name.replace("_", " ")}
                      </span>
                      {role.description && (
                        <p className="text-xs text-muted-foreground">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
