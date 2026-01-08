import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Box, Stack, Typography, IconButton, Grid, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { ColDef } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridCardProps {
    title: string;
    rowData: any[];
    columnDefs: ColDef[];
}

const DataGridCard: React.FC<DataGridCardProps> = ({ title, rowData, columnDefs }) => {
    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                },
            }}
        >
            {/* Header with title and edit icon */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    py: 2,
                    borderBottom: '2px solid rgba(255,255,255,0.2)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    flexShrink: 0,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: 'white',
                    }}
                >
                    {title}
                </Typography>
                <IconButton
                    size="medium"
                    sx={{
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            border: '2px solid rgba(255,255,255,0.5)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* AG Grid */}
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    minHeight: 0,
                }}
            >
                <Box
                    className="ag-theme-quartz"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        domLayout="normal"
                        suppressCellFocus={true}
                        onGridReady={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

// Cell renderer components for icons
const ViewCellRenderer = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton
                size="small"
                sx={{
                    color: '#2196f3',
                    '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    },
                }}
                onClick={() => console.log('View clicked')}
            >
                <VisibilityIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

const EditCellRenderer = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton
                size="small"
                sx={{
                    color: '#ff9800',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    },
                }}
                onClick={() => console.log('Edit clicked')}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

const DeleteCellRenderer = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IconButton
                size="small"
                sx={{
                    color: '#f44336',
                    '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    },
                }}
                onClick={() => console.log('Delete clicked')}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

const DatagridTest: React.FC = () => {
    // Sample column definitions
    const columnDefs: ColDef[] = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'date', headerName: 'Date', width: 120 },
        {
            headerName: '',
            width: 80,
            minWidth: 50,
            cellRenderer: ViewCellRenderer,
            resizable: false,
            suppressHeaderMenuButton: true,
        },
        {
            headerName: '',
            width: 80,
            minWidth: 50,
            cellRenderer: EditCellRenderer,
            resizable: false,
            suppressHeaderMenuButton: true,
        },
        {
            headerName: '',
            width: 80,
            minWidth: 50,
            cellRenderer: DeleteCellRenderer,
            resizable: false,
            suppressHeaderMenuButton: true,
        },
    ];

    // Sample data for DataGrid1
    const rowData1 = [
        { id: 1, name: 'Project Alpha', status: 'Active', date: '2024-01-15' },
        { id: 2, name: 'Project Beta', status: 'Pending', date: '2024-01-16' },
        { id: 3, name: 'Project Gamma', status: 'Completed', date: '2024-01-17' },
        { id: 4, name: 'Project Delta', status: 'Active', date: '2024-01-18' },
    ];

    // Sample data for DataGrid2
    const rowData2 = [
        { id: 5, name: 'Task One', status: 'In Progress', date: '2024-01-19' },
        { id: 6, name: 'Task Two', status: 'Completed', date: '2024-01-20' },
        { id: 7, name: 'Task Three', status: 'Pending', date: '2024-01-21' },
        { id: 8, name: 'Task Four', status: 'Active', date: '2024-01-22' },
    ];

    // Sample data for DataGrid3
    const rowData3 = [
        { id: 9, name: 'Recent Item A', status: 'New', date: '2024-01-23' },
        { id: 10, name: 'Recent Item B', status: 'Updated', date: '2024-01-24' },
        { id: 11, name: 'Recent Item C', status: 'Active', date: '2024-01-25' },
        { id: 12, name: 'Recent Item D', status: 'Pending', date: '2024-01-26' },
    ];

    // Sample data for DataGrid4
    const rowData4 = [
        { id: 13, name: 'Latest Entry 1', status: 'Processing', date: '2024-01-27' },
        { id: 14, name: 'Latest Entry 2', status: 'Completed', date: '2024-01-28' },
        { id: 15, name: 'Latest Entry 3', status: 'Active', date: '2024-01-29' },
        { id: 16, name: 'Latest Entry 4', status: 'Pending', date: '2024-01-30' },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 6, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* All 4 DataGrids in a 2x2 Grid Layout - Full Height */}
            <Grid
                container
                spacing={3}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    height: '100%', // Ensure container has height
                }}
            >
                {/* DataGrid1 - Projects */}
                <Grid size={{ xs: 6 }} sx={{ height: '50%', minHeight: 0 }}>
                    <Stack sx={{ height: '100%', width: '100%' }}>
                        <DataGridCard
                            title="DataGrid1 - Projects"
                            rowData={rowData1}
                            columnDefs={columnDefs}
                        />
                    </Stack>
                </Grid>

                {/* DataGrid2 - Tasks */}
                <Grid size={{ xs: 6 }} sx={{ height: '50%', minHeight: 0 }}>
                    <Stack sx={{ height: '100%', width: '100%' }}>
                        <DataGridCard
                            title="DataGrid2 - Tasks"
                            rowData={rowData2}
                            columnDefs={columnDefs}
                        />
                    </Stack>
                </Grid>

                {/* DataGrid3 - Recent Items */}
                <Grid size={{ xs: 6 }} sx={{ height: '50%', minHeight: 0 }}>
                    <Stack sx={{ height: '100%', width: '100%' }}>
                        <DataGridCard
                            title="DataGrid3 - Recent Items"
                            rowData={rowData3}
                            columnDefs={columnDefs}
                        />
                    </Stack>
                </Grid>

                {/* DataGrid4 - Latest Entries */}
                <Grid size={{ xs: 6 }} sx={{ height: '50%', minHeight: 0 }}>
                    <Stack sx={{ height: '100%', width: '100%' }}>
                        <DataGridCard
                            title="DataGrid4 - Latest Entries"
                            rowData={rowData4}
                            columnDefs={columnDefs}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DatagridTest;
