import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdatePassword } from "@/hooks/useUpdatePassword";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  User, Mail, MapPin, CalendarDays, Star,
  Building, Shield, LoaderCircle, Edit, ArrowRight, X, Save,
  KeyRound, Eye, EyeOff, LockKeyhole
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ProfilePage() {
  const {
    profile,
    isAdmin,
    isOwner,
    isUser,
    ratingStats,
    recentRatings,
    hasRatings,
    isLoading,
    isError,
    error,
    refetch
  } = useUserProfile();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Set initial form data when profile loads or dialog opens
  useEffect(() => {
    if (profile && isEditDialogOpen) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || ""
      });
    }
  }, [profile, isEditDialogOpen]);

  // Setup update profile mutation
  const updateProfileMutation = useUpdateProfile({
    onSuccess: () => {
      setIsEditDialogOpen(false);
      refetch(); // Refresh profile data
    }
  });

  // Setup update password mutation
  const updatePasswordMutation = useUpdatePassword({
    onSuccess: () => {
      setIsPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: ""
      });
    }
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear password error when any field changes
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // Only include fields with values in the update
    const dataToUpdate = {};
    if (formData.name && formData.name !== profile.name) dataToUpdate.name = formData.name;
    if (formData.email && formData.email !== profile.email) dataToUpdate.email = formData.email;
    if (formData.address && formData.address !== profile.address) dataToUpdate.address = formData.address;

    // Only proceed if there's data to update
    if (Object.keys(dataToUpdate).length > 0) {
      updateProfileMutation.mutate(dataToUpdate);
    } else {
      toast.info("No changes to update");
      setIsEditDialogOpen(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Validate password isn't empty
    if (!passwordData.newPassword) {
      setPasswordError("New password cannot be empty");
      return;
    }

    // Submit password update
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load profile", {
      description: error?.message || "Please try again later",
    });

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Profile</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          {error?.message || "There was a problem loading your profile."}
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPasswordDialogOpen(true)}
            className="gap-2"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </Button>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Full Name</p>
                <p className="text-sm text-muted-foreground">{profile?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Email</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Address</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.address || "No address provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium leading-none">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(profile?.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Type Section */}
          <div>
            <h3 className="text-sm font-medium mb-3">Account Type</h3>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge variant="destructive" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Administrator
                </Badge>
              )}
              {isOwner && (
                <Badge variant="default" className="gap-1">
                  <Building className="h-3 w-3" />
                  Store Owner
                </Badge>
              )}
              {isUser && (
                <Badge variant="secondary" className="gap-1">
                  <User className="h-3 w-3" />
                  Customer
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Statistics Card - Only show for users */}
      {isUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Ratings
            </CardTitle>
            <CardDescription>
              {hasRatings
                ? `You've rated ${ratingStats.count} ${ratingStats.count === 1 ? 'store' : 'stores'} with an average of ${ratingStats.averageRating.toFixed(1)}`
                : "You haven't rated any stores yet"}
            </CardDescription>
          </CardHeader>

          {hasRatings && (
            <>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Store</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRatings.map((rating) => (
                      <TableRow key={rating.id}>
                        <TableCell className="font-medium">
                          {rating.store.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {renderStars(rating.value)}
                            <span className="text-sm font-medium">{rating.value}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {rating.comment || <span className="text-muted-foreground italic">No comment</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(rating.createdAt), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/30 p-3">
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link to={ROUTES.USER.BASE}>
                    Browse More Stores <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </>
          )}

          {!hasRatings && (
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't rated any stores yet. Rating stores helps others discover great places.
              </p>
              <Button asChild>
                <Link to={ROUTES.USER.HOME}>
                  Browse Stores to Rate
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* Admin Dashboard Link */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              Manage users, stores, and system settings
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <Button size="lg" asChild>
              <Link to={ROUTES.ADMIN.BASE}>
                Go to Admin Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Store Owner Section */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Store Management
            </CardTitle>
            <CardDescription>
              Manage your store and view customer ratings
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to={ROUTES.OWNER.BASE}>
                  Store Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={ROUTES.OWNER.RATINGS}>
                  View Ratings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and a new password below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordError ? "border-destructive" : ""}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className="gap-2"
              >
                {updatePasswordMutation.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage;