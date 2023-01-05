import { IconSettings } from "@tabler/icons"

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
        <div
            className={
                "bg-primary-normal w-full h-28 flex rounded-3xl flex flex-row justify-between items-center select-none pt-4 pb-4 mb-8"
            }
        >
            <div className={"flex flex-row items-center h-full w-5/6 h-full overflow-hidden"}>
                <img
                    src={require("../../assets/elementIcons/IceCream.png")}
                    alt={"Ice cream"}
                    className={"w-20 h-20 rounded-[43%] mt-2 ml-3 mb-2 select-none hover:cursor-pointer"}
                />
                <div className={"h-full ml-4"}>
                    <p className={"text-xl font-bold text-white"}>{props.name}</p>
                    <p className={"text-[15px]"}>
                        <b>Owner:</b> {props.owner}
                    </p>
                    {props.playerNames.length > 0 && (
                        <p className={"text-[15px]"}>
                            <b>Players:</b> {props.playerNames.join(", ")}
                        </p>
                    )}
                </div>
            </div>
            <IconSettings className={"mr-4"} color={"#6d75b1"} size={40} stroke={1.5} />
        </div>
    )
}
