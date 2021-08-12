import { useState, useRef, useEffect } from "react";
import { lorem } from "faker";
import axios from "axios";
import Loading from "./Loading";
import Message from "./Message";
import ChatBar from "./ChatBar";
import ContactBar from "./ContactBar";
import Spinner from "./Spinner";

const styles = {
    container: {
        paddingLeft: 0,
        height: "85%",
        overflow: "auto",
        scrollbarColor: "lightgray white",
        scrollbarWidth: "thin",
    },
};

const ChatArea = ({
    user,
    recipient,
    chatFlag,
    handleCloseChat,
    handleSendMessage,
    getOlderMessages,
}) => {
    let elem = useRef();
    useEffect(() => {
        if (recipient) elem.current.scrollTop = elem.current.scrollHeight;
    }, [recipient, chatFlag]);
    const onScroll = async (e) => {
        if (e.target.scrollTop > 0 || recipient.hasOldest) return;
        const height = e.target.scrollHeight;
        await getOlderMessages(recipient);
        e.target.scrollTop = e.target.scrollHeight - height - 20;
    };
    return (
        <div className={chatFlag ? "chat-area" : "chat-area d-none"}>
            {recipient ? (
                <>
                    <ContactBar
                        recipient={recipient}
                        handleCloseChat={handleCloseChat}
                    />
                    <div
                        ref={elem}
                        style={styles.container}
                        onScroll={onScroll}>
                        {recipient.messages.map((message, index) => (
                            <Message key={index} message={message} />
                        ))}
                    </div>
                    <ChatBar handleSendMessage={handleSendMessage} />
                </>
            ) : (
                <Spinner type="HashLoader" />
            )}
        </div>
    );
};

export default ChatArea;
