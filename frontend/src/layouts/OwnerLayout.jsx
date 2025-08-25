import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavItem } from "@/components/nav-item"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Link, Navigate, Outlet, useMatch, useNavigate } from "react-router-dom"
import { MenuIcon, StarHalf, CircleUserRound, UserStar } from "lucide-react"
import useTokenStore from "@/store/tokenStore"
import { useQueryClient } from '@tanstack/react-query'
import { useSyncUser } from "@/hooks/useSyncUser"
import { useUserStore } from "@/store/userStore"
import { ROUTES } from '@/config/routes'
import { Toaster } from "sonner"

function OwnerLayout() {

  useSyncUser();

  const navigate = useNavigate();

  const ratingMatch = useMatch(ROUTES.OWNER.RATINGS);

  const {token, setToken} = useTokenStore((state)=> state);
  const { clearUser } = useUserStore((state) => state);

  const queryClient = useQueryClient();
  
  const handleLogout = () =>{
    setToken("");
    clearUser();
    queryClient.clear();
  }

  const handleProfileClick = () => {
    navigate(ROUTES.OWNER.PROFILE);
  }
  
  if(token === ''){
    return <Navigate to={ROUTES.AUTH.LOGIN} replace/>;
  }

  return (
    <>
      <Toaster 
        position="top-right"
        richColors
        toastOptions={{
          style: {
            zIndex: 9999,
          }
        }}
      />
      <div className="flex min-h-screen w-full">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
              <Link
                to={ROUTES.OWNER.BASE}
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <StarHalf className="h-4 w-4 transition-all group-hover:scale-110" />
                <div className="sr-only">Store Rating</div>
              </Link>
              <NavItem 
                to={ROUTES.OWNER.RATINGS}
                icon={UserStar}
                label="Ratings"
                isActive={!!ratingMatch}
              />
            </TooltipProvider>
          </nav>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    to={ROUTES.OWNER.BASE}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                  >
                    <StarHalf className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Store Rating</span>
                  </Link>
                  <NavItem 
                    to={ROUTES.OWNER.RATINGS}
                    icon={UserStar}
                    label="Ratings"
                    isActive={!!ratingMatch}
                    variant="mobile"
                  />
                </nav>
              </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
              <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <CircleUserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileClick()}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className=" focus:bg-red-500 focus:text-white" onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default OwnerLayout; 