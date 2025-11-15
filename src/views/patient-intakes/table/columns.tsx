import { type ColumnDef } from "@tanstack/react-table"
import type { AccountInfo } from "../_api"
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import RowActions from "./row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<AccountInfo>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => {
            const date = (getValue())
            return (
                <span>
                    {format(new Date(String(date)), "dd MMM yy, hh:mm a")}
                </span>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "accountHolderName",
        header: "Acc. Holder Name",
    },
    {
        accessorKey: "authStatus",
        header: "Status",
        cell: ({ getValue }) => {
            const status = (getValue())
            return (
                <span className={cn(String(status) === 'Pending' ? "text-destructive" : 'text-theme-green')}>
                    {String(status)}
                </span>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "medicalDirectorName",
        header: "Medical Director Name",
    },
    {
        accessorKey: "medicalDirectorLicense",
        header: "Director's License",
    },
    {
        accessorKey: "medicalDirectorEmail",
        header: "Director's Email",
        cell: ({ getValue, row }) => {
            const email = (getValue() || row.original.accountHolderEmail)
            return (
                <a href={`mailto:${email}`}>
                    {String(email)}
                </a>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: RowActions
    },
]

