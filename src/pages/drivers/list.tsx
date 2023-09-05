import React from "react";

import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
    IResourceComponentsProps,
    useDelete,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";

import { IDriver } from "../../interfaces";

export const DriverList: React.FC<IResourceComponentsProps> = () => {
    const { show, edit } = useNavigation();
    const t = useTranslate();
    const { mutate: mutateDelete } = useDelete();

    const { dataGridProps } = useDataGrid<IDriver>({
        initialPageSize: 10,
        initialSorter: [
            {
                field: "id",
                load: "desc",
            },
        ],
    });

    const columns = React.useMemo<GridColDef<IDriver>[]>(
        () => [
            {
                field: "name",
                headerName: t("drivers.fields.name"),
                renderCell: function render({ row }) {
                    return (
                        <Stack alignItems="center" direction="row" spacing={2}>
                            <Avatar
                                alt={`${row.name} ${row.surname}`}
                                src={row.avatar?.[0]?.url}
                            />
                            <Typography variant="body2">
                                {row.name} {row.surname}
                            </Typography>
                        </Stack>
                    );
                },
                flex: 1,
                minWidth: 200,
            },
            {
                field: "gsm",
                headerName: t("drivers.fields.gsm"),
                flex: 1,
                minWidth: 200,
            },
            {
                field: "email",
                headerName: t("drivers.fields.email"),
                flex: 1,
                minWidth: 300,
            },
            {
                field: "address",
                headerName: t("drivers.fields.address"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.address}>
                            <Typography
                                variant="body2"
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.address}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
                minWidth: 300,
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                type: "actions",
                getActions: function render({ row }) {
                    return [
                        <GridActionsCellItem
                            key={1}
                            label={t("buttons.edit")}
                            icon={<Edit color="success" />}
                            onClick={() => edit("drivers", row.id)}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            key={2}
                            label={t("buttons.delete")}
                            icon={<Close color="error" />}
                            onClick={() => {
                                mutateDelete({
                                    resource: "drivers",
                                    id: row.id,
                                    mutationMode: "undoable",
                                });
                            }}
                            showInMenu
                        />,
                    ];
                },
            },
        ],
        [t],
    );

    return (
        <List wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                pageSizeOptions={[10, 20, 50, 100]}
                density="comfortable"
                sx={{
                    "& .MuiDataGrid-cell:hover": {
                        cursor: "pointer",
                    },
                }}
                onRowClick={(row) => {
                    show("drivers", row.id);
                }}
            />
        </List>
    );
};
