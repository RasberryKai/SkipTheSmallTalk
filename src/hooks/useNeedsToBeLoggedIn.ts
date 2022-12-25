import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { RootState } from "../types"
import { useEffect } from "react"

export default function useNeedsToBeLoggedIn() {
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loggedIn) {
            navigate("/signIn")
        }
    }, [loggedIn])
}
