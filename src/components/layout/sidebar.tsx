import { useMemo } from "react"
import { Link, useMatchRoute } from "@tanstack/react-router"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Users2, type LucideIcon } from "lucide-react"

interface MenuItem {
    name: string
    url: string
    icon: LucideIcon
}

const menuItems: MenuItem[] = [
    {
        name: "Patient Intake",
        url: "/",
        icon: Users2,
    },
]

function AppSidebar() {
    const matchRoute = useMatchRoute()

    const menus = useMemo(
        () =>
            menuItems.map((menu) => ({
                ...menu,
                isActive: matchRoute({ to: menu.url, fuzzy: false }) !== false,
            })),
        [matchRoute]
    )

    return (
        <Sidebar>
            <SidebarHeader className="p-0">
                <div className="min-h-20 border-b flex justify-center items-center">
                    <img
                        src="/logo.png"
                        alt="pace-pharmacy-logo"
                        className="h-18 w-full"
                        loading="lazy"
                    />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menus.map((menu) => {
                                const Icon = menu.icon
                                return (
                                    <SidebarMenuItem key={menu.name}>
                                        <SidebarMenuButton
                                            asChild
                                        >
                                            <Link to={menu.url} className="bg-theme-green-100 hover:bg-theme-green-200 text-theme-green font-bold text-sm flex justify-start items-center">
                                                <Icon className="size-4" />
                                                <span>{menu.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar