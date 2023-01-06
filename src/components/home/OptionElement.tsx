import { ReactNode } from "react"

interface OptionElementProps {
    children?: ReactNode
    onClick?: () => void
    className?: string
}

export default function OptionElement(props: OptionElementProps) {
    return (
        <div className={`h-28 flex flex-col justify-center items-center animate-fade ${props.className}`} onClick={props.onClick}>
            {props.children}
        </div>
    )
}
