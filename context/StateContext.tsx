import React, { createContext, useContext, useState } from "react";

export interface IContext {
    activeTab: string
    setActiveTab: (arg: string) => void
    sortType: string
    setSortType: (arg: string) => void
}

const Context = createContext<IContext | null>(null)

type ContextProps = {
    children: React.ReactNode
}

export const StateContext = ({ children }: ContextProps) => {

    const [activeTab, setActiveTab] = useState('all')

    const [sortType, setSortType] = useState('default')

    const ContextValue = {
        activeTab,
        setActiveTab,
        sortType,
        setSortType
    }

    return (
        <Context.Provider value={ContextValue}>
            {children}
        </Context.Provider>
    );
};

const useStateContext = () => useContext(Context) as IContext

export default useStateContext;