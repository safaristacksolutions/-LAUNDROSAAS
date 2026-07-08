import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id?: number }>({
  columns, data, loading, onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => <TableCell key={col.key} sx={{ width: col.width, fontWeight: 700 }}>{col.label}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => <TableCell key={col.key}><Skeleton /></TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            {columns.map((col) => (
              <TableCell key={col.key} sx={{ width: col.width, fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5, color: "text.secondary" }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                <Box color="text.secondary">No data found</Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow
                key={(row.id as number) ?? i}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? "pointer" : undefined,
                  "&:hover": { bgcolor: "action.hover" },
                  "&:last-child td": { border: 0 },
                  transition: "background-color 0.15s ease",
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} sx={{ py: 1.5 }}>{col.render(row)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
