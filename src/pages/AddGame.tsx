import React, { useEffect, useRef, useState } from "react"
import Header from "../components/common/Header"
import RemovableUserItem from "../components/addGame/RemovableUserItem"
import InputSelectionMenu from "../components/addGame/InputSelectionMenu"
import { useMantineTheme, TextInput, Center } from "@mantine/core"
import { DynamicInput, RootState } from "../types"
import ButtonWrapper from "../components/common/ButtonWrapper"
import { supabase } from "../lib/Supabase"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { dbTables } from "../constants/keys"
import useNeedsToBeLoggedIn from "../hooks/useNeedsToBeLoggedIn"
import ShareGamePage from "../components/addGame/ShareGamePage"

export default function AddGame() {
    useNeedsToBeLoggedIn()
    useMantineTheme().colorScheme = "light"

    // TODO: Replace SharedGamePage with redux query

    return (
        <>
            <Header>Share Game!</Header>
            <div className={"flex flex-col w-full h-4/5 justify-between items-end"}>
                <ShareGamePage />
            </div>
        </>
    )
}
