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
    useReactTable,
    SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementType } from "@/object-types";

const columns: ColumnDef<AnnouncementType>[] = [
    {
        accessorKey: "datetime",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const datetime = row.getValue("datetime") as string | null;
            return datetime ? new Date(datetime).toLocaleString() : "N/A";
        },
    },
    {
        accessorKey: "main_text",
        header: "Main Text",
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.getValue("description") || "N/A",
    },
    {
        accessorKey: "author_username",
        header: "Author",
        cell: ({ row }) => row.getValue("author_username") || "N/A",
    },
];

interface AnnouncementDataTableProps {
    announcements: AnnouncementType[];
}

const AnnouncementDataTable: React.FC<AnnouncementDataTableProps> = ({
    announcements,
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "datetime", desc: true }, 
    ]);

    const table = useReactTable({
        data: announcements,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
        <div className="space-y-4">
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
                                    No announcements found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AnnouncementDataTable;
