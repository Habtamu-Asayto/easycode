"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/infrastructure/rbac/api";
import { useAuth } from "@/presentation/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Badge } from "@/presentation/components/ui/badge";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const mutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to change password");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-3xl space-y-6 overflow-auto">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-base">
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and role assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">
                  Full Name
                </Label>
                <p className="text-foreground text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="text-foreground text-sm font-medium">
                  {user?.email}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Roles</Label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {user?.roles?.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role.replace("_", " ").toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">
                Permissions
              </Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {user?.permissions?.map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground text-base">
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPw">Current Password</Label>
                <Input
                  id="currentPw"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={mutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPw">New Password</Label>
                <Input
                  id="newPw"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={mutation.isPending}
                  placeholder="Min 8 chars, uppercase, lowercase, number, special"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPw">Confirm New Password</Label>
                <Input
                  id="confirmPw"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={mutation.isPending}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <EyeOff className="mr-1.5 h-4 w-4" />
                  ) : (
                    <Eye className="mr-1.5 h-4 w-4" />
                  )}
                  {showPasswords ? "Hide" : "Show"} passwords
                </Button>
              </div>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
