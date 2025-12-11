import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Loader2 } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import type { ReactNode } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getPatient } from "../_api"
import { isErrorResponse } from "@/types/common.api"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PatientResponse } from "../types"
import { format } from "date-fns"
import ResendAuthEmail from "./resend-auth-email"
import ExportForm from "./export-file"
import PaymentInformation from "./payment-information"

interface Props {
    accountId: number
}

async function fetchPatient(data: { accountId: number }) {
    const response = await getPatient(data)
    if (isErrorResponse(response)) throw response.error
    return response.data
}

type InfoItem = {
    label: string
    value?: ReactNode
}

function InfoSection({ title, items }: { title: string, items: InfoItem[] }) {
    if (!items.length) return;
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-theme-green text-xl">{title}</h1>
            <div className="grid grid-cols-2 gap-2">
                {items.map(({ label, value }) => (
                    <Fragment key={label}>
                        <div className="text-muted-foreground">{label}</div>
                        <div>{value ?? "—"}</div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export const ProvincesEnum = {
    alberta: "Alberta",
    british_columbia: "British Columbia",
    manitoba: "Manitoba",
    new_brunswick: "New Brunswick",
    newfoundland_and_labrador: "Newfoundland and Labrador",
    nova_scotia: "Nova Scotia",
    ontario: "Ontario",
    prince_edward_island: "Prince Edward Island",
    quebec: "Quebec",
    saskatchewan: "Saskatchewan",
};

export function formatAddress(address?: PatientResponse["addresses"][number]) {
    if (!address) return "—"
    return [
        address.addressLine1,
        address.addressLine2,
        address.city,
        ProvincesEnum[address.province as keyof typeof ProvincesEnum],
        address.postalCode,
    ]
        .filter(Boolean)
        .join(", ")
}


function ViewPatientProfile({ accountId }: Props) {
    const [open, onOpenChange] = useState(false)
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['patient', accountId],
        queryFn: () => fetchPatient({ accountId }),
        enabled: open
    })

    const billingAddress = data?.addresses?.find(address => address.addressType?.toLowerCase() === "billing") ?? data?.addresses?.[0]
    const shippingAddress = data?.addresses?.find(address => address.addressType?.toLowerCase() === "shipping") ?? data?.addresses?.[1]

    return (
        <Fragment>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant={'ghost'} className="cursor-pointer" size={'icon-sm'}>
                                <Eye />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Profile</p>
                    </TooltipContent>
                </Tooltip>


                <DialogContent className="min-w-7xl font-enzyme">
                    <DialogHeader>
                        <DialogTitle>
                            New Patient Intake Details - {data?.accounts.holderName ?? "Account Holder Name"}
                        </DialogTitle>
                        <DialogDescription className="hidden">
                        </DialogDescription>
                    </DialogHeader>
                    {
                        isLoading && <div className="h-[65dvh] flex justify-center items-center">
                            <Loader2 className="animate-spin text-theme-green size-10" />
                        </div>
                    }

                    {isSuccess && data &&
                        <div className="w-full">
                            <div className="h-14 border-y mb-4 flex justify-between items-center">
                                <div className="text-lg">
                                    {data.applications &&
                                        <Fragment>
                                            Application Submission Date : <strong>{
                                                format(
                                                    new Date(data.applications?.submittedDate ?? data.accounts.createdAt),
                                                    "dd MMM yy"
                                                )
                                            }</strong>
                                        </Fragment>
                                    }
                                </div>

                                <div className="flex justify-end items-center gap-2">
                                    {data.applications && data.applications.isSubmitted === false &&
                                        <Fragment>
                                            <div className="flex justify-end items-center gap-1">
                                                <div className="size-3 bg-amber-500 rounded-full animate-pulse" />
                                                <div className="mt-0.5">Auth Pending</div>
                                            </div>
                                            <ResendAuthEmail accountId={data.accounts.id} />
                                        </Fragment>
                                    }

                                    {data.applications && data.applications.isSubmitted === true &&
                                        <div className="flex justify-end items-center gap-1">
                                            <div className="size-3 bg-lime-500 rounded-full animate-pulse" />
                                            <div className="mt-0.5">Auth Completed</div>
                                        </div>
                                    }

                                    <ExportForm accountId={data.accounts.id} />

                                </div>
                            </div>
                            <ScrollArea className="h-[65dvh]">
                                <Fragment>
                                    <div className="flex justify-center items-start gap-6 divide-x">
                                        <div className="w-1/2 min-h-96 pr-6">
                                            <InfoSection
                                                title="Account Information"
                                                items={[
                                                    { label: "Account Holder", value: data.accounts.holderName },
                                                    { label: "License", value: data.accounts.designation },
                                                    { label: "Clinic / Organization", value: data.accounts.organizationName },
                                                    { label: "Billing Address", value: formatAddress(billingAddress) },
                                                    { label: "Shipping Address", value: formatAddress(shippingAddress) },
                                                    { label: "Phone", value: data.accounts.phone },
                                                    { label: "Email Address", value: data.accounts.emailAddress },
                                                ]}
                                            />
                                        </div>

                                        <div className="w-1/2 min-h-96 pl-6 flex flex-col gap-8">
                                            <PaymentInformation paymentInformation={data.payment_information} />

                                            <InfoSection
                                                title="Acknowledgements"
                                                items={[
                                                    { label: "Financial Responsibility", value: data.acknowledgements?.nameToAcknowledge },
                                                    { label: "Terms Acknowledgement", value: data.accounts.holderName },
                                                ]}
                                            />

                                            <InfoSection
                                                title="Medical Director Information"
                                                items={[
                                                    { label: "Director Name", value: data.medical_directors?.name },
                                                    { label: "License", value: data.medical_directors?.licenseNo },
                                                    {
                                                        label: "Single Person Application",
                                                        value: data.medical_directors
                                                            ? (data.medical_directors.isAlsoMedicalDirector ? "Yes" : "No")
                                                            : "—"
                                                    },
                                                    { label: "Medical Director's Email", value: data.medical_directors?.email },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </Fragment>

                            </ScrollArea>
                        </div>
                    }
                </DialogContent>
            </Dialog>

        </Fragment>
    )
}

export default ViewPatientProfile