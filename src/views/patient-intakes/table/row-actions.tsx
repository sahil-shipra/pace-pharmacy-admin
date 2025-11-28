import type { CellContext } from "@tanstack/react-table"
import ResendAuthEmail from "./resend-auth-email"
import ViewPatientProfile from "./view-patient-profile"
import type { AccountInfo } from "../types"
import ExportForm from "./export-file"
import AccountApproval from "./account-approval"
import EditPatientProfile from "./edit-patient-profile"

interface Props extends CellContext<AccountInfo, unknown> {

}
function RowActions(props: Props) {
    const data = (props.row.original)

    return (
        <div className="flex justify-start items-center gap-1">
            <AccountApproval accountId={data.accountId} isAccountActive={data.isAccountActive ?? false} />
            <EditPatientProfile accountId={data.accountId} />
            <ViewPatientProfile accountId={data.accountId} />
            <ExportForm accountId={data.accountId} />
            {String(data.authStatus) === 'Pending' && <ResendAuthEmail accountId={data.accountId} />}
        </div>
    )
}

export default RowActions