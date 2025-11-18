import { useEffect, useRef, useState } from "react"
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EmptyTable from "@/components/empty-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

type InfiniteScrollConfig = {
    loadMore: () => void
    hasMore: boolean
    isFetching: boolean
    triggerOffset?: string
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    infiniteScrollConfig?: InfiniteScrollConfig
}

export function DataTable<TData, TValue>({
    columns,
    data,
    infiniteScrollConfig,
}: DataTableProps<TData, TValue>) {
    const loaderRowRef = useRef<HTMLTableRowElement | null>(null)
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    })

    const hasMore = infiniteScrollConfig?.hasMore ?? false
    const isFetchingMore = infiniteScrollConfig?.isFetching ?? false
    const triggerOffset = infiniteScrollConfig?.triggerOffset ?? "300px"
    const loadMore = infiniteScrollConfig?.loadMore

    useEffect(() => {
        const node = loaderRowRef.current
        if (!node || !loadMore || !hasMore) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting && hasMore && !isFetchingMore) {
                    loadMore()
                }
            },
            {
                root: null,
                rootMargin: triggerOffset,
                threshold: 0,
            }
        )

        observer.observe(node)

        return () => {
            observer.disconnect()
        }
    }, [hasMore, isFetchingMore, loadMore, triggerOffset])

    const shouldRenderLoaderRow = Boolean(
        infiniteScrollConfig && (hasMore || isFetchingMore)
    )

    const loaderMessage = isFetchingMore
        ? "Loading more records..."
        : hasMore
            ? "Scroll to load more"
            : "You're all caught up"

    return (
        <div className="relative w-full overflow-auto max-h-[calc(100dvh-298px)]">
            <Table className="w-full h-full">
                <TableHeader className={`sticky top-0 z-40`}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-secondary">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : (() => {
                                                const canSort = header.column.getCanSort()
                                                const headerContent = flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )

                                                if (!canSort) {
                                                    return headerContent
                                                }

                                                return (
                                                    <button
                                                        type="button"
                                                        className="flex w-full items-center gap-2 text-left text-sm font-medium"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {headerContent}
                                                        <SortingIndicator direction={header.column.getIsSorted()} />
                                                    </button>
                                                )
                                            })()}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <EmptyTable />
                            </TableCell>
                        </TableRow>
                    )}
                    {shouldRenderLoaderRow && (
                        <TableRow ref={loaderRowRef}>
                            <TableCell colSpan={columns.length}>
                                <div className="py-4 text-center text-sm text-muted-foreground">
                                    {loaderMessage}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function SortingIndicator({
    direction,
}: {
    direction: false | "asc" | "desc"
}) {
    if (!direction) {
        return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }

    if (direction === "asc") {
        return <ArrowUp className="h-4 w-4 text-muted-foreground" />
    }

    return <ArrowDown className="h-4 w-4 text-muted-foreground" />
}