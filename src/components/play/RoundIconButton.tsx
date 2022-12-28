import { ReactNode } from "react"

interface RoundIconButtonProps {
    children: ReactNode
    onClick: () => void
}

export default function RoundIconButton(props: RoundIconButtonProps) {
    const width = window.innerWidth

    return (
        <div
            className={`flex items-center justify-center w-20 h-20 h-[${
                width * 0.5
            }px] bg-white rounded-[50%] shadow-2xl active:shadow-none active:scale-95 transition-all duration-200`}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    )
}
