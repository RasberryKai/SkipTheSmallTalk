import { IconSettings, IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import OptionElement from "./OptionElement"
import { deleteGame } from "../../api/games"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"

interface CardProps {
    id: string
    name: string
    playerNames: string[]
    owner: string
    percentage: number
    isOwner: boolean
    imgSource: any
    onClick?: () => void
}

export default function Card(props: CardProps) {
    const navigate = useNavigate()
    const [showFade, setShowFade] = useState<boolean>(false)
    const [showSettings, setShowSettings] = useState<boolean>(false)
    /*
    Then change the height of the inner div to be 100% of the outer div
    Afterwards put the settings and the inner div next to each other, so if the options show, the rounded main part will be
    pushed to the left

    Add glowing effect to cards (shadows)
     */

    const handleDelete = async () => {
        console.log("Handling delete")
        const error = await deleteGame(props.id)
        if (error) {
            showNotification({
                title: "Error",
                message: error,
                color: "red",
            })
            setShowSettings(false)
            return
        }
        navigate(0)
    }

    useEffect(() => {
        if (showSettings) setShowFade(true)
        if (!showSettings) setTimeout(() => setShowFade(false), 300)
    }, [showSettings])

    const getCardContent = () => {
        if (showSettings) {
            return (
                <div className={"w-full grid grid-cols-2 ml-2"}>
                    <OptionElement className={"bg-red rounded-l-3xl shadow-md shadow-red"} onClick={handleDelete}>
                        <IconTrash size={50} stroke={1.2} color={"#fff"} />
                    </OptionElement>
                    <OptionElement
                        className={"bg-primary-normal rounded-r-3xl shadow-md shadow-primary-normal"}
                        onClick={() => setShowSettings(false)}
                    >
                        <IconSettings size={50} stroke={1.2} color={"#fff"} />
                    </OptionElement>
                </div>
            )
        }
        return (
            <>
                <div
                    className={`flex flex-row items-center h-full w-5/6 h-full overflow-hidden ${showFade ? "animate-fade" : ""}`}
                >
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
                <IconSettings
                    className={`mr-4 ${showFade ? "animate-fade" : ""}`}
                    color={"#6d75b1"}
                    size={40}
                    stroke={1.5}
                    onClick={() => setShowSettings(!showSettings)}
                />
            </>
        )
    }

    return (
        <div
            className={`bg-primary-normal shadow-xl shadow-primary w-full h-28 flex rounded-3xl flex flex-row justify-between items-center select-none pt-4 pb-4 mb-8 transition-all duration-300 hover:cursor-pointer`}
        >
            <img src={props.imgSource} alt={"Ice cream"} className={"w-20 h-20 rounded-[43%] mt-2 ml-3 mb-2 select-none"} />
            {getCardContent()}
        </div>
    )
}
