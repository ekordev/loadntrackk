import { useEffect, useState } from "react";
import { useTranslate, useUpdate } from "@refinedev/core";
import {
    Action,
    createAction,
    Priority,
    useRegisterActions,
} from "@refinedev/kbar";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

import { ILoad } from "../../interfaces";

export const useLoadCustomKbarActions = (load?: ILoad): void => {
    const t = useTranslate();
    const canAcceptLoad = load?.status.text === "Pending";
    const canRejectLoad =
        load?.status.text === "Pending" ||
        load?.status.text === "Ready" ||
        load?.status.text === "On The Way";

    const [actions, setActions] = useState<Action[]>([]);
    const { mutate } = useUpdate();

    const handleMutate = (status: { id: number; text: string }) => {
        if (load) {
            mutate(
                {
                    resource: "loads",
                    id: load.id.toString(),
                    values: {
                        status,
                    },
                },
                {
                    onSuccess: () => setActions([]),
                },
            );
        }
    };
    useEffect(() => {
        const preActions: Action[] = [];
        if (canAcceptLoad) {
            preActions.push(
                createAction({
                    name: t("buttons.accept"),
                    icon: <CheckOutlined />,
                    section: "actions",
                    perform: () => {
                        handleMutate({
                            id: 2,
                            text: "Ready",
                        });
                    },
                    priority: Priority.HIGH,
                }),
            );
        }
        if (canRejectLoad) {
            preActions.push(
                createAction({
                    name: t("buttons.reject"),
                    icon: <CloseOutlined />,
                    section: "actions",
                    perform: () => {
                        handleMutate({
                            id: 5,
                            text: "Cancelled",
                        });
                    },
                    priority: Priority.HIGH,
                }),
            );
        }
        setActions(preActions);
    }, [load]);
    useRegisterActions(actions, [actions]);
};
