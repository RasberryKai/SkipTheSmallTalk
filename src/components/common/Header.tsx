import { Divider } from "@mantine/core"
import { IconArrowBack } from "@tabler/icons"
import { useNavigate } from "react-router"

export default function Header(props: any) {
    const navigate = useNavigate()

    return (
        <div className={props.className}>
            <div className={"flex flex-row items-center"}>
                <IconArrowBack color={"white"} className={"mr-2"} onClick={() => navigate(-1)} />
                <p className={"text-white text-4xl mb-2"}>{props.children}</p>
            </div>
            <Divider color={"white"} />
        </div>
    )
}
