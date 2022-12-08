import { Link } from "react-router-dom"
import { IconArrowBack } from "@tabler/icons"
import NavigationBar from "../components/play/NavigationBar"
import ActionBar from "../components/play/ActionBar"
import QuestionCard from "../components/play/QuestionCard"
import { useMantineTheme } from "@mantine/core"
import { useSelector } from "react-redux"
import { RootState } from "../types"
import { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Play() {
    // check redux store
    // if no game, navigate to home
    useMantineTheme().colorScheme = "dark"
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedIn) navigate("/signIn")
    }, [])

    return (
        <div className={"w-full h-screen flex flex-col items-center"}>
            {/* Backlink */}
            <div className={"w-full flex flex-row justify-start"}>
                <Link to={"/"} className={"text-xl text-white flex flex-row items-center"}>
                    <IconArrowBack />
                    <p className={"underline underline-offset-1 ml-2"}>Home</p>
                </Link>
            </div>
            <div className={"w-full h-full flex flex-col justify-center items-center pb-52"}>
                <QuestionCard />
                <NavigationBar />
                <ActionBar />
            </div>
        </div>
    )
}
