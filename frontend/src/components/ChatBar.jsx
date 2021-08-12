import { useRef } from "react";
import { Input, Button } from "semantic-ui-react";

const styles = {
    root: {
        display: "flex",
        justifyContent: "center",
        margin: "0.5%",
        boxSizing: "border-box",
    },
    input: {
        borderRadius: "20px",
    },
};

const ChatBar = ({ handleSendMessage }) => {
    let chatBar = useRef();

    return (
        <form
            autoComplete="off"
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(e.target.message.value);
                e.target.message.value = "";
            }}
            style={styles.root}>
            <Input style={styles.root} className="chat-bar">
                <input
                    ref={chatBar}
                    style={styles.input}
                    name="message"
                    placeholder="Type something :D"
                />
                <span
                    onClick={() => {
                        handleSendMessage(chatBar.current.value);
                        chatBar.current.value = "";
                    }}
                    id="icon-send"
                    style={{
                        position: "absolute",
                        right: "7px",
                        bottom: "2px",
                    }}></span>
            </Input>
        </form>
    );
};

export default ChatBar;
