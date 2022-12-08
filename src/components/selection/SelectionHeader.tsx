import { Divider } from "@mantine/core"
import { IconArrowBack } from "@tabler/icons"

export default function SelectionHeader(props: any) {
    return (
        <div className={props.className}>
            <div className={"flex flex-row items-center"}>
                <IconArrowBack color={"white"} className={"mr-2"} onClick={props.onClick} />
                <p className={"text-white text-4xl mb-2"}>{props.children}</p>
            </div>
            <Divider color={"white"} />
        </div>
    )
}
