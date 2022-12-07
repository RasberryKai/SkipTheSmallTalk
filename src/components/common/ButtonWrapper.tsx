import React from "react"
import { Button } from "@mantine/core"

interface ButtonProps {
    children?: React.ReactNode
    onClick?: () => void
    className?: string
    variant?: "actionable" | "primary"
    type?: "submit" | "reset" | "button" | undefined
    loading?: boolean
    disabled?: boolean
}

export default function ButtonWrapper(props: ButtonProps) {
    if (props.variant === "actionable") {
        return (
            <Button
                loading={props.loading}
                onClick={props.onClick}
                className={"bg-actionable " + props.className}
                type={props.type}
                disabled={props.disabled}
            >
                {props.children}
            </Button>
        )
    }

    return (
        <Button
            onClick={props.onClick}
            className={`bg-white text-primary-dark ${props.className} active:bg-white`}
            type={props.type}
            loading={props.loading}
            disabled={props.disabled}
        >
            {props.children}
        </Button>
    )
}
