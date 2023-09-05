import { useList, useNavigation } from "@refinedev/core";
import Box from "@mui/material/Box";

import { Map, MapMarker } from "../../../components";
import { ILoad } from "../../../interfaces";

export const DeliveryMap: React.FC = () => {
    const { data: loadData } = useList<ILoad>({
        resource: "loads",
        config: {
            filters: [
                {
                    field: "status.text",
                    operator: "eq",
                    value: "In transit",
                },
            ],
            pagination: {
                pageSize: 1000,
            },
        },
    });

    const defaultProps = {
        center: {
            lat: 40.73061,
            lng: -73.935242,
        },
        zoom: 13,
    };

    const { show } = useNavigation();

    return (
        <Box sx={{ height: "576px", width: "100%", position: "relative" }}>
            <Map {...defaultProps}>
                {loadData?.data.map((load) => {
                    return (
                        <MapMarker
                            key={load.id}
                            onClick={() => show("loads", load.id)}
                            icon={{
                                url: "/images/marker-driver.svg",
                            }}
                            position={{
                                lat: Number(load.adress.coordinate[0]),
                                lng: Number(load.adress.coordinate[1]),
                            }}
                        />
                    );
                })}
                {loadData?.data.map((load) => {
                    return (
                        <MapMarker
                            key={load.id}
                            onClick={() => show("loads", load.id)}
                            icon={{
                                url: "/images/marker-location.svg",
                            }}
                            position={{
                                lat: Number(load.store.address.coordinate[0]),
                                lng: Number(load.store.address.coordinate[1]),
                            }}
                        />
                    );
                })}
            </Map>
        </Box>
    );
};
