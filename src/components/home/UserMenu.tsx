import { Menu } from "@mantine/core"
import { IconLogout } from "@tabler/icons"
import { useDispatch } from "react-redux"
import { logOut } from "../../store/userSlice"
import { useNavigate } from "react-router"

interface UserMenu {
    username: string | null | undefined
}

export default function UserMenu(props: UserMenu) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <Menu shadow={"md"} withArrow={true}>
            <Menu.Target>
                <p className={"text-white text-xl underline underline-offset-2"}>{props.username}</p>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    color="realRed"
                    icon={<IconLogout size={14} />}
                    onClick={() => {
                        dispatch(logOut())
                        navigate("/signIn")
                    }}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
