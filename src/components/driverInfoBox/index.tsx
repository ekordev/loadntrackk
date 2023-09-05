import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

type DriverInfoBoxProps = {
    text: string;
    icon: React.ReactNode;
    value?: string;
};

export const DriverInfoBox: React.FC<DriverInfoBoxProps> = ({
    text,
    icon,
    value,
}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            sx={{
                maxWidth: "200px",
                bloadRadius: "8px",
                color: "white",
                padding: "10px 12px",
                backgroundColor: "primary.main",
                maxHeight: "100px",
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "transparent",
                    color: "white",
                }}
            >
                {icon}
            </Avatar>
            <Box>
                <Typography variant="body1" fontWeight={700}>
                    {text}
                </Typography>
                <Typography>{value}</Typography>
            </Box>
        </Box>
    );
};
