import { IconArticle, IconClipboard } from "@tabler/icons"
import { useDispatch, useSelector } from "react-redux"
import { Popover, Tooltip } from "@mantine/core"
import { useState } from "react"
import { clearGame, selectGame } from "../../store/gameSlice"
import { useNavigate } from "react-router"
import { RootState } from "../../types"

export default function ActionBar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const gameId = useSelector((state: RootState) => state.game.gameId)
    const currentCard = useSelector((state: any) => state.game.currentCard)
    const [opened, setOpened] = useState<boolean>(false)
    const size = 25

    return (
        <div className={"w-full flex flex-row justify-center items-center text-white mt-4"}>
            <Tooltip label={"Select Deck"}>
                <div>
                    <IconArticle
                        size={size}
                        onClick={() => {
                            const id = gameId
                            dispatch(clearGame())
                            if (id) dispatch(selectGame(id))
                            navigate("/select")
                        }}
                    />
                </div>
            </Tooltip>
            <Popover opened={opened} withArrow>
                <Popover.Target>
                    <Tooltip label={"Copy"}>
                        <div className={"ml-6"}>
                            <IconClipboard
                                size={size}
                                onClick={() => {
                                    navigator.clipboard.writeText(currentCard)
                                    setOpened(true)
                                    setTimeout(() => {
                                        setOpened(false)
                                    }, 1000)
                                }}
                            />
                        </div>
                    </Tooltip>
                </Popover.Target>

                <Popover.Dropdown>
                    <p className={"text-center text-base"}>Copied!</p>
                </Popover.Dropdown>
            </Popover>
        </div>
    )
}
