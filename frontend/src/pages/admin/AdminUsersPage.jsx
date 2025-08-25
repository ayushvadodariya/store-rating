import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Search, PencilIcon, TrashIcon, LoaderCircle } from 'lucide-react'; // Removed UserCog
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format, parseISO } from "date-fns"
import { useAdminUsers } from "@/hooks/admin/user/useAdminUsers"
import { useAdminDeleteUser } from "@/hooks/admin/user/useAdminDeleteUser"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import EditUserDialog from "@/components/admin/EditUserDialog"
import CreateUserDialog from "@/components/admin/CreateUserDialog"

function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const queryClient = useQueryClient()

  const { users, isLoading, isError, error } = useAdminUsers({
    name: debouncedSearch,
    sort: "createdAt",
    order: "desc"
  })

  const { mutate: deleteUser, isPending: isDeleting } = useAdminDeleteUser({
    onSuccess: () => {
      setDeletingUserId(null)
    }
  })

  const handleDeleteUser = (userId, userName) => {
    toast.warning(`Delete ${userName}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingUserId(userId)
          deleteUser(userId)
        }
      }
    })
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load users', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
        }
      })
    }
  }, [isError, error, queryClient])

  return (
    <Card className="h-[calc(100vh-100px)]">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage system users</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CreateUserDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
          />
        </div>
      </CardHeader>

      <CardContent className="overflow-auto h-[calc(100vh-10rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background border-b">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : user.role === "OWNER" ? "outline" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{user.address}</TableCell>
                    <TableCell>
                      {user.createdAt ? format(parseISO(user.createdAt), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {deletingUserId === user.id ? (
                        <LoaderCircle className="animate-spin h-4 w-4 text-muted-foreground" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2"
                              onClick={() => handleEditUser(user)}>
                              <PencilIcon className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleDeleteUser(user.id, user.name)}>
                              <TrashIcon className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                            {/* Removed Change Role menu item */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <EditUserDialog
        user={selectedUser}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  )
}

export default AdminUsersPage