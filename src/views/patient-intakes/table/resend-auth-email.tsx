import { Button } from "@/components/ui/button"
import { Check, Loader2, Mail } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMutation } from "@tanstack/react-query"
import { resendAuthEmail } from "../_api"
import { useState } from "react"
import { toast } from "sonner"

function ResendAuthEmail({ accountId }: { accountId: number }) {
    const [isDone, setIsDone] = useState(false)
    const { mutate: onSend, isPending } = useMutation({
        mutationFn: () => resendAuthEmail({ accountId }),
        onSuccess() {
            toast.success("Authentication email sent successfully.")
            setIsDone(true)
            setTimeout(() => {
                setIsDone(false)
            }, 1500);
        },
    })
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button tabIndex={-1} variant={'ghost'} className="cursor-pointer" size={'icon-sm'} onClick={() => onSend()}>
                    {isPending ? <Loader2 className="animate-spin" /> : isDone ? <Check className="text-theme-green" /> : <Mail />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Resend Auth Email</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default ResendAuthEmail