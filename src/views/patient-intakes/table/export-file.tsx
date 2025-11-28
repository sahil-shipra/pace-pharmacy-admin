import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Download, Loader2 } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { useMutation } from "@tanstack/react-query"
import { getPatient } from "../_api"
import { isErrorResponse } from "@/types/common.api"
import { useState } from "react"
import ExportPDF from "./explorable-pdf"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import type { PatientResponse } from "../types"

async function fetchPatient(data: { accountId: number }) {
    const response = await getPatient(data)
    if (isErrorResponse(response)) throw response.error
    return response.data
}

function ExportFile({ accountId }: { accountId: number }) {
    const [isDone, setIsDone] = useState(false)

    const downloadPdf = async (res: PatientResponse) => {
        const fileName = `${res.accounts.holderName.replaceAll(" ", "_")}.pdf`;
        const blob = await pdf(<ExportPDF data={res} />).toBlob();
        saveAs(blob, fileName);
    };

    const { mutate, isPending } = useMutation({
        mutationKey: ['patient', accountId],
        mutationFn: () => fetchPatient({ accountId }),
        onSuccess: async (res) => {
            await downloadPdf(res)
            setIsDone(true)
            setTimeout(() => {
                setIsDone(false)
            }, 1500);
        }
    })
    return (
        <Fragment>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button tabIndex={-1} variant={'ghost'} className="cursor-pointer" size={'icon-sm'} onClick={() => mutate()}>
                        {isPending ? <Loader2 className="animate-spin" /> : isDone ? <Check className="text-theme-green" /> : <Download />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Download Patient Intake Form</p>
                </TooltipContent>
            </Tooltip>
        </Fragment>
    )
}

export default ExportFile