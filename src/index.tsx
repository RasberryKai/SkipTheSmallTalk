import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import { Provider } from "react-redux"
import { persistor, store } from "./store/store"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import AddGame from "./pages/AddGame"
import Selection from "./pages/Selection"
import { PersistGate } from "redux-persist/integration/react"
import Play from "./pages/Play"
import PasswordReset from "./pages/PasswordReset"
import Error404 from "./pages/Error404"
import Username from "./pages/Username"
import DaddyContainer from "./components/common/DaddyContainer"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/signIn",
        element: <SignIn />,
    },
    {
        path: "/signUp",
        element: <SignUp />,
    },
    {
        path: "/addGame",
        element: <AddGame />,
    },
    {
        path: "/select",
        element: <Selection />,
    },
    {
        path: "/play",
        element: <Play />,
    },
    {
        path: "/resetPassword",
        element: <PasswordReset />,
    },
    {
        path: "/username",
        element: <Username />,
    },
    {
        path: "*",
        element: <Error404 />,
    },
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MantineProvider
                theme={{
                    colorScheme: "dark",
                    colors: {
                        red: [
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                            "#ffd331",
                        ],
                        realRed: [
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                            "#FF0000",
                        ],
                    },
                    components: {
                        InputWrapper: {
                            styles: {
                                label: { color: "white" },
                                error: { color: "#f9fb02" },
                            },
                        },
                        Input: {
                            styles: {
                                error: { color: "#f9fb02" },
                            },
                        },
                        TextInput: {
                            defaultProps: {
                                variant: "filled",
                                radius: "md",
                            },
                        },
                        PasswordInput: {
                            defaultProps: {
                                variant: "filled",
                                radius: "md",
                            },
                        },
                    },
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <NotificationsProvider>
                    <DaddyContainer>
                        <RouterProvider router={router} />
                    </DaddyContainer>
                </NotificationsProvider>
            </MantineProvider>
        </PersistGate>
    </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
