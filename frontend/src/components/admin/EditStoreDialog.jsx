import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LoaderCircle } from "lucide-react"
import { useAdminUpdateStore } from "@/hooks/admin/store/useAdminUpdateStore"

function EditStoreDialog({ store, isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactEmail: ""
  });

  // Initialize form data when store changes
  useEffect(() => {
    if (store && isOpen) {
      setFormData({
        name: store.name || "",
        address: store.address || "",
        contactEmail: store.contactEmail || ""
      });
    }
  }, [store, isOpen]);

  const { mutate: updateStore, isPending: isUpdating } = useAdminUpdateStore({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!store) return;

    updateStore({
      storeId: store.id,
      storeData: formData,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Prevent dialog from closing during form submission
  const handleOpenChange = (open) => {
    if (isUpdating) return; // Don't allow closing while submitting
    onOpenChange(open);
  };

  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4 relative">
            {/* Loading overlay */}
            {isUpdating && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-md">
                <div className="flex flex-col items-center gap-2">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Updating store...</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-name">Store Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Coffee Shop Downtown"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contactEmail">Contact Email</Label>
              <Input
                id="edit-contactEmail"
                name="contactEmail"
                type="email"
                placeholder="contact@store.com"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

            {store?.owner && (
              <div className="space-y-2">
                <Label>Store Owner</Label>
                <div className="p-2 border rounded-md bg-muted/20">
                  <p className="font-medium">{store.owner.name}</p>
                  {store.owner.email && (
                    <p className="text-sm text-muted-foreground">{store.owner.email}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Owner cannot be changed here
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default EditStoreDialog;