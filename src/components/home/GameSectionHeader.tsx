import { IconPlus, IconSearch } from "@tabler/icons"

export default function GameSectionHeader() {
    return (
        <div className={"w-full flex flex-row justify-between items-center"}>
            <p className={"text-white text-5xl font-bold text-center"}>Games</p>
            <div className={"flex flex-row"}>
                <IconPlus size={33} color={"#1174f6"} className={"mr-4 mt-2"} />
                <IconSearch size={32} color={"#6f7381"} className={"mt-2"} />
            </div>
        </div>
    )
}
