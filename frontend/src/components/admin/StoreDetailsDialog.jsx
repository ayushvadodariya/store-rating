import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Mail,
  Calendar,
  Star,
  User,
  AtSign,
  Home,
  CalendarClock
} from "lucide-react"

function StoreDetailsDialog({ store, isOpen, onOpenChange }) {
  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-semibold">Store Details</DialogTitle>
            <DialogDescription>
              Information about this store.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-2" />

          <div className="py-4 space-y-8">
            {/* Store Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-base font-medium">Store Information</h3>
              </div>

              <div className="bg-muted/30 p-5 rounded-lg space-y-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Store name */}
                  <div className="space-y-1 col-span-full">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      Name
                    </h4>
                    <p className="text-lg font-semibold text-primary">{store.name}</p>
                  </div>

                  {/* Store address */}
                  <div className="space-y-1 col-span-full">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Address
                    </h4>
                    <p className="text-base">{store.address}</p>
                  </div>

                  {/* Contact email */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Contact Email
                    </h4>
                    <p className="text-base break-all">{store.contactEmail || "Not specified"}</p>
                  </div>

                  {/* Created date */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Created
                    </h4>
                    <p className="text-base">
                      {store.createdAt ? format(parseISO(store.createdAt), "MMM d, yyyy") : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Rating section with star visualization */}
                <div className="pt-2 space-y-1">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-muted-foreground" />
                    Rating
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {store.averageRating ? (
                        <div className="bg-primary/10 text-primary rounded-md px-2.5 py-1 font-semibold flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-lg font-mono">{store.averageRating?.toFixed(1)}</span>
                        </div>
                      ) : (
                        <div className="bg-muted rounded-md px-2.5 py-1 font-semibold text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-semibold">{store.totalRatings || 0}</span> reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-base font-medium">Owner Information</h3>
              </div>

              {store.owner ? (
                <div className="bg-muted/30 p-5 rounded-lg space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Owner name */}
                    <div className="space-y-1 col-span-full">
                      <h4 className="text-sm font-medium flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        Name
                      </h4>
                      <p className="text-lg font-semibold">{store.owner.name}</p>
                    </div>

                    {/* Owner email */}
                    <div className="space-y-1 col-span-full">
                      <h4 className="text-sm font-medium flex items-center gap-1.5">
                        <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
                        Email
                      </h4>
                      <p className="text-base break-all">{store.owner.email}</p>
                    </div>

                    {/* Owner address */}
                    {store.owner.address && (
                      <div className="space-y-1 col-span-full">
                        <h4 className="text-sm font-medium flex items-center gap-1.5">
                          <Home className="h-3.5 w-3.5 text-muted-foreground" />
                          Address
                        </h4>
                        <p className="text-base">{store.owner.address}</p>
                      </div>
                    )}

                    {/* Owner joined date */}
                    {store.owner.createdAt && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                          Joined
                        </h4>
                        <p className="text-base">{format(parseISO(store.owner.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-6 rounded-lg text-center shadow-sm">
                  <p className="text-muted-foreground flex flex-col items-center gap-2">
                    <User className="h-8 w-8 text-muted-foreground/50" />
                    No owner assigned to this store
                  </p>
                </div>
              )}
            </div>

            {/* Footer with close button */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => onOpenChange(false)}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default StoreDetailsDialog;