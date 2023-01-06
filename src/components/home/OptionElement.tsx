import React, { ReactNode } from "react"
import { Oval } from "react-loader-spinner"
import { colors } from "../../constants/colors"

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
            {props.loading ? (
                <Oval
                    width={"50"}
                    height={"50"}
                    color={"#fff"}
                    secondaryColor={colors.hoveredWhite}
                    strokeWidth={2.7}
                    strokeWidthSecondary={2.7}
                />
            ) : (
                props.children
            )}
        </div>
    )
}
