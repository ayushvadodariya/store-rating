import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdminUpdateUser } from "@/hooks/admin/user/useAdminUpdateUser";

function EditUserDialog({ user, isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  // Initialize form data when user changes OR when dialog opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user, isOpen]); // Added isOpen as a dependency

  const { mutate: updateUser, isPending: isUpdating } = useAdminUpdateUser({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return;

    updateUser({
      userId: user.id,
      userData: formData,
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

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : user.role === "OWNER" ? "outline" : "secondary"}
                  className="text-xs"
                >
                  {user.role}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">User role cannot be changed.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isUpdating}
              />
            </div>

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

export default EditUserDialog;