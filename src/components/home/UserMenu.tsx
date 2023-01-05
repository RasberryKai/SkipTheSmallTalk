import { Menu } from "@mantine/core"
import { IconLogout } from "@tabler/icons"
import { useDispatch } from "react-redux"
import { logOut } from "../../store/userSlice"
import { clearGame } from "../../store/gameSlice"
import { clearGameSelection } from "../../store/gameSelectionSlice"

interface UserMenu {
    username: string | null | undefined
}

export default function UserMenu(props: UserMenu) {
    const dispatch = useDispatch()

    return (
        <Menu shadow={"md"} withArrow={true}>
            <Menu.Target>
                <p className={"text-white text-xl underline underline-offset-2 hover:cursor-pointer"}>{props.username}</p>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    color="realRed"
                    icon={<IconLogout size={14} />}
                    onClick={() => {
                        dispatch(logOut())
                        dispatch(clearGame())
                        dispatch(clearGameSelection())
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
