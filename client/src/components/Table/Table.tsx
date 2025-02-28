import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";

type Column = {
  id: string;
  label: string;
  accessor: string;
};

type RowData = Record<string, string | number>;

type TableProps = {
  columns: Column[];
  data: RowData[];
  icon?: React.ReactNode; // Icono opcional
  onClick?: (id: string) => void; // Función de clic opcional
  condition?: (rowData: RowData) => boolean; // Función de condición opcional
};

const TableExample: React.FC<TableProps> = ({
  columns,
  data,
  icon,
  onClick,
  condition,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} sx={{ fontWeight: "bold" }}>
                {column.label}
              </TableCell>
            ))}
            {icon && <TableCell align="center">Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedData.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>{row[column.accessor]}</TableCell>
              ))}
              {icon && condition && condition(row) ? ( // Verifica la condición
                <TableCell align="center">
                  <IconButton
                    onClick={() => onClick && onClick(row.id as string)}
                  >
                    {icon}
                  </IconButton>
                </TableCell>
              ) : (
                <TableCell></TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </TableContainer>
  );
};

export default TableExample;
