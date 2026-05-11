import { useMemo, useState, type FormEvent } from "react"
import {
    Building2,
    Check,
    Mail,
    RotateCcw,
    ShieldCheck,
    UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { useAuth } from "@/hooks/auth/auth-context"

type PreferencesForm = {
    fullName: string
    email: string
    role: string
    defaultLocation: string
    timezone: string
    intakeView: string
    emailNotifications: boolean
    authReminders: boolean
    weeklyDigest: boolean
    compactTables: boolean
    showCompletedIntakes: boolean
}

const defaultPreferences: PreferencesForm = {
    fullName: "Adam",
    email: "",
    role: "Administrator",
    defaultLocation: "all",
    timezone: "america-toronto",
    intakeView: "all",
    emailNotifications: true,
    authReminders: true,
    weeklyDigest: false,
    compactTables: false,
    showCompletedIntakes: true,
}


function PreferencesView() {
    const { user, updateUser } = useAuth()

    const initialPreferences = useMemo<PreferencesForm>(() => {
        const metadata = user?.user_metadata ?? {}
        const fullName =
            metadata.full_name || metadata.name || metadata.display_name || defaultPreferences.fullName

        return {
            ...defaultPreferences,
            fullName,
            email: user?.email ?? defaultPreferences.email,
            role: metadata.role || defaultPreferences.role,
        }
    }, [user])

    const [preferences, setPreferences] = useState<PreferencesForm>(initialPreferences)

    const userInitial = preferences.fullName.trim().charAt(0).toUpperCase() || "A"

    const updatePreference = <K extends keyof PreferencesForm>(
        key: K,
        value: PreferencesForm[K]
    ) => {
        setPreferences((current) => ({
            ...current,
            [key]: value,
        }))
    }

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        updateUser({ name: preferences.fullName })
        toast.success("Preferences saved.")
    }

    const handleReset = () => {
        setPreferences(initialPreferences)
        toast.info("Preferences reset.")
    }

    return (
        <div className="h-full overflow-y-auto">
            <form onSubmit={handleSave} className="container mx-auto pb-8">
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Preferences</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage your profile details, notification settings, and default intake workflow.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={handleReset}>
                            <RotateCcw />
                            Reset
                        </Button>
                        <Button type="submit" className="bg-theme-green hover:bg-theme-green/90">
                            <Check />
                            Save preferences
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-4">
                        <section className="rounded-lg border bg-background">
                            <div className="flex items-center gap-3 p-4">
                                <div className="flex size-10 items-center justify-center rounded-full bg-theme-green-100 text-theme-green">
                                    <UserRound className="size-5 stroke-1" />
                                </div>
                                <div>
                                    <h2 className="font-semibold">Profile</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Keep your administrator details current.
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 p-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full name</Label>
                                    <Input
                                        id="fullName"
                                        value={preferences.fullName}
                                        onChange={(event) => updatePreference("fullName", event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        disabled
                                        id="email"
                                        type="email"
                                        value={preferences.email}
                                        onChange={(event) => updatePreference("email", event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        disabled
                                        id="role"
                                        value={preferences.role}
                                        onChange={(event) => updatePreference("role", event.target.value)}
                                    />
                                </div>

                            </div>
                        </section>


                    </div>

                    <aside className="space-y-4">
                        <section className="rounded-lg border bg-theme-green-50/50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-full bg-theme-green text-lg font-bold text-white">
                                    {userInitial}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate font-semibold">{preferences.fullName}</h2>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {preferences.email || "No email provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="size-4" />
                                        Location
                                    </span>
                                    <span className="font-medium capitalize">
                                        {preferences.defaultLocation === "all"
                                            ? "All"
                                            : preferences.defaultLocation}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="size-4" />
                                        Role
                                    </span>
                                    <span className="font-medium">{preferences.role}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="size-4" />
                                        Alerts
                                    </span>
                                    <span className="font-medium">
                                        {preferences.emailNotifications ? "Enabled" : "Paused"}
                                    </span>
                                </div>
                            </div>
                        </section>

                    </aside>
                </div>
            </form>
        </div>
    )
}

export default PreferencesView
