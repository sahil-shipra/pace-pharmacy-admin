import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth/auth-context";
import { Link } from "@tanstack/react-router";
import {
    ChevronDown,
    ChevronUp,
    LogOut,
    Settings2,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ComplexDropdownMenu() {
    const [open, onOpenChange] = useState(false)
    const { signOut, user } = useAuth()
    const onLogout = async () => await signOut()

    const { name, email } = useMemo(() => {
        const metadata = user?.user_metadata ?? {}
        const fullName =
            metadata.full_name || metadata.name || metadata.display_name || user?.email || 'User'

        return {
            name: fullName,
            email: user?.email || ''
        }
    }, [user])

    return (
        <div className="min-h-20 border-b">
            <div className="flex justify-end items-center h-18 pr-10 w-full">
                <DropdownMenu open={open} onOpenChange={onOpenChange}>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                        <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {name[0] || email[0] || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-start flex flex-col">
                            <p className="text-sm font-medium">{name}</p>
                        </div>
                        {open ? <ChevronUp className="size-5" /> : <ChevronDown className="ml-auto size-5" />}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-2 w-72 mr-4">
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard/preferences">
                                <Settings2 className="mr-1" /> Preferences
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={onLogout}>
                            <LogOut className="mr-1" /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
