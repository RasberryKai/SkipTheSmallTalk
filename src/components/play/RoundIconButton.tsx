import { ReactNode } from "react"

interface RoundIconButtonProps {
    children: ReactNode
    onClick: () => void
}

export default function RoundIconButton(props: RoundIconButtonProps) {
    return (
        <div
            className={`flex items-center justify-center w-16 h-16 bg-white rounded-[50%] shadow-2xl active:shadow-none active:scale-95 transition-all duration-200`}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    )
}
