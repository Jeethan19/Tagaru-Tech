import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import {
    Table as MuiTable,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TableSortLabel,
    TextField,
    Paper,
} from '@mui/material';

const DefaultColumnFilter = ({ column }) => {
    console.log(column)
    const { filterValue, setFilterValue } = column;
    return (
        <TextField
            value={filterValue || ''}
            onChange={(e) => setFilterValue(e.target.value || undefined)}
            placeholder="Search..."
            variant="outlined"
            size="small"
            fullWidth
        />
    );
};

const Table = ({ columns, data, enableSorting = true, enableFiltering = false }) => {
    const defaultColumn = enableFiltering
        ? { Filter: DefaultColumnFilter }
        : {};

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
        getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    });

    return (
        <TableContainer component={Paper}>
            <MuiTable>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} >
                            {headerGroup.headers.map((header) => (
                                <TableCell key={header.id} style={{ fontWeight: 'bold' }}>
                                    <div>
                                        {enableSorting && header.column.getCanSort() ? (
                                            <TableSortLabel
                                                active={!!header.column.getIsSorted()}
                                                direction={
                                                    header.column.getIsSorted() === 'desc'
                                                        ? 'desc'
                                                        : 'asc'
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </TableSortLabel>
                                        ) : (
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        )}
                                    </div>
                                    {enableFiltering && header.column.getCanFilter() && (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.Filter,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default Table;