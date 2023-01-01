import { Menu, Tooltip, useMantineTheme } from "@mantine/core"
import { IconTool, IconTrash } from "@tabler/icons"
import { deleteGame } from "../../api/games"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"

export default function Options(props: { id: string; isOwner: boolean }) {
    const navigate = useNavigate()
    useMantineTheme().colorScheme = "dark"

    return (
        <div className={"text-black mt-0.5"}>
            <Tooltip label={"Options"} position={"bottom"}>
                <div>
                    <Menu withArrow={true}>
                        <Menu.Target>
                            <div>
                                <IconTool stroke={1.5} />
                            </div>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                color="realRed"
                                icon={<IconTrash size={16} stroke={1.7} />}
                                onClick={async () => {
                                    const error = await deleteGame(props.id)
                                    if (error) {
                                        showNotification({
                                            title: "Could not delete game",
                                            message: error,
                                            color: "red",
                                        })
                                        return
                                    }
                                    navigate(0)
                                }}
                                disabled={!props.isOwner}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            </Tooltip>
        </div>
    )
}
