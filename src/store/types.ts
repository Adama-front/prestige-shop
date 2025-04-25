import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import store from "./store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typage du dispatch pour gérer les actions asynchrones
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typage du useSelector pour accéder au state avec TypeScript
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
