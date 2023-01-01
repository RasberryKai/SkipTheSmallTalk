import Options from "./Options"

interface CardProps {
    id: string
    name: string
    playerNames: string[]
    owner: string
    percentage: number
    isOwner: boolean
    onClick?: () => void
}

export default function Card(props: CardProps) {
    return (
        <div className={"w-full h-44 bg-accent rounded-xl flex flex-col items-start justify-between p-2 mb-4 select-none"}>
            <div className={"w-full flex flex-row justify-between"}>
                {/* Name and shared container */}
                <div className={"ml-2 flex-col justify-start items-start w-full"} onClick={props.onClick}>
                    <p className={"text-black text-2xl flex items-start justify-start mb-2"}>{props.name}</p>
                    {props.owner && <p className={"text-black text-lg flex items-start justify-start"}>Owner: {props.owner}</p>}
                    {props.playerNames.length > 0 && (
                        <p className={"text-black text-lg flex items-start justify-start"}>
                            Shared with: {props.playerNames.join(", ")}
                        </p>
                    )}
                </div>
                {/* Options */}
                <Options id={props.id} isOwner={props.isOwner} />
            </div>
        </div>
    )
}
