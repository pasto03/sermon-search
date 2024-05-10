import React, { useState, useRef, useEffect, useContext } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { LuSend } from "react-icons/lu";
import './chatInterface.css';
import useOutsideClick from "./use_outside_click";
import { GlobalContext } from '../context';

export default function ChatInterface({ isOnline }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const ref = useRef();
    useOutsideClick(ref, () => setIsChatOpen(false));

    const statusColor = isOnline ? 'green' : 'lightgray';
    const [pending, setPending] = useState(false);
    const [message, setMessage] = useState("");
    const { allMessages, setAllMessages } = useContext(GlobalContext);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
        }

    }, [allMessages]); // Scroll to bottom whenever allMessages changes

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    function keyupHandler(userMessage) {
        setMessage(userMessage);
        console.log(userMessage);
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
        setMessage("");
        document.getElementById("message").value = "";
        setPending(true);
    }

    function getDummyResponse() {
        const dummyResponse = { role: "assistant", message: "Dummy Response" };
        setAllMessages([...allMessages, dummyResponse]);
        setPending(false);
    }

    // console.log(allMessages);

    useEffect(() => {
        if (pending) {
            getDummyResponse();
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

                    </div>
                    <div className="content">
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
                    <div className="footer">
                        <input id='message'
                            type="text" placeholder="Type your message here"
                            onKeyUp={(event) => { keyupHandler(event.target.value) }}
                            onKeyDown={keyDownHandler}
                        />
                        <button onClick={handleMessageSubmit}><LuSend /></button>
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