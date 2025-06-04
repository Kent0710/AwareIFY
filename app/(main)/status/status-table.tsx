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
import { StatusTableType } from "@/object-types";

// Define columns for the data table
const columns: ColumnDef<StatusTableType>[] = [
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
            const date = new Date(row.getValue("datetime"));
            return <div>{date.toLocaleString()}</div>;
        },
    },
    {
        accessorKey: "is_safe",
        header: "Safety Status",
    },
    {
        accessorKey: "flood_height",
        header: "Flood Height (m)",
        cell: ({ row }) => {
            const value = row.getValue("flood_height") as number | undefined;
            return value != null ? value.toFixed(2) : "N/A";
        },
    },
    {
        accessorKey: "rain_intensity",
        header: "Rain Intensity (mm/h)",
        cell: ({ row }) => {
            const value = row.getValue("rain_intensity") as number | undefined;
            return value != null ? value.toFixed(2) : "N/A";
        },
    },
    {
        accessorKey: "wind_speed",
        header: "Wind Speed (km/h)",
        cell: ({ row }) => {
            const value = row.getValue("wind_speed") as number | undefined;
            return value != null ? value.toFixed(2) : "N/A";
        },
    },
    {
        accessorKey: "modality",
        header: "Modality",
    },
    {
        accessorKey: "transportation",
        header: "Transportation",
    },
    {
        accessorKey: "evacuation",
        header: "Evacuation",
    },
    {
        accessorKey: "readiness",
        header: "Readiness",
    },
];

interface StatusTableProps {
    data: StatusTableType[];
}

const StatusTable: React.FC<StatusTableProps> = ({ data }) => {
    const [sorting, setSorting] = useState<SortingState>([
        { id: "datetime", desc: true }, // Default sort by datetime descending
    ]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    return (
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
                                              header.column.columnDef.header,
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
    );
};

export default StatusTable;
