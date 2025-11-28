import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, Check, CircleCheckBig, Loader2 } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime"
import { updateAccountStatus } from "../_api";
import { toast } from "sonner";

interface Props {
    accountId: number
    isAccountActive: boolean
}

function AccountApproval({ accountId, isAccountActive }: Props) {
    const [isDone, setIsDone] = useState(false)
    const queryClient = useQueryClient()
    const { mutate: onUpdateAccountStatus, isPending } = useMutation({
        mutationFn: () => updateAccountStatus({ accountId, isActive: !isAccountActive }),
        onSuccess() {
            toast.success("Profile status updated successfully.")
            queryClient.invalidateQueries({ queryKey: ['patient-intakes'] })
            setIsDone(true)
            setTimeout(() => {
                setIsDone(false)
            }, 1500);
        },
    })
    return (
        <Fragment>
            {isAccountActive ?
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button tabIndex={-1} variant={'ghost'} className="cursor-pointer" size={'icon-sm'} onClick={() => onUpdateAccountStatus()}>
                            {isPending ? <Loader2 className="animate-spin" /> : isDone ? <Check className="text-theme-green" /> : <Ban className="text-destructive" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Deactive Profile</p>
                    </TooltipContent>
                </Tooltip>
                : <Tooltip>
                    <TooltipTrigger asChild>
                        <Button tabIndex={-1} variant={'ghost'} className="cursor-pointer" size={'icon-sm'} onClick={() => onUpdateAccountStatus()}>
                            {isPending ? <Loader2 className="animate-spin" /> : isDone ? <Check className="text-theme-green" /> : <CircleCheckBig className="text-theme-green" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Active Profile</p>
                    </TooltipContent>
                </Tooltip>}
        </Fragment>
    )
}

export default AccountApproval