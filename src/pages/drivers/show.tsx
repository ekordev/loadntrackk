import React from "react";
import {
    HttpError,
    IResourceComponentsProps,
    useNavigation,
    useShow,
    useTranslate,
} from "@refinedev/core";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { List, useDataGrid } from "@refinedev/mui";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import DirectionsCarFilledOutlined from "@mui/icons-material/DirectionsCarFilledOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlined from "@mui/icons-material/LocalPhoneOutlined";
import MapOutlined from "@mui/icons-material/MapOutlined";
import StoreOutlined from "@mui/icons-material/StoreOutlined";

import { IDriver, IReview } from "../../interfaces";

type DriverInfoTextProps = {
    icon: React.ReactNode;
    text?: string;
};

const DriverInfoText: React.FC<DriverInfoTextProps> = ({ icon, text }) => (
    <Stack
        direction="row"
        alignItems="center"
        justifyContent={{
            sm: "center",
            lg: "flex-start",
        }}
        gap={1}
    >
        {icon}
        <Typography variant="body1">{text}</Typography>
    </Stack>
);

export const DriverShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { show } = useNavigation();

    const {
        queryResult: { data },
    } = useShow<IDriver>();
    const driver = data?.data;

    const { dataGridProps } = useDataGrid<IReview, HttpError>({
        resource: "reviews",
        initialSorter: [
            {
                field: "id",
                load: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "load.driver.id",
                operator: "eq",
                value: driver?.id,
            },
        ],
        initialPageSize: 4,
        queryOptions: {
            enabled: driver !== undefined,
        },
        syncWithLocation: false,
    });

    const columns = React.useMemo<GridColDef<IReview>[]>(
        () => [
            {
                field: "load.id",
                headerName: t("reviews.fields.loadId"),
                renderCell: function render({ row }) {
                    return (
                        <Button
                            onClick={() => {
                                show("loads", row.load.id);
                            }}
                        >
                            #{row.load.id}
                        </Button>
                    );
                },
                width: 150,
            },

            {
                field: "review",
                headerName: t("reviews.fields.review"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.comment[0]}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.comment[0]}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "star",
                headerName: t("reviews.fields.rating"),
                headerAlign: "center",
                flex: 1,
                align: "center",
                renderCell: function render({ row }) {
                    return (
                        <Stack alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                {row.star}
                            </Typography>
                            <Rating
                                name="rating"
                                defaultValue={row.star}
                                readOnly
                            />
                        </Stack>
                    );
                },
            },
        ],
        [t],
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={3}>
                <Paper sx={{ p: 2 }}>
                    <Stack alignItems="center" spacing={1}>
                        <Avatar
                            src={driver?.avatar?.[0].url}
                            sx={{ width: 120, height: 120 }}
                        />
                        <Typography variant="h6">
                            {driver?.name} {driver?.surname}
                        </Typography>
                    </Stack>
                    <br />
                    <Stack spacing={1}>
                        <DriverInfoText
                            icon={<StoreOutlined />}
                            text={driver?.store.title}
                        />
                        <DriverInfoText
                            icon={<LocalPhoneOutlined />}
                            text={driver?.gsm}
                        />
                        <DriverInfoText
                            icon={<EmailOutlined />}
                            text={driver?.email}
                        />
                        <DriverInfoText
                            icon={<AccountBalanceOutlined />}
                            text={driver?.accountNumber}
                        />
                        <DriverInfoText
                            icon={<MapOutlined />}
                            text={driver?.address}
                        />
                        <DriverInfoText
                            icon={<DirectionsCarFilledOutlined />}
                            text={driver?.licensePlate}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={9}>
                <Stack direction="column" spacing={2}>
                    <List
                        headerProps={{ title: t("loads.loads") }}
                        canCreate={false}
                    >
                        <DataGrid
                            {...dataGridProps}
                            columns={columns}
                            autoHeight
                            rowHeight={80}
                            pageSizeOptions={[4, 10, 20, 100]}
                        />
                    </List>
                </Stack>
            </Grid>
        </Grid>
    );
};
