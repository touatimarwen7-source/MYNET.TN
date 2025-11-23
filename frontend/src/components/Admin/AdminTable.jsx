import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Box,
  Typography,
  TablePagination,
  TextField,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Reusable table component with pagination, search, sorting
 * Eliminates 200+ lines of duplicated table code
 */
export default function AdminTable({
  columns = [],
  rows = [],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  loading = false,
  searchable = true,
  sortable = true,
  emptyMessage = 'Aucun élément',
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('asc');

  // Filter rows
  const filteredRows = React.useMemo(() => {
    let filtered = [...rows];

    if (search) {
      filtered = filtered.filter((row) =>
        columns.some(
          (col) =>
            String(row[col.field])
              .toLowerCase()
              .includes(search.toLowerCase())
        )
      );
    }

    if (sortBy && sortable) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [rows, search, sortBy, sortOrder, columns, sortable]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Box>
      {searchable && (
        <TextField
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{ mb: 2, width: '100%' }}
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  onClick={() => sortable && handleSort(col.field)}
                  sx={{
                    fontWeight: 600,
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  {col.label}
                  {sortable && sortBy === col.field && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </TableCell>
              ))}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => (
                <TableRow key={row.id || idx} hover>
                  {columns.map((col) => (
                    <TableCell key={`${row.id || idx}-${col.field}`}>
                      {row[col.field]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      {onView && (
                        <IconButton
                          size="small"
                          onClick={() => onView(row)}
                          title="Voir"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(row)}
                          title="Modifier"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(row)}
                          title="Supprimer"
                          sx={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} sur ${count}`
        }
      />
    </Box>
  );
}
