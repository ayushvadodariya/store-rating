import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { SectionCards } from "@/components/admin/SectionCards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { LoaderCircle } from "lucide-react";

function AdminDashboardPage() {
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

  // Format stats for SectionCards
  const formattedStats = [
    { title: "Total Users", value: stats.users.toString(), icon: "users", className: "bg-emerald-500" },
    { title: "Total Stores", value: stats.stores.toString(), icon: "store", className: "bg-blue-500" },
    { title: "Total Ratings", value: stats.ratings.toString(), icon: "star", className: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your system's key metrics and recent activity.
      </p>

      {/* Stats Cards */}
      <SectionCards stats={formattedStats} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest users to join the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[calc(500px-5rem)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
          </CardContent>
        </Card>

        {/* Recent Stores */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Stores</CardTitle>
            <CardDescription>
              Latest stores added to the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[calc(500px-5rem)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardPage;