import { useState, useEffect } from "react";
import { usePublicStores } from "@/hooks/user/usePublicStores";
import { useCreateStoreRating } from "@/hooks/user/useCreateStoreRating";
import { useUpdateUserRating } from "@/hooks/user/useUpdateUserRating";
import { useDeleteUserRating } from "@/hooks/user/useDeleteUserRating";
import { useUserStoreRating } from "@/hooks/user/useUserStoreRating"; // Add this import
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Mail, Store, Search, Loader2, AlertCircle, X } from "lucide-react";
import { format, parseISO } from "date-fns";

function UserHomePage() {
  // Get and set URL search params
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters and pagination
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [sort, setSort] = useState(searchParams.get("sort") || "rating_highest");
  const debouncedSearch = useDebounce(search, 500);

  // State for rating dialog
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [existingRatingId, setExistingRatingId] = useState(null);

  // Fetch stores with current filters
  const {
    data: storesData,
    isLoading,
    isError,
    error
  } = usePublicStores({
    page,
    limit: 8,
    sort,
    search: debouncedSearch,
  });

  // Use the user store rating hook, enabled only when dialog is open and store is selected
  const {
    data: userRating,
    isLoading: isLoadingUserRating,
  } = useUserStoreRating(selectedStore?.id, {
    enabled: isRatingDialogOpen && !!selectedStore?.id,
    onSuccess: (data) => {
      setRatingValue(data.value);
      setRatingComment(data.comment || "");
      setExistingRatingId(data.id);
    },
    onError: (error) => {
      if (error?.response?.status === 404) {
        setRatingValue(5);
        setRatingComment("");
        setExistingRatingId(null);
      } else {
        console.error("Error checking rating:", error);
      }
    }
  });

  // Mutation hooks for ratings
  const { mutate: createRating, isPending: isCreatingRating } = useCreateStoreRating({
    onSuccess: () => {
      setIsRatingDialogOpen(false);
    }
  });

  const { mutate: updateRating, isPending: isUpdatingRating } = useUpdateUserRating({
    onSuccess: () => {
      setIsRatingDialogOpen(false);
    }
  });

  const { mutate: deleteRating, isPending: isDeletingRating } = useDeleteUserRating({
    onSuccess: () => {
      setIsRatingDialogOpen(false);
    }
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (page !== 1) params.set("page", page.toString());
    if (sort !== "rating_highest") params.set("sort", sort);

    // Use replace: true to avoid creating new history entries that could cause navigation issues
    setSearchParams(params, { replace: true });
  }, [search, page, sort, setSearchParams]);

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    const currentSearchParam = searchParams.get("search");
    if (search !== currentSearchParam && search !== "") {
      setPage(1);
    }
  }, [search]);

  // Open dialog and set selected store
  const handleRateStore = (store) => {
    setSelectedStore(store);
    setIsRatingDialogOpen(true);
  };

  // Handle submitting a rating
  const handleSubmitRating = () => {
    if (existingRatingId) {
      updateRating({
        ratingId: existingRatingId,
        ratingData: {
          value: ratingValue,
          comment: ratingComment
        }
      });
    } else {
      createRating({
        storeId: selectedStore.id,
        ratingData: {
          value: ratingValue,
          comment: ratingComment
        }
      });
    }
  };

  // Mutation for deleting a rating
  const queryClient = useQueryClient();

  // Handle deleting a rating
  const handleDeleteRating = () => {
    if (existingRatingId) {
      deleteRating(existingRatingId, {
        onSuccess: (data) => {
          // Reset state
          setRatingValue(5);
          setRatingComment("");
          setExistingRatingId(null);

          // Force complete reset of the query cache for this store
          if (selectedStore?.id) {
            queryClient.invalidateQueries(["user", "store-rating", selectedStore.id]);
            queryClient.removeQueries(["user", "store-rating", selectedStore.id]);
          }

          // Close the dialog to ensure fresh start next time
          setIsRatingDialogOpen(false);
        }
      });
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Reset to first page on new search and update URL
    if (page !== 1) {
      setPage(1);
    } else {
      // If already on page 1, manually trigger the URL update
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sort !== "rating_highest") params.set("sort", sort);
      setSearchParams(params, { replace: true });
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearch("");
    if (page !== 1) {
      setPage(1);
    } else {
      // If already on page 1, manually trigger the URL update
      const params = new URLSearchParams();
      if (sort !== "rating_highest") params.set("sort", sort);
      setSearchParams(params, { replace: true });
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1.5">
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
        <span className="text-sm font-medium">{rating?.toFixed(1) || "N/A"}</span>
      </div>
    );
  };

  // Add this function before your return
  const handleDialogChange = (open) => {
    if (!open) {
      // When closing dialog, just reset local state
      setSelectedStore(null);
      setRatingValue(5);
      setRatingComment("");
      setExistingRatingId(null);
    }
    setIsRatingDialogOpen(open);
  };

  // Sync local rating state with userRating data when dialog opens
  useEffect(() => {
    // Prefill if rating exists
    if (
      isRatingDialogOpen &&
      userRating &&
      userRating.store
    ) {
      setRatingValue(userRating.value);
      setRatingComment(userRating.comment || "");
      setExistingRatingId(userRating.id);
    }
    // Reset if no rating exists
    else if (
      isRatingDialogOpen &&
      !isLoadingUserRating &&
      (!userRating || !userRating.store)
    ) {
      setRatingValue(5);
      setRatingComment("");
      setExistingRatingId(null);
    }
  }, [userRating, isRatingDialogOpen, isLoadingUserRating, selectedStore?.id]);

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">
            Discover and rate stores in your area
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm whitespace-nowrap">
            Sort by:
          </Label>
          <Select value={sort} onValueChange={(value) => {
            setSort(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[180px]" id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_highest">Highest Rated</SelectItem>
              <SelectItem value="rating_lowest">Lowest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search bar - now visible on all screen sizes */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stores by name or address..."
            className="pl-8 pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading stores...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Failed to load stores</h3>
          <p className="text-muted-foreground mb-6">
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Search results message when searching */}
      {!isLoading && !isError && search && (
        <div className="text-sm text-muted-foreground">
          {storesData?.stores?.length === 0 ? (
            <p>No results found for "{search}"</p>
          ) : (
            <p>Showing results for "{search}"</p>
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && storesData?.stores?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Store className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No stores found</h3>
          <p className="text-muted-foreground mb-6">
            {search
              ? `No results found for "${search}". Try a different search term.`
              : "There are no stores available at the moment."}
          </p>
          {search && (
            <Button
              onClick={handleClearSearch}
              variant="outline"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Store grid */}
      {!isLoading && !isError && storesData?.stores?.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {storesData.stores.map((store) => (
              <Card key={store.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-lg">{store.name}</CardTitle>
                  {renderStars(store.ratingStats?.average)}
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{store.address}</span>
                    </div>
                    {store.contactEmail && (
                      <div className="flex gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{store.contactEmail}</span>
                      </div>
                    )}
                    <div className="pt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {store.ratingStats?.count || 0} {store.ratingStats?.count === 1 ? "review" : "reviews"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Added {format(parseISO(store.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    onClick={() => handleRateStore(store)}
                    className="w-full gap-2"
                    disabled={isLoadingUserRating && selectedStore?.id === store.id}
                  >
                    {isLoadingUserRating && selectedStore?.id === store.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4" />
                        {selectedStore?.id === store.id && userRating
                          ? "Edit Your Review"
                          : "Rate this store"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-muted-foreground">
              Showing page {page} of {storesData.totalPages || 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  const newPage = Math.max(1, page - 1);
                  setPage(newPage);
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!storesData?.totalPages || page >= storesData.totalPages}
                onClick={() => {
                  const newPage = Math.min(storesData.totalPages, page + 1);
                  setPage(newPage);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {userRating ? "Edit Your Review" : "Rate this store"}
            </DialogTitle>
            <DialogDescription>
              {selectedStore?.name}
              {userRating && (
                <div className="mt-2 text-xs flex items-center gap-1.5 font-normal">
                  <Badge variant="outline" className="text-xs">
                    You rated this store on {userRating?.updatedAt ?
                      format(parseISO(userRating.updatedAt), "MMM d, yyyy") :
                      format(parseISO(userRating?.createdAt), "MMM d, yyyy")}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoadingUserRating ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Checking your review status...</p>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rating">
                  {userRating ? "Your Previous Rating" : "Your Rating"}
                </Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${star <= ratingValue
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Label htmlFor="comment">
                    {userRating ? "Your Previous Comment" : "Comment (Optional)"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {(userRating ? userRating.comment : ratingComment).length}/400 characters
                  </span>
                </div>
                <Textarea
                  id="comment"
                  placeholder={userRating
                    ? "Update your thoughts about this store..."
                    : "Share your experience with this store..."}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  maxLength={400}
                  rows={5}
                  className={`h-[120px] resize-none ${ratingComment.length >= 380 ? "border-yellow-500 focus-visible:ring-yellow-500" : ""}`}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {userRating && (
              <Button
                variant="destructive"
                onClick={handleDeleteRating}
                disabled={isCreatingRating || isUpdatingRating || isDeletingRating}
              >
                {isDeletingRating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Review"
                )}
              </Button>
            )}
            <Button
              type="submit"
              onClick={handleSubmitRating}
              disabled={isCreatingRating || isUpdatingRating || isDeletingRating}
            >
              {isCreatingRating || isUpdatingRating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {userRating ? "Saving Changes..." : "Submitting..."}
                </>
              ) : (
                userRating ? "Save Changes" : "Submit Rating"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserHomePage;