"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountType } from "@/object-types";

interface DataTableAccountType {
    username: string;
    primary_location_longitude: number;
    primary_location_latitude: number;
    place_name: string;
}

const columns: ColumnDef<DataTableAccountType>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Username
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "place_name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Place Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "primary_location_latitude",
        header: "Latitude",
        cell: ({ row }) => {
            const value = row.getValue("primary_location_latitude");
            return typeof value === "number" ? value.toFixed(4) : "";
        },
    },
    {
        accessorKey: "primary_location_longitude",
        header: "Longitude",
        cell: ({ row }) => {
            const value = row.getValue("primary_location_longitude");
            return typeof value === "number" ? value.toFixed(4) : "";
        },
    },
];

interface AccountDataTableProps {
    accounts: AccountType[];
}

const AccountDataTable: React.FC<AccountDataTableProps> = ({ accounts }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState<string>("");

    const table = useReactTable({
        data: accounts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter: filter,
        },
        onGlobalFilterChange: setFilter,
        globalFilterFn: (row, columnId, filterValue: string) => {
            const username = row.getValue("username") as string;
            const placeName = row.getValue("place_name") as string;
            return (
                username.toLowerCase().includes(filterValue.toLowerCase()) ||
                placeName.toLowerCase().includes(filterValue.toLowerCase())
            );
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search by username or place name..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AccountDataTable;
