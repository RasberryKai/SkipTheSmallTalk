import { combineReducers, configureStore } from "@reduxjs/toolkit"
import UserSlice from "./userSlice"
import { api } from "./middleware/api"
import GameSlice from "./gameSlice"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"

const reducers = combineReducers({
    user: UserSlice,
    game: GameSlice,
})

const persistConfig = {
    key: "primary",
    storage,
}

// @ts-ignore
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })

        return middlewares.concat(api)
    },
})

export const persistor = persistStore(store)
