import { useTranslate, useNavigation, useTable } from "@refinedev/core";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";

import { ILoad } from "../../../interfaces";

export const LoadTimeline: React.FC = () => {
    const theme = useTheme();

    const t = useTranslate();
    const { show } = useNavigation();

    const { tableQueryResult, current, setCurrent, pageCount } =
        useTable<ILoad>({
            resource: "loads",
            initialSorter: [
                {
                    field: "createdAt",
                    load: "desc",
                },
            ],
            initialPageSize: 5,
            syncWithLocation: false,
        });

    const { data } = tableQueryResult;

    const loadStatusColor = (
        id: string,
    ): { color: string; text: string; dotColor: string } => {
        switch (id) {
            case "1":
                return {
                    color: theme.timeLine.color.pending,
                    text: "pending",
                    dotColor: theme.timeLine.dotColor.pending,
                };
            case "2":
                return {
                    color: theme.timeLine.color.ready,
                    text: "ready",
                    dotColor: theme.timeLine.dotColor.ready,
                };
            case "3":
                return {
                    color: theme.timeLine.color.onTheWay,
                    text: "on the way",
                    dotColor: theme.timeLine.dotColor.onTheWay,
                };
            case "4":
                return {
                    color: theme.timeLine.color.delivered,
                    text: "delivered",
                    dotColor: theme.timeLine.dotColor.delivered,
                };
            default:
                return {
                    color: theme.timeLine.color.cancelled,
                    text: "cancelled",
                    dotColor: theme.timeLine.dotColor.cancelled,
                };
        }
    };

    return (
        <>
            <Timeline position="right" sx={{ mt: 0, pt: 0 }}>
                {data?.data.map(({ createdAt, loadNumber, status, id }) => {
                    const text = loadStatusColor(status.id.toString())?.text;
                    const color = loadStatusColor(status.id.toString())?.color;
                    const dotColor = loadStatusColor(
                        status.id.toString(),
                    )?.dotColor;

                    return (
                        <TimelineItem key={loadNumber}>
                            <TimelineOppositeContent sx={{ display: "none" }} />
                            <TimelineSeparator>
                                <TimelineDot
                                    variant="outlined"
                                    sx={{ bloadColor: dotColor }}
                                />
                                <TimelineConnector sx={{ width: "1px" }} />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Box
                                    sx={{
                                        backgroundColor: color,
                                        bloadRadius: 2,
                                        p: 1,
                                    }}
                                >
                                    <Tooltip
                                        arrow
                                        title={dayjs(createdAt).format("lll")}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{ fontStyle: "italic" }}
                                        >
                                            {dayjs(createdAt).fromNow()}
                                        </Typography>
                                    </Tooltip>
                                    <Typography variant="subtitle2">
                                        {t(
                                            `dashboard.timeline.loadStatuses.${text}`,
                                        )}
                                    </Typography>
                                    <Button
                                        variant="text"
                                        onClick={() => show("loads", id)}
                                        size="small"
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ color: "text.primary" }}
                                        >
                                            #{loadNumber}
                                        </Typography>
                                    </Button>
                                </Box>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Pagination
                        count={pageCount}
                        page={current}
                        onChange={(e, page) => setCurrent(page)}
                        siblingCount={0}
                        boundaryCount={0}
                        size="small"
                        color="primary"
                    />
                </Box>
            </Timeline>
        </>
    );
};
