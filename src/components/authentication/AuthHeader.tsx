import { ReactNode } from "react"

interface AuthHeaderProps {
    children: ReactNode
}

export default function AuthHeader(props: AuthHeaderProps) {
    return <p className={"text-4xl mb-10"}>{props.children}</p>
}
