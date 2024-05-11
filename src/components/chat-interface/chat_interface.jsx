import React, { useState, useRef, useEffect, useContext } from 'react';
import './chatInterface.css';
import useOutsideClick from "../use_outside_click";
import { GlobalContext } from '../../context';

import { AiOutlineUser } from 'react-icons/ai';
import { LuSend } from "react-icons/lu";
import SettingButton from '../setting-button';

export default function ChatInterface({ isOnline }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const ref = useRef();
    useOutsideClick(ref, () => setIsChatOpen(false));

    const statusColor = isOnline ? 'green' : 'lightgray';
    const [pending, setPending] = useState(false);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const { allMessages, setAllMessages, showSettings, setShowSettings, apiKey, setApiKey } = useContext(GlobalContext);

    const messagesEndRef = useRef(null);

    // chatbot content
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
        }
    }, [allMessages, showSettings]); // Scroll to bottom whenever allMessages changes

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (!isChatOpen) {
            setShowSettings(false);
        }
    };

    function keyupHandler(userMessage) {
        setMessage(userMessage);
        // console.log(userMessage);
    }

    function keyDownHandler(event) {
        if (event.key === 'Enter') {
            handleMessageSubmit();
        }
    };

    function handleMessageSubmit() {
        if (!message) return;
        console.log(`User Message: ${message}`);
        const userMessage = { role: "user", message: message };
        setAllMessages([...allMessages, userMessage]);
        // setMessage("");
        document.getElementById("message").value = "";
        setPending(true);
    }

    function handleSettingSubmit() {
        console.log("Settings submitted");
        setShowSettings(false);
    }

    // console.log(apiKey);

    function updateChatMessage(content = "") {
        setAllMessages(allMessages => {
            const updatedMessages = [...allMessages];
            updatedMessages[updatedMessages.length - 1].message += content;
            return updatedMessages;
        });
    }

    async function validateKey() {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/chat/validate_credentials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
        });

        const data = await response.json();
        return data;
    }

    async function chat() {
        try {
            const chatMessage = { role: "assistant", message: "" };
            setAllMessages([...allMessages, chatMessage]);
            const validKey = await validateKey();
            const validity = validKey.validity
            // console.log(`Key validity: ${validity}`);
            if (!validity) {
                updateChatMessage("Please setup valid OPENAI API KEY to proceed.");
                setPending(false);
                setMessage("");
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    message: message,
                }),
            });
            async function streamToString(body) {
                // setAllMessages(allMessages => {
                //     const updatedMessages = [...allMessages];
                //     updatedMessages[updatedMessages.length - 1].message = ""; // Clear previous message
                //     return updatedMessages;
                // });
                updateChatMessage("");
                const reader = body?.pipeThrough(new TextDecoderStream()).getReader();
                while (reader) {
                    let stream = await reader.read();
                    // console.log("the stream", stream);
                    if (stream.done) break;
                    const chunks = stream.value
                        .replaceAll(/^data: /gm, "")
                        .split("\n")
                        .filter((c) => Boolean(c.length) && c !== "[DONE]")
                        .map((c) => JSON.parse(c));
                    if (chunks) {
                        for (const chunk of chunks) {
                            const content = chunk.choices[0].delta.content;
                            if (!content) continue;
                            // chatMessage.message += content;
                            // setAllMessages(allMessages => {
                            //     const updatedMessages = [...allMessages];
                            //     updatedMessages[updatedMessages.length - 1].message += content;
                            //     return updatedMessages;
                            // });
                            updateChatMessage(content);
                        }
                    }
                }
                // console.log(`Complete response message: ${chatMessage}`);
            }
            streamToString(response.body);
            setPending(false);
            setMessage("");

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (pending) {
            // getDummyResponse();
            chat();
        }

    }, [pending])

    return (
        <div className="chat-interface" ref={ref}>
            {isChatOpen ? (
                <div className="chat-window">
                    <div className="header">
                        <div className='logo'>
                            <AiOutlineUser fontSize='1.5rem' />
                        </div>

                        <div className='head-title'>
                            <h3>Live Chatbot</h3>
                            <span style={{ color: statusColor }}>{isOnline ? "Online" : "Offline"}</span>
                        </div>
                        <SettingButton />

                    </div>
                    <div className='chat-body'>
                        <div
                            className="content"
                            style={{ display: showSettings ? "none" : "block" }}
                        >
                            {
                                allMessages && allMessages.length > 0
                                    ? allMessages.map(messageItem => <div className={`message ${messageItem.role}`}>
                                        <div style={{
                                            width: "100%", display: "flex",
                                            justifyContent: messageItem.role === "assistant" ? "left" : "right"
                                        }}>
                                            <div className="avatar"><AiOutlineUser fontSize='1.5rem' /></div>
                                            <div
                                                className="text"
                                                style={{
                                                    order: messageItem.role === "assistant" ? 0 : -1,
                                                    justifySelf: "end",
                                                }}
                                            ><p>{messageItem.message}</p></div>
                                        </div>

                                    </div>)
                                    : null
                            }
                            <div ref={messagesEndRef} />
                        </div>
                        <div
                            className='chat-settings'
                            style={{ display: showSettings ? "block" : "none" }}
                        >
                            <h3>Settings</h3>
                            <p>OPENAI API KEY:</p>
                            <input
                                type={visible ? "text" : "password"}
                                value={apiKey}
                                onMouseEnter={() => setVisible(true)}
                                onMouseLeave={() => setVisible(false)}
                                onChange={(event) => { setApiKey(event.target.value) }}
                            ></input>
                            <button onClick={handleSettingSubmit}>Save Changes</button>
                        </div>
                    </div>

                    <div className="footer">
                        <input id='message'
                            type="text" placeholder="Type your message here"
                            onKeyUp={(event) => { keyupHandler(event.target.value) }}
                            onKeyDown={keyDownHandler}
                        />
                        <button onClick={handleMessageSubmit}><LuSend size={"18"} /></button>
                    </div>
                </div>
            ) : (
                <div className="floating-icon" onClick={toggleChat}>
                    <AiOutlineUser fontSize='2rem' />
                    <div className="status-indicator" style={{ backgroundColor: statusColor }}></div>
                </div>
            )}
        </div>
    );
}