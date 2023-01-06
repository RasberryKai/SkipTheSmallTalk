import { ReactNode } from "react"

interface OptionElementProps {
    children?: ReactNode
    onClick?: () => void
    className?: string
    loading?: boolean
    loadingColor?: string
}

export default function OptionElement(props: OptionElementProps) {
    return (
        <div
            className={`h-28 flex flex-col justify-center items-center animate-fade ${props.className} hover:cursor-pointer`}
            onClick={() => props.onClick && props.onClick()}
        >
            {props.children}
        </div>
    )
}
