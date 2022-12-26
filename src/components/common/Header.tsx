import { Divider } from "@mantine/core"
import { IconArrowBack } from "@tabler/icons"
import { useNavigate } from "react-router"
import React from "react"

interface HeaderProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

export default function Header(props: HeaderProps) {
    const navigate = useNavigate()

    return (
        <div className={props.className}>
            <div className={"flex flex-row items-center"}>
                <IconArrowBack
                    color={"white"}
                    className={"mr-2"}
                    onClick={() => {
                        if (props.onClick) props.onClick()
                        else navigate(-1)
                    }}
                />
                <p className={"text-white text-4xl mb-2"}>{props.children}</p>
            </div>
            <Divider color={"white"} />
        </div>
    )
}
