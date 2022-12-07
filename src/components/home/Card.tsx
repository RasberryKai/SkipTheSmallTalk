import { Progress } from "@mantine/core"

interface CardProps {
    name: string
    playerNames: string[]
    percentage: number
    onClick?: () => void
}

export default function Card(props: CardProps) {
    return (
        <div
            className={"w-full h-44 bg-accent rounded-xl flex flex-col items-start justify-between p-2 mb-4 select-none"}
            onClick={props.onClick}
        >
            <div className={"ml-2 flex-col justify-start items-start w-full"}>
                <p className={"text-black text-2xl flex items-start justify-start"}>{props.name}</p>
                <p className={"text-black text-lg flex items-start justify-start"}>Players: {props.playerNames.join(", ")}</p>
            </div>
            <div className={"flex flex-row justify-around items-center w-full"}>
                <Progress radius={"md"} size={"md"} value={props.percentage} className={"w-10/12"} />
                <p className={"text-black"}>{props.percentage}%</p>
            </div>
        </div>
    )
}
