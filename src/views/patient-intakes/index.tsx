import { CircleCheck, ClipboardClock, ClipboardList } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    useQuery,
} from '@tanstack/react-query'
import { getAllPatient, type AuthStatusType, type PreferredLocationType, type QueryParams } from "./_api";
import { isErrorResponse } from "@/types/common.api";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";


async function fetchPatientIntakes(params: QueryParams) {
    const response = await getAllPatient(params);
    if (isErrorResponse(response)) throw response.error
    return response.data;
}

function PatientIntakes() {
    // Queries
    const [preferredLocation, setPreferredLocation] = useState<PreferredLocationType>('all')
    const [authStatus, setAuthStatus] = useState<AuthStatusType>('all')

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['patient-intakes', authStatus, preferredLocation],
        queryFn: () => fetchPatientIntakes({
            authStatus,
            preferredLocation
        })
    })

    if (isLoading) return (
        <Fragment>
            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-3 gap-2.5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg py-2.5 px-4 flex justify-between items-center">
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="size-12 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Table Section Skeleton */}
            <div className="my-5">
                <div className="flex justify-between items-center my-2.5">
                    <Skeleton className="h-8 w-48" />

                    <div className="flex justify-end items-center gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <TableHead key={i}>
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[1, 2, 3, 4, 5].map((row) => (
                                <TableRow key={row}>
                                    {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
                                        <TableCell key={cell}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Fragment>
    );

    if (isSuccess)
        return (
            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-2.5">
                    <div className="border rounded-lg py-2.5 px-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-sm font-normal text-muted-foreground mb-2">Total Intakes</h1>
                            <h2 className="text-theme-green font-bold text-2xl">{data.statistics.totalIntakes}</h2>
                        </div>

                        <div className="size-12 rounded-full flex justify-center items-center bg-theme-green-100">
                            <ClipboardList className="stroke-1 text-theme-green" />
                        </div>
                    </div>

                    <div className="border rounded-lg py-2.5 px-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-sm font-normal text-muted-foreground mb-2">Auth Pending</h1>
                            <h2 className="text-theme-green font-bold text-2xl">{data.statistics.authPending}</h2>
                        </div>

                        <div className="size-12 rounded-full flex justify-center items-center bg-theme-green-100">
                            <ClipboardClock className="stroke-1 text-theme-green" />
                        </div>
                    </div>

                    <div className="border rounded-lg py-2.5 px-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-sm font-normal text-muted-foreground mb-2">Completed</h1>
                            <h2 className="text-theme-green font-bold text-2xl">{data.statistics.completed}</h2>
                        </div>

                        <div className="size-12 rounded-full flex justify-center items-center bg-theme-green-100">
                            <CircleCheck className="stroke-1 text-theme-green" />
                        </div>
                    </div>
                </div>

                <div className="my-5">
                    <div className="flex justify-between items-center my-2.5">
                        <h1 className="font-bold text-2xl">New Patient Intakes</h1>

                        <div className="flex justify-end items-center gap-2">
                            <div>
                                <Tabs defaultValue={preferredLocation} onValueChange={(v) => setPreferredLocation(v as PreferredLocationType)} className="w-fit">
                                    <TabsList className="bg-white border">
                                        <TabsTrigger value="all" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">All</TabsTrigger>
                                        <TabsTrigger value="leaside" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">Leaside</TabsTrigger>
                                        <TabsTrigger value="downtown" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">Downtown</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div>
                                <Tabs defaultValue={authStatus} onValueChange={(v) => setAuthStatus(v as AuthStatusType)} className="w-fit">
                                    <TabsList className="bg-white border">
                                        <TabsTrigger value="all" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">All</TabsTrigger>
                                        <TabsTrigger value="pending" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">Auth Pending</TabsTrigger>
                                        <TabsTrigger value="completed" className="data-[state=active]:bg-theme-green-50/50 data-[state=active]:text-theme-green">Completed</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <DataTable columns={columns} data={data.accounts} />
                </div>
            </div>
        )
}

export default PatientIntakes