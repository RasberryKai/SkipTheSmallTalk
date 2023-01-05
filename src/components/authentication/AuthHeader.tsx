import { ReactNode } from "react"

interface AuthHeaderProps {
    children: ReactNode
    className?: string
}

export default function AuthHeader(props: AuthHeaderProps) {
    return <p className={`text-4xl ${props.className}`}>{props.children}</p>
}
