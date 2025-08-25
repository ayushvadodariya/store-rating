import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { LoaderCircle, ArrowRight, Users, Store, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function AdminHomePage() {
  const { stats, recentUsers, recentStores, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
        <p className="text-muted-foreground mb-4">
          {error.message || "There was a problem fetching dashboard data."}
        </p>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Create stats cards that fit content better
  const statsCards = [
    {
      title: "Total Users",
      value: stats.users.toString(),
      icon: <Users className="h-5 w-5 text-white" />,
      className: "bg-emerald-500",
      link: "/admin/users"
    },
    {
      title: "Total Stores",
      value: stats.stores.toString(),
      icon: <Store className="h-5 w-5 text-white" />,
      className: "bg-blue-500",
      link: "/admin/stores"
    },
    {
      title: "Total Ratings",
      value: stats.ratings.toString(),
      icon: <Star className="h-5 w-5 text-white" />,
      className: "bg-orange-500",
      link: "/admin/ratings"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your system's key metrics and recent activity.
      </p>

      {/* Stats Cards with better sizing */}
      <div className="flex flex-wrap gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="w-[180px] border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${stat.className}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-3xl font-bold">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest users to join the platform
            </CardDescription>
          </CardHeader>

          <div className="relative">
            <CardContent className="p-0 h-[320px] overflow-hidden">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background border-b">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-auto">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "ADMIN" ? "destructive" :
                              user.role === "OWNER" ? "default" : "secondary"}
                            className="font-medium"
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(user.createdAt), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Smaller gradient fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </CardContent>

            {/* View All button with less bottom padding */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="gap-1 shadow-sm">
                  View All Users <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Recent Stores */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Recent Stores</CardTitle>
            <CardDescription>
              Latest stores added to the platform
            </CardDescription>
          </CardHeader>

          <div className="relative">
            <CardContent className="p-0 h-[320px] overflow-hidden">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-background border-b">
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-auto">
                  {recentStores.length > 0 ? (
                    recentStores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{store.owner?.name || "No Owner"}</TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {store.contactEmail}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(store.createdAt), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No stores found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Smaller gradient fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </CardContent>

            {/* View All button with less bottom padding */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
              <Link to="/admin/stores">
                <Button variant="outline" size="sm" className="gap-1 shadow-sm">
                  View All Stores <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminHomePage;