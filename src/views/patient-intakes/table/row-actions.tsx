import type { CellContext } from "@tanstack/react-table"
import ResendAuthEmail from "./resend-auth-email"
import ViewPatientProfile from "./view-patient-profile"
import type { AccountInfo } from "../types"
import ExportForm from "./export-file"

interface Props extends CellContext<AccountInfo, unknown> {

}
function RowActions(props: Props) {
    const data = (props.row.original)

    return (
        <div className="flex justify-start items-center gap-1">
            <ViewPatientProfile accountId={data.accountId} />
            <ExportForm accountId={data.accountId} />
            {String(data.authStatus) === 'Pending' && <ResendAuthEmail accountId={data.accountId} />}
        </div>
    )
}

export default RowActions