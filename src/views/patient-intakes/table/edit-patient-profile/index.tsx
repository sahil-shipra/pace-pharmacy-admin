import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, UserRoundPen } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import type { ReactNode } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getPatient, updateAccount } from "../../_api"
import { isErrorResponse } from "@/types/common.api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form"
import AccountInformation from "./account-information"
import Address from "./address"
import MedicalDirector from "./medical-director"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateRequestSchema, type UpdateAccountData } from "./schema"

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
    isFieldEditable?: boolean
    key?: string
}

function InfoSection({ title, items, isEditable }: { title: string, items: InfoItem[], isEditable?: boolean }) {
    if (!items.length) return;
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-theme-green text-xl">{title}</h1>
            <div className="grid grid-cols-2 gap-2">
                {items.map(({ label, value, isFieldEditable }) => (
                    <Fragment key={label}>
                        <div className="text-muted-foreground">{label}</div>
                        <div className="text-sm">
                            {(isEditable && (isFieldEditable === true || isFieldEditable === undefined)) ?
                                <Input value={value as string} /> : value ?? "—"}
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}


const PaymentMethodLabel: Record<string, string> = {
    "visa": 'VISA',
    "mastercard": 'Master Card',
    "amex": 'American Express',
    "bank_transfer": 'E-Transfer'
};


function EditPatientProfile({ accountId }: Props) {
    const [open, onOpenChange] = useState(false)
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['patient', accountId],
        queryFn: () => fetchPatient({ accountId }),
        enabled: open
    })

    const methods = useForm<UpdateAccountData>({
        resolver: zodResolver(updateRequestSchema as any),
        defaultValues: {

        }
    })

    useEffect(() => {
        if (open && isSuccess && data) {
            // Only set fields that match the form's expected value types and structure

            // Sanitize account fields for form (holderName and shippingSameAsBilling)
            const { holderName, shippingSameAsBilling, ...account } = data.accounts ?? {};

            methods.setValue('account', {
                ...account,
                holderName: holderName ?? "",
                // Default to false if null/undefined (since boolean only)
                shippingSameAsBilling: typeof shippingSameAsBilling === 'boolean' ? shippingSameAsBilling : false,
            });

            // Addresses
            if (Array.isArray(data.addresses)) {
                if (data.addresses[0]) methods.setValue('billingAddress', data.addresses[0]);
                if (data.addresses[1]) methods.setValue('shippingAddress', data.addresses[1]);
            }

            // Medical directors
            if (data.medical_directors) {
                methods.setValue('medical_directors', data.medical_directors);
            }
        }

        return () => {
            methods.clearErrors()
            methods.reset()
        }
    }, [data, isSuccess, open])


    const cardNumberDisplay = data?.payment_information
        ? `**** **** **** ${data.payment_information.cardNumberLast4 ?? "----"}`
        : "—"

    const cardExpiryDisplay = data?.payment_information
        ? `${data.payment_information.cardExpiryMonth}/${data.payment_information.cardExpiryYear?.slice(-2) ?? "--"}`
        : "—"

    const queryClient = useQueryClient()
    const { mutate: onUpdateAccount, isPending } = useMutation({
        mutationFn: (data: any) => updateAccount(accountId, data),
        onSuccess() {
            toast.success("Profile updated successfully.")
            queryClient.invalidateQueries({ queryKey: ['patient-intakes'] })
            queryClient.invalidateQueries({ queryKey: ['patient', accountId] })
            methods.reset()
            methods.clearErrors()
            onOpenChange(false)
        },
    })

    const onSubmit = (data: UpdateAccountData) => {
        onUpdateAccount(data)
    };
    console.log(methods.formState.errors)
    return (
        <Fragment>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant={'ghost'} className="cursor-pointer" size={'icon-sm'}>
                                <UserRoundPen />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit Profile</p>
                    </TooltipContent>
                </Tooltip>


                <DialogContent className="min-w-7xl font-enzyme">
                    <DialogHeader>
                        <DialogTitle>
                            Edit Patient Intake Details - {data?.accounts.holderName ?? "Account Holder Name"}
                        </DialogTitle>
                        <DialogDescription className="hidden">
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...methods}>

                        {
                            isLoading && <div className="h-[65dvh] flex justify-center items-center">
                                <Loader2 className="animate-spin text-theme-green size-10" />
                            </div>
                        }

                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                            {isSuccess && data &&
                                <div className="w-full">
                                    <ScrollArea className="h-[65dvh] pr-4 -mr-3">
                                        <Fragment>
                                            <div className="flex justify-center items-start gap-6 divide-x">
                                                <div className="w-1/2 min-h-96 pr-6 space-y-4">
                                                    <AccountInformation />
                                                    <Address />

                                                </div>

                                                <div className="w-1/2 min-h-96 pl-6 flex flex-col gap-8">
                                                    <MedicalDirector />

                                                    <InfoSection
                                                        title="Payment Information"
                                                        items={
                                                            data.payment_information?.paymentMethod === 'bank_transfer' ?
                                                                [
                                                                    { label: "Payment Method", value: PaymentMethodLabel[data.payment_information?.paymentMethod] },
                                                                ]
                                                                :
                                                                [
                                                                    { label: "Payment Method", value: PaymentMethodLabel[data.payment_information?.paymentMethod] },
                                                                    { label: "Card Number", value: cardNumberDisplay },
                                                                    { label: "Card Holder Name", value: data.payment_information?.nameOnCard },
                                                                    { label: "Expiry Date", value: cardExpiryDisplay },
                                                                    { label: "CVV", value: data.payment_information ? "***" : "—" },
                                                                ]}
                                                    />

                                                    <InfoSection
                                                        title="Acknowledgements"
                                                        items={[
                                                            { label: "Financial Responsibility", value: data.acknowledgements?.nameToAcknowledge },
                                                            { label: "Terms Acknowledgement", value: data.accounts.holderName },
                                                        ]}
                                                    />


                                                </div>
                                            </div>
                                        </Fragment>
                                    </ScrollArea>
                                </div>
                            }

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant={"outline"}>
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? <Loader2 className="animate-spin" />
                                        : "Update"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>

        </Fragment >
    )
}

export default EditPatientProfile