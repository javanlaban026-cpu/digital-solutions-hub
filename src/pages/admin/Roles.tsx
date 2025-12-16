import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Eye, Edit, Trash, FileDown, UserCheck } from "lucide-react";

interface RoleStats {
  admin: number;
  manager: number;
  staff: number;
  user: number;
}

const roles = [
  {
    name: "Admin",
    value: "admin",
    description: "Full system access with all permissions",
    permissions: ["View", "Create", "Edit", "Delete", "Export", "Manage Users", "Manage Roles"],
    color: "bg-red-500/20 text-red-500",
    icon: Shield,
  },
  {
    name: "Manager",
    value: "manager",
    description: "Can manage content and view reports",
    permissions: ["View", "Create", "Edit", "Export"],
    color: "bg-blue-500/20 text-blue-500",
    icon: UserCheck,
  },
  {
    name: "Staff",
    value: "staff",
    description: "Can view and create content",
    permissions: ["View", "Create"],
    color: "bg-green-500/20 text-green-500",
    icon: Users,
  },
  {
    name: "User",
    value: "user",
    description: "Basic read-only access",
    permissions: ["View"],
    color: "bg-gray-500/20 text-gray-400",
    icon: Eye,
  },
];

const permissionIcons: Record<string, typeof Eye> = {
  View: Eye,
  Create: Edit,
  Edit: Edit,
  Delete: Trash,
  Export: FileDown,
  "Manage Users": Users,
  "Manage Roles": Shield,
};

const Roles = () => {
  const [roleStats, setRoleStats] = useState<RoleStats>({
    admin: 0,
    manager: 0,
    staff: 0,
    user: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleStats = async () => {
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role");

        if (error) throw error;

        const stats: RoleStats = {
          admin: 0,
          manager: 0,
          staff: 0,
          user: 0,
        };

        data?.forEach((item) => {
          if (item.role in stats) {
            stats[item.role as keyof RoleStats]++;
          }
        });

        setRoleStats(stats);
      } catch (error) {
        console.error("Error fetching role stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">
            View and understand role-based access control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.value} className="blur-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${role.color}`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {loading ? "..." : roleStats[role.value as keyof RoleStats]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => {
                      const Icon = permissionIcons[permission] || Eye;
                      return (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="flex items-center gap-1.5 py-1"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {permission}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="blur-card border-border">
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              Overview of what each role can do in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                      Permission
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Admin
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Manager
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      Staff
                    </th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {["View", "Create", "Edit", "Delete", "Export", "Manage Users", "Manage Roles"].map(
                    (permission) => (
                      <tr key={permission} className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground">{permission}</td>
                        {roles.map((role) => (
                          <td key={role.value} className="text-center py-3 px-4">
                            {role.permissions.includes(permission) ? (
                              <span className="inline-flex w-6 h-6 rounded-full bg-green-500/20 text-green-500 items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex w-6 h-6 rounded-full bg-muted text-muted-foreground items-center justify-center">
                                -
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Roles;
