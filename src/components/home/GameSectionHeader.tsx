import { IconPlus, IconSearch } from "@tabler/icons"
import { useNavigate } from "react-router"
import { colors } from "../../constants/colors"

export default function GameSectionHeader() {
    const navigate = useNavigate()

    return (
        <div className={"w-full flex flex-row justify-between items-center"}>
            <p className={"text-white text-5xl font-bold text-center"}>Games</p>
            <div className={"flex flex-row"}>
                <IconPlus
                    size={33}
                    color={colors.primaryGray}
                    className={"mr-4 mt-2 hover:cursor-pointer"}
                    onClick={() => navigate("/addGame")}
                />
                <IconSearch size={32} color={colors.primaryGray} className={"mt-2"} />
            </div>
        </div>
    )
}
