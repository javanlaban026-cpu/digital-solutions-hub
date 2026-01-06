import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Shield, UserCheck, Activity, TrendingUp, Clock, Eye, Globe, Zap } from "lucide-react";
import { useRealtimeVisitorStats } from "@/hooks/useRealtimeVisitorStats";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  recentSignups: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    recentSignups: 0,
  });
  const [loading, setLoading] = useState(true);
  const { stats: visitorStats, loading: visitorLoading } = useRealtimeVisitorStats();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Fetch active users
        const { count: activeUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        // Fetch total admins
        const { count: totalAdmins } = await supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");

        // Fetch recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { count: recentSignups } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString());

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalAdmins: totalAdmins || 0,
          recentSignups: recentSignups || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const userStatCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Administrators",
      value: stats.totalAdmins,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "New This Week",
      value: stats.recentSignups,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const visitorStatCards = [
    {
      title: "Live Visitors",
      value: visitorStats.liveVisitors,
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      isLive: true,
    },
    {
      title: "Today's Views",
      value: visitorStats.todayViews,
      icon: Eye,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Today's Visitors",
      value: visitorStats.todayUniqueVisitors,
      icon: Globe,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Total Page Views",
      value: visitorStats.totalViews,
      icon: Activity,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the JL Software Admin Panel
          </p>
        </div>

        {/* Realtime Visitor Stats */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">Real-time Visitor Stats</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visitorStatCards.map((stat) => (
              <Card key={stat.title} className="blur-card border-border relative overflow-hidden">
                {stat.isLive && (
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {visitorLoading ? "..." : stat.value.toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userStatCards.map((stat) => (
              <Card key={stat.title} className="blur-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-heading font-bold text-foreground mt-1">
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="blur-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/users"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Manage Users</span>
                </a>
                <a
                  href="/admin/roles"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Manage Roles</span>
                </a>
                <a
                  href="/admin/settings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-foreground">System Settings</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="blur-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Database</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Realtime Tracking</span>
                  <span className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
