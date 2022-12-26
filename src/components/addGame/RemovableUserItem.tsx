import React from "react"

interface InputPairProps {
    number: number
    onRemove: (index: number) => void
    children?: string
}

export default function RemovableUserItem(props: InputPairProps) {
    return (
        <div className={"flex flex-row items-center mb-4"}>
            <p className={"text-white text-2xl mr-2 w-7"}>{props.number}.</p>
            <p className={"text-white text-xl w-full"}>{props.children}</p>
            <img
                alt={"remove"}
                src={require("../../assets/white-x.png")}
                className={"h-6 w-auto ml-2 mr-2"}
                onClick={() => props.onRemove(props.number - 1)}
            />
        </div>
    )
}
