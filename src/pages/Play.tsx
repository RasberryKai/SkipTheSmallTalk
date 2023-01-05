import { Link } from "react-router-dom"
import { IconArrowBack } from "@tabler/icons"
import QuestionCard from "../components/play/QuestionCard"
import { useMantineTheme } from "@mantine/core"
import { useDispatch } from "react-redux"
import ControlBar from "../components/play/ControlBar"
import AppContainer from "../components/common/AppContainer"
import { updateLevel } from "../store/gameSelectionSlice"

export default function Play() {
    const dispatch = useDispatch()
    useMantineTheme().colorScheme = "dark"

    return (
        <AppContainer>
            <div className={"w-full h-screen flex flex-col items-center"}>
                {/* Backlink */}
                <div className={"w-full flex flex-row justify-start"}>
                    <Link
                        to={"/select"}
                        onClick={() => dispatch(updateLevel(null))}
                        className={"text-xl text-white flex flex-row items-center"}
                    >
                        <IconArrowBack />
                        <p className={"ml-2"}>Back</p>
                    </Link>
                </div>
                <div className={"w-full h-full flex flex-col justify-center items-center pb-52"}>
                    <QuestionCard />
                    <div className={"mb-6"} />
                    <ControlBar />
                </div>
            </div>
        </AppContainer>
    )
}
