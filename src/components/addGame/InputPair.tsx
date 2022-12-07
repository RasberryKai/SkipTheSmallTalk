import { TextInput } from "@mantine/core"
import React from "react"

interface InputPairProps {
    inputNumber: number
    placeholder: string
    value?: string
    onChange?: (event: any) => void
    onRemove?: () => void
}

export default function InputPair(props: InputPairProps) {
    return (
        <div className={"flex flex-row items-center"}>
            <p className={"text-white text-2xl mb-6 mr-2 w-7"}>{props.inputNumber}.</p>
            <TextInput
                placeholder={props.placeholder}
                variant={"filled"}
                className={"w-11/12 mx-auto mb-6"}
                radius={"md"}
                size={"md"}
                value={props.value}
                onChange={props.onChange}
            />
            <img
                alt={"remove"}
                src={require("../../assets/white-x.png")}
                className={"h-6 w-auto mb-5 ml-2 mr-2"}
                onClick={props.onRemove}
            />
        </div>
    )
}
