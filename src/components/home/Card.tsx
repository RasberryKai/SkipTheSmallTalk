import { IconSettings, IconTrash, IconX } from "@tabler/icons"
import React, { useEffect, useState } from "react"
import OptionElement from "./OptionElement"
import { deleteGame } from "../../api/games"
import { showNotification } from "@mantine/notifications"
import { useDispatch } from "react-redux"
import { removeGame } from "../../store/userSlice"
import { Center } from "@mantine/core"
import { colors } from "../../constants/colors"
import { Oval } from "react-loader-spinner"

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
    const dispatch = useDispatch()
    const [showFade, setShowFade] = useState<boolean>(false)
    const [showSettings, setShowSettings] = useState<boolean>(false)
    const [deleteOption, setDeleteOption] = useState<boolean>(false)
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
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
        dispatch(removeGame(props.id))
    }

    useEffect(() => {
        if (showSettings) setShowFade(true)
        if (!showSettings) setTimeout(() => setShowFade(false), 300)
    }, [showSettings])

    const getCardContent = () => {
        if (deleteOption) {
            return (
                <div className={"w-full grid grid-rows-2 pr-6 pt-4"}>
                    <Center>
                        <p className={"text-center text-white text-lg font-bold ml-2"}>
                            Are you sure, you want to delete this game?
                        </p>
                    </Center>
                    <div className={"w-full grid grid-cols-2"}>
                        <div
                            onClick={() => {
                                setDeleteOption(false)
                                setShowSettings(false)
                            }}
                            className={"w-full flex justify-center items-center pb-2 border-r-[1px] mt-2"}
                        >
                            <p className={"font-bold text-white pb-2"}>Cancel</p>
                        </div>
                        <div
                            onClick={() => {
                                setDeleteLoading(true)
                                handleDelete().then()
                            }}
                            className={"w-full flex justify-center items-center pb-2 border-l-[1px] mt-2"}
                        >
                            {deleteLoading ? (
                                <Oval
                                    width={"22"}
                                    height={"22"}
                                    color={colors.red}
                                    secondaryColor={colors.softRed}
                                    strokeWidth={2.3}
                                    strokeWidthSecondary={2.3}
                                />
                            ) : (
                                <p className={"font-bold text-red pb-2"}>Delete</p>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        if (showSettings) {
            return (
                <div className={"w-full grid grid-cols-2 ml-2"}>
                    <OptionElement className={"bg-red rounded-l-3xl shadow-sm shadow-red"} onClick={() => setDeleteOption(true)}>
                        <IconTrash size={50} stroke={1.2} color={"#fff"} />
                    </OptionElement>
                    {/*<OptionElement*/}
                    {/*    className={"bg-purple shadow-sm shadow-purple"}*/}
                    {/*    onClick={() => navigate(`/options/${props.id}`)}*/}
                    {/*>*/}
                    {/*    <IconSettings size={50} stroke={1.2} color={"#fff"} />*/}
                    {/*</OptionElement>*/}
                    <OptionElement
                        className={"bg-primary-normal rounded-r-3xl shadow-sm shadow-primary-normal"}
                        onClick={() => setShowSettings(false)}
                    >
                        <IconX size={50} stroke={1.2} color={"#fff"} />
                    </OptionElement>
                </div>
            )
        }

        return (
            <>
                <div className={`grid grid-cols-4 items-center w-full h-full ${showFade ? "animate-fade" : ""}`}>
                    <div className={"h-full ml-4 col-span-3"}>
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
                    <div className={"flex justify-end items-center"}>
                        <IconSettings
                            className={`mr-4 ${showFade ? "animate-fade" : ""}`}
                            color={"#6d75b1"}
                            size={40}
                            stroke={1.5}
                            onClick={() => setShowSettings(!showSettings)}
                        />
                    </div>
                </div>
            </>
        )
    }

    return (
        <div
            className={`bg-primary-normal shadow-xl shadow-primary w-full h-28 flex rounded-3xl flex flex-row justify-between items-center select-none pt-4 pb-4 mb-8 transition-all duration-300 hover:cursor-pointer overflow-hidden`}
        >
            <img src={props.imgSource} alt={"Ice cream"} className={"w-20 h-20 rounded-[43%] mt-2 ml-3 mb-2 select-none"} />
            {getCardContent()}
        </div>
    )
}
