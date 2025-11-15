import type { CellContext } from "@tanstack/react-table"
import type { AccountInfo } from "../_api"
import { Button } from "@/components/ui/button"
import { Download, Eye, Mail } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props extends CellContext<AccountInfo, unknown> {

}
function RowActions(props: Props) {
    const data = (props.row.original)
    return (
        <div className="flex justify-start items-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'ghost'} className="cursor-pointer" size={'icon-sm'}>
                        <Eye />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View Profile</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'ghost'} className="cursor-pointer" size={'icon-sm'}>
                        <Download />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>View Profile</p>
                </TooltipContent>
            </Tooltip>

            {String(data.authStatus) === 'Pending' && <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={'ghost'} className="cursor-pointer" size={'icon-sm'}>
                        <Mail />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Resend Auth Email</p>
                </TooltipContent>
            </Tooltip>}
        </div>
    )
}

export default RowActions