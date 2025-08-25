import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoaderCircle, PlusIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCreateUser } from "@/hooks/admin/user/useAdminCreateUser";

function CreateUserDialog({ isOpen, onOpenChange }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER"
  });

  const { mutate: createUser, isPending: isCreating } = useAdminCreateUser({
    onSuccess: () => {
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER"
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
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
          Create User
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4 relative">
            {/* Loading overlay */}
            {isCreating && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50 rounded-md">
                <div className="flex flex-col items-center gap-2">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Creating user...</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isCreating}
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
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isCreating}
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
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>
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
              ) : "Create User"}
            </Button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default CreateUserDialog;