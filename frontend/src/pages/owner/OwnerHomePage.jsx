import { useOwnerDashboard } from "@/hooks/owner/useOwnerDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { LoaderCircle, Store, Star, Mail, Calendar, MapPin, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

function OwnerHomePage() {
  // Change this line - get the specific properties instead of 'data'
  const { storeInfo, ratingStats, recentActivity, isLoading, error } = useOwnerDashboard();

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

  // Remove this line - we're already destructuring at the top
  // const { storeInfo, ratingStats, recentActivity } = data;

  // Render stars for ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating || 0)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Store Dashboard</h1>
      <p className="text-muted-foreground">
        Overview of your store's performance and customer ratings.
      </p>

      {/* Store Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Details about your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Store Name</p>
                <p className="text-sm text-muted-foreground">{storeInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Address</p>
                <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Contact Email</p>
                <p className="text-sm text-muted-foreground">{storeInfo.contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Created On</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(storeInfo.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Overview</CardTitle>
          <CardDescription>
            Summary of customer ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                <span className="text-4xl font-bold">{ratingStats.averageRating.toFixed(1)}</span>
                <div className="my-2">{renderStars(ratingStats.averageRating)}</div>
                <span className="text-sm text-muted-foreground">
                  Based on {ratingStats.totalRatings} {ratingStats.totalRatings === 1 ? 'rating' : 'ratings'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.distribution[star] || 0;
                const percentage = ratingStats.totalRatings
                  ? Math.round((count / ratingStats.totalRatings) * 100)
                  : 0;

                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="flex items-center w-10">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex w-16 justify-between text-sm">
                      <span>{count}</span>
                      <span className="text-muted-foreground">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rating Trend Card */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rating Trend
            </CardTitle>
            <CardDescription>
              Monthly rating performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[calc(500px-5rem)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Ratings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.ratingTrend.length > 0 ? (
                  recentActivity.ratingTrend.map((trend, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {trend.month} {trend.year}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStars(trend.average)}
                          <span className="font-medium">{trend.average.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{trend.count}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No rating trends available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Ratings Card */}
        <Card className="h-[500px] overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Ratings
            </CardTitle>
            <CardDescription>
              Latest customer reviews
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-grow">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.latestRatings.length > 0 ? (
                  recentActivity.latestRatings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium">
                        {rating.user.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStars(rating.value)}
                          <span className="font-medium">{rating.value}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(parseISO(rating.createdAt), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      No ratings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t bg-muted/10 p-3">
            <Button variant="ghost" size="sm" asChild className="ml-auto">
              <Link to={ROUTES.OWNER.RATINGS}>
                View All Ratings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default OwnerHomePage;