import { IconPlus, IconSearch, IconX } from "@tabler/icons"
import { useNavigate } from "react-router"
import { colors } from "../../constants/colors"
import { useEffect, useMemo, useState } from "react"
import { debounce } from "lodash"
import { TextInput } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../types"
import { supabase } from "../../lib/Supabase"
import { dbTables } from "../../constants/keys"
import { filterGameByIds, removeGames, restoreUnfilteredGames, saveGamesBeforeFilter } from "../../store/userSlice"

export default function GameSectionHeader() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userId = useSelector((state: RootState) => state.user.id)

    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [participatingGameIds, setParticipatingGameIds] = useState<number[]>([])

    const handleChange = (e: any) => {
        ;(async () => {
            const searchTerm = e.target.value
            if (searchTerm.length <= 0) {
                dispatch(removeGames())
                return
            }
            const { data, error } = await supabase.rpc("search_games", { game_term: searchTerm })
            if (error) {
                console.log("Error searching games", error)
                return
            }
            const idsToDisplay: string[] = []
            data?.forEach((game) => {
                // TODO: Show uppercased matching things on top
                // beneath the perfectly matching ones, put the ones that includes the uppercased search term
                if (game.owner === userId) {
                    idsToDisplay.push(game.id)
                    return
                }
                if (participatingGameIds.includes(game.id)) {
                    idsToDisplay.push(game.id)
                    return
                }
            })
            dispatch(filterGameByIds(idsToDisplay))
        })()
    }

    const debouncedResults = useMemo(() => {
        return debounce(handleChange, 300)
    }, [])

    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    })

    useEffect(() => {
        // fetch participating game ids, and store them for the search
        ;(async () => {
            dispatch(saveGamesBeforeFilter())
            if (showSearch) {
                const { data, error } = await supabase.from(dbTables.playerGamesJoin).select("game").eq("player", userId)
                if (error) {
                    console.log("Error fetching participating game ids ", error)
                    return
                }
                setParticipatingGameIds(data.map((d) => d.game))
                console.log("fetched game ids ", JSON.stringify(data, null, 2))
            }
        })()
    }, [showSearch])

    return (
        <div className={"w-full flex flex-row justify-between items-center"}>
            <p className={"text-white text-5xl font-bold text-center"}>Games</p>
            <div className={"flex flex-row"}>
                {showSearch ? (
                    <>
                        <TextInput onChange={debouncedResults} className={"mt-2"} />
                        <IconX
                            size={33}
                            color={colors.primaryGray}
                            className={"mt-2 ml-4 hover:cursor-pointer"}
                            onClick={() => {
                                dispatch(restoreUnfilteredGames())
                                setParticipatingGameIds([])
                                setShowSearch(false)
                            }}
                        />
                    </>
                ) : (
                    <>
                        <IconPlus
                            size={33}
                            color={colors.primaryGray}
                            className={"mr-4 mt-2 hover:cursor-pointer"}
                            onClick={() => navigate("/addGame")}
                        />
                        <IconSearch
                            size={32}
                            color={colors.primaryGray}
                            className={"mt-2 hover:cursor-pointer"}
                            onClick={() => setShowSearch(true)}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
