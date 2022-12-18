import { Progress } from "@mantine/core"
import Options from "./Options"

interface CardProps {
    id: string
    name: string
    playerNames: string[]
    percentage: number
    onClick?: () => void
}

export default function Card(props: CardProps) {
    return (
        <div className={"w-full h-44 bg-accent rounded-xl flex flex-col items-start justify-between p-2 mb-4 select-none"}>
            <div className={"w-full flex flex-row justify-between"}>
                {/* Name and shared container */}
                <div className={"ml-2 flex-col justify-start items-start w-full"} onClick={props.onClick}>
                    <p className={"text-black text-2xl flex items-start justify-start"}>{props.name}</p>
                    <p className={"text-black text-lg flex items-start justify-start"}>Players: {props.playerNames.join(", ")}</p>
                </div>
                {/* Options */}
                <Options id={props.id} />
            </div>
            <div className={"flex flex-row justify-around items-end w-full h-full"} onClick={props.onClick}>
                <Progress radius={"md"} size={"md"} value={props.percentage} className={"w-10/12 mb-2"} />
                <p className={"text-black"}>{props.percentage}%</p>
            </div>
        </div>
    )
}
