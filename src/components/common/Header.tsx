import { Divider } from "@mantine/core"

export default function Header(props: any) {
    return (
        <div className={props.className}>
            <p className={"text-white text-4xl mb-2"}>{props.children}</p>
            <Divider color={"white"} />
        </div>
    )
}
