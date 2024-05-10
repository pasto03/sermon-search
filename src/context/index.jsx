import { createContext, useState } from "react";


export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
    const [allMessages, setAllMessages] = useState([
        {"role": "assistant", "message": "Hello! How can I help you?"},
        {"role": "user", "message": "What's the weather like today?"},
        {"role": "assistant", "message": "The weather is sunny!"},
    ]);

    return <GlobalContext.Provider
        value={{
            allMessages,
            setAllMessages
        }}
    >{children}</GlobalContext.Provider>
}