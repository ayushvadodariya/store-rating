import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { format, parseISO } from "date-fns"
import { Star, FilterIcon, LoaderCircle } from 'lucide-react' // Removed Search
import { toast } from "sonner"
import { useOwnerRatings } from "@/hooks/owner/useOwnerRatings"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

function OwnerRatingsPage() {
  // State for filters and pagination
  // Removed search state and debounce
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("date_newest")
  const [minRating, setMinRating] = useState(0)
  const [limit] = useState(10)

  const queryClient = useQueryClient()

  // Fetch ratings data - removed search parameter
  const { data, isLoading, isError, error, refetch } = useOwnerRatings({
    page: currentPage,
    limit,
    sort: sortBy,
    minRating
  })

  // Handle errors
  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load ratings', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => refetch()
        }
      })
    }
  }, [isError, error, refetch])

  // Reset to page 1 when filters change - removed debouncedSearch
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, minRating])

  // Render stars for a rating
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
    <Card className="h-[calc(100vh-100px)]">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Store Ratings
          </CardTitle>
          <CardDescription>
            {data?.totalCount ? (
              <>
                <span className="font-medium">{data.totalCount}</span> {data.totalCount === 1 ? 'rating' : 'ratings'} with
                average score <span className="font-medium">{data.averageRating?.toFixed(1)}</span>
              </>
            ) : (
              "Manage customer feedback and ratings"
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {/* Removed search input */}

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_newest">Newest First</SelectItem>
              <SelectItem value="date_oldest">Oldest First</SelectItem>
              <SelectItem value="rating_highest">Highest Rating</SelectItem>
              <SelectItem value="rating_lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={minRating.toString()} onValueChange={(value) => setMinRating(parseInt(value))}>
                <DropdownMenuRadioItem value="0">All Ratings</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="5">5 Stars Only</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4">4+ Stars</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="3">3+ Stars</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="2">2+ Stars</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="1">1+ Stars</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="overflow-auto h-[calc(100vh-12rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background border-b">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.ratings && data.ratings.length > 0 ? (
                data.ratings.map((rating) => (
                  <TableRow key={rating.id}>
                    <TableCell>
                      <div className="font-medium">{rating.user.name}</div>
                      <div className="text-sm text-muted-foreground">{rating.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renderStars(rating.value)}
                        <Badge>{rating.value}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {rating.comment || <span className="text-muted-foreground italic">No comment</span>}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(rating.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {rating.updatedAt && rating.updatedAt !== rating.createdAt
                        ? format(parseISO(rating.updatedAt), "MMM d, yyyy")
                        : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    {minRating > 0
                      ? "No ratings match your filters"
                      : "No ratings found for your store"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {data?.totalPages > 1 && (
        <CardFooter className="border-t flex justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {data.totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= data.totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.totalPages))}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default OwnerRatingsPage