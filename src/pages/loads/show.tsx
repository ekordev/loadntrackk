import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    IResourceComponentsProps,
    useNavigation,
    useShow,
    useTranslate,
    useUpdate,
} from "@refinedev/core";
import { List } from "@refinedev/mui";
import dayjs from "dayjs";

import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MopedIcon from "@mui/icons-material/Moped";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

import { DriverInfoBox, Map, MapMarker } from "../../components";
import { useLoadCustomKbarActions } from "../../hooks";
import { IEvent, ILoad, IProduct } from "../../interfaces";

export const LoadShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { queryResult } = useShow<ILoad>();
    const record = queryResult.data?.data;
    const canAcceptLoad = record?.status.text === "Pending";
    const canRejectLoad =
        record?.status.text === "Pending" ||
        record?.status.text === "Ready" ||
        record?.status.text === "On The Way";

    const { goBack } = useNavigation();
    const { mutate } = useUpdate();

    const theme = useTheme();

    const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));

    const columns = React.useMemo<GridColDef<IProduct>[]>(
        () => [
            {
                field: "name",
                headerName: t("loads.deliverables.fields.items"),
                width: 300,
                renderCell: function render({ row }) {
                    return (
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Avatar
                                sx={{ width: 108, height: 108 }}
                                src={row.images[0].url}
                            />
                            <Box>
                                <Typography
                                    variant="body1"
                                    whiteSpace="break-spaces"
                                >
                                    {row.name}
                                </Typography>
                                <Typography variant="caption">
                                    #{row.id}
                                </Typography>
                            </Box>
                        </Stack>
                    );
                },
            },
            {
                field: "quantity",
                headerName: t("loads.deliverables.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: () => "1x",
            },
            {
                field: "price",
                headerName: t("loads.deliverables.fields.price"),
                width: 100,
                type: "number",
            },
            {
                field: "price",
                headerName: t("loads.deliverables.fields.total"),
                width: 100,
                type: "number",
            },
        ],
        [t],
    );

    const CustomFooter = () => (
        <Stack direction="row" spacing={4} justifyContent="flex-end" p={1}>
            <Typography sx={{ color: "primary.main" }} fontWeight={700}>
                {t("loads.deliverables.mainTotal")}
            </Typography>
            <Typography>{record?.amount}$</Typography>
        </Stack>
    );

    const handleMutate = (status: { id: number; text: string }) => {
        if (record) {
            mutate({
                resource: "loads",
                id: record.id.toString(),
                values: {
                    status,
                },
            });
        }
    };

    useLoadCustomKbarActions(record);

    return (
        <Stack spacing={2}>
            <Card>
                <CardHeader
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                    title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h6">
                                {t("loads.fields.loadID")}
                            </Typography>
                            <Typography variant="caption">{`#${
                                record?.loadNumber ?? ""
                            }`}</Typography>
                        </Stack>
                    }
                    avatar={
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                    action={
                        <Stack direction="row" spacing={2}>
                            <Button
                                disabled={!canAcceptLoad}
                                variant="outlined"
                                size="small"
                                startIcon={<CheckOutlinedIcon />}
                                onClick={() =>
                                    handleMutate({
                                        id: 2,
                                        text: "Ready",
                                    })
                                }
                            >
                                {t("buttons.accept")}
                            </Button>
                            <Button
                                disabled={!canRejectLoad}
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={
                                    <CloseOutlinedIcon sx={{ bg: "red" }} />
                                }
                                onClick={() =>
                                    handleMutate({
                                        id: 5,
                                        text: "Cancelled",
                                    })
                                }
                            >
                                {t("buttons.reject")}
                            </Button>
                        </Stack>
                    }
                />
                <CardContent>
                    <Stepper
                        nonLinear
                        activeStep={record?.events.findIndex(
                            (el) => el.status === record?.status?.text,
                        )}
                        orientation={isSmallOrLess ? "vertical" : "horizontal"}
                    >
                        {record?.events.map((event: IEvent, index: number) => (
                            <Step key={index}>
                                <StepLabel
                                    optional={
                                        <Typography variant="caption">
                                            {event.date &&
                                                dayjs(event.date).format(
                                                    "L LT",
                                                )}
                                        </Typography>
                                    }
                                    error={event.status === "Cancelled"}
                                >
                                    {event.status}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>

            <Box sx={{ height: 500 }}>
                <Map
                    center={{
                        lat: 40.73061,
                        lng: -73.935242,
                    }}
                    zoom={9}
                >
                    <MapMarker
                        key={`user-marker-${record?.user.id}`}
                        icon={{
                            url: "/images/marker-location.svg",
                        }}
                        position={{
                            lat: Number(record?.adress.coordinate[0]),
                            lng: Number(record?.adress.coordinate[1]),
                        }}
                    />
                    <MapMarker
                        key={`user-marker-${record?.user.id}`}
                        icon={{
                            url: "/images/marker-driver.svg",
                        }}
                        position={{
                            lat: Number(record?.store.address.coordinate[0]),
                            lng: Number(record?.store.address.coordinate[1]),
                        }}
                    />
                </Map>
            </Box>

            <Paper sx={{ padding: 2 }}>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    justifyContent={isSmallOrLess ? "center" : "space-between"}
                >
                    <Stack
                        direction={isSmallOrLess ? "column" : "row"}
                        alignItems={isSmallOrLess ? "center" : "flex-start"}
                        textAlign={isSmallOrLess ? "center" : "left"}
                        gap={2}
                    >
                        <Avatar
                            alt={record?.driver.name}
                            src={record?.driver.avatar[0].url}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Box>
                            <Typography>COURIER</Typography>
                            <Typography variant="h6">
                                {record?.driver.name} {record?.driver.surname}
                            </Typography>
                            <Typography variant="caption">
                                ID #{record?.driver.id}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack
                        direction="row"
                        gap={2}
                        padding={1}
                        flexWrap="wrap"
                        justifyContent="center"
                    >
                        <DriverInfoBox
                            text={t("loads.driver.phone")}
                            icon={<PhoneIphoneIcon sx={{ fontSize: 36 }} />}
                            value={record?.driver.gsm}
                        />
                        <DriverInfoBox
                            text={t("loads.driver.deliveryTime")}
                            icon={<MopedIcon sx={{ fontSize: 36 }} />}
                            value="15:05"
                        />
                    </Stack>
                </Stack>
            </Paper>

            <List
                headerProps={{
                    title: t("loads.deliverables.deliverables"),
                }}
            >
                <DataGrid
                    autoHeight
                    columns={columns}
                    rows={record?.products || []}
                    hideFooterPagination
                    rowHeight={124}
                    components={{
                        Footer: CustomFooter,
                    }}
                />
            </List>
        </Stack>
    );
};