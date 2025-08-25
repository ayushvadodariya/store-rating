import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LoaderCircle, PlusIcon } from "lucide-react"
import { useAdminCreateStore } from "@/hooks/admin/store/useAdminCreateStore"
import { Separator } from "@/components/ui/separator"

function CreateStoreDialog({ isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({
    store: {
      name: "",
      address: "",
      contactEmail: ""
    },
    owner: {
      name: "",
      email: "",
      password: "",
      address: ""
    }
  });

  const { mutate: createStore, isPending: isCreating } = useAdminCreateStore({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({
        store: {
          name: "",
          address: "",
          contactEmail: ""
        },
        owner: {
          name: "",
          email: "",
          password: "",
          address: ""
        }
      });
    }
  });

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      store: {
        ...prev.store,
        [name]: value
      }
    }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      owner: {
        ...prev.owner,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createStore(formData);
  };

  // Prevent dialog from closing during form submission
  const handleOpenChange = (open) => {
    if (isCreating) return; // Don't allow closing while submitting
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusIcon className="h-4 w-4" />
          Create Store
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
            <DialogDescription>
              Add a new store with an owner to the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4 relative">
            {/* Loading overlay */}
            {isCreating && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-md">
                <div className="flex flex-col items-center gap-2">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Creating store...</p>
                </div>
              </div>
            )}

            {/* Store Information Section */}
            <div>
              <h3 className="text-sm font-medium mb-3">Store Information</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    name="name"
                    placeholder="Coffee Shop Downtown"
                    value={formData.store.name}
                    onChange={handleStoreChange}
                    required
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input
                    id="store-address"
                    name="address"
                    placeholder="123 Main St, City"
                    value={formData.store.address}
                    onChange={handleStoreChange}
                    required
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-contactEmail">Contact Email</Label>
                  <Input
                    id="store-contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="contact@store.com"
                    value={formData.store.contactEmail}
                    onChange={handleStoreChange}
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Owner Information Section */}
            <div>
              <h3 className="text-sm font-medium mb-3">Owner Information</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="owner-name">Full Name</Label>
                  <Input
                    id="owner-name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.owner.name}
                    onChange={handleOwnerChange}
                    required
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-email">Email</Label>
                  <Input
                    id="owner-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.owner.email}
                    onChange={handleOwnerChange}
                    required
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-password">Password</Label>
                  <Input
                    id="owner-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.owner.password}
                    onChange={handleOwnerChange}
                    required
                    disabled={isCreating}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-address">Address</Label>
                  <Input
                    id="owner-address"
                    name="address"
                    placeholder="456 Elm St, City"
                    value={formData.owner.address}
                    onChange={handleOwnerChange}
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : "Create Store with Owner"}
            </Button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default CreateStoreDialog;