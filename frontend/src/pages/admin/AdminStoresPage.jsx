import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Search, PencilIcon, TrashIcon, LoaderCircle, PlusIcon, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format, parseISO } from "date-fns"
import { useAdminStores } from "@/hooks/admin/store/useAdminStores"
import { useAdminDeleteStore } from "@/hooks/admin/store/useAdminDeleteStore"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import CreateStoreDialog from "@/components/admin/CreateStoreDialog"
import EditStoreDialog from "@/components/admin/EditStoreDialog"
import StoreDetailsDialog from "@/components/admin/StoreDetailsDialog"

function AdminStoresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [deletingStoreId, setDeletingStoreId] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)

  const queryClient = useQueryClient()

  // Fetch all stores
  const { stores, isLoading, isError, error } = useAdminStores({
    name: debouncedSearch,
    sort: "createdAt",
    order: "desc"
  })

  // Delete store mutation
  const { mutate: deleteStore, isPending: isDeleting } = useAdminDeleteStore({
    onSuccess: () => {
      setDeletingStoreId(null)
    }
  })

  // Handle delete confirmation
  const handleDeleteStore = (storeId, storeName) => {
    toast.warning(`Delete ${storeName}?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          setDeletingStoreId(storeId)
          deleteStore(storeId)
        }
      }
    })
  }

  // Handle edit button click
  const handleEditStore = (store) => {
    setSelectedStore(store)
    setIsEditOpen(true)
  }

  // Handle details button click
  const handleViewDetails = (store) => {
    setSelectedStore(store);
    setIsDetailsOpen(true);
  };

  // Error handling for failed fetches
  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load stores', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => queryClient.invalidateQueries({ queryKey: ['admin', 'stores'] })
        }
      })
    }
  }, [isError, error, queryClient])

  return (
    <Card className="h-[calc(100vh-100px)]">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Stores</CardTitle>
          <CardDescription>Manage system stores</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search stores..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <CreateStoreDialog
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
                <TableHead>Address</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores && stores.length > 0 ? (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{store.address}</TableCell>
                    <TableCell>{store.contactEmail || "N/A"}</TableCell>
                    <TableCell>{store.owner?.name || "No Owner"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {store.averageRating?.toFixed(1) || "N/A"} ({store.totalRatings || 0})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {store.createdAt ? format(parseISO(store.createdAt), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {deletingStoreId === store.id ? (
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
                              onClick={() => handleViewDetails(store)}>
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2"
                              onClick={() => handleEditStore(store)}>
                              <PencilIcon className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                              onClick={() => handleDeleteStore(store.id, store.name)}>
                              <TrashIcon className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No stores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Separated dialog components */}
      <EditStoreDialog
        store={selectedStore}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <StoreDetailsDialog
        store={selectedStore}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </Card>
  )
}

export default AdminStoresPage