import { IconAlignRight, IconCoin } from "@tabler/icons"
import { colors } from "../../constants/colors"

export default function HomeHeader() {
    // TODO: Stateful container fetching coin count and profile picture
    return (
        <div className={"w-full grid grid-cols-3"}>
            <img
                src={require("../../assets/elementIcons/IceCream.png")}
                alt={"Profile picture"}
                className={"w-14 rounded-tl-[65%] rounded-2xl hover:cursor-pointer"}
            />
            <div className={"w-full flex flex-row items-center justify-center"}>
                <IconCoin size={34} stroke={1.3} color={"#e7cc61"} />
                <p className={"text-white text-lg font-bold ml-2 text-white"}>0</p>
            </div>
            <div className={"w-full flex justify-end items-center pr-1"}>
                <IconAlignRight size={30} stroke={1.5} color={colors.primaryGray} className={"hover:cursor-pointer"} />
            </div>
        </div>
    )
}
