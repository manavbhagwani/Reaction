import "core-js/stable";
import "regenerator-runtime/runtime";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Dock from "./components/Dock";
import ChatArea from "./components/ChatArea";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
import Spinner from "./components/Spinner";
axios.defaults.baseURL = window.location.origin;

const styles = {
    height: "100%",
    padding: "0px",
    display: "flex",
};

const Inbox = () => {
    const [user, setUser] = useState(false);
    const [contacts, setContacts] = useState(false);
    const [recipient, setRecipient] = useState(false);
    const [ws, setWs] = useState(false);
    const [chatFlag, setChatFlag] = useState(false);
    const [socketState, setSocketState] = useState(false);

    const handleUpdateUser = (user) => {
        let deepCopy = JSON.parse(JSON.stringify(user));
        window.sessionStorage.setItem("user", JSON.stringify(user));
        setUser(deepCopy);
    };

    const handleUpdateContacts = (contacts) => {
        let obj = [];
        contacts.forEach((contact) => {
            obj.push({
                ...contact,
                messages: [contact.messages[contact.messages.length - 1]],
            });
        });
        window.sessionStorage.setItem("contacts", JSON.stringify(obj));
        setContacts(contacts);
    };

    useEffect(() => {
        sessionStorage.clear();
        async function fetchData() {
            try {
                const res = await axios.get("/api/user/");
                res.data = { ...res.data };
                window.sessionStorage.setItem("user", JSON.stringify(res.data));
                setUser(res.data);
            } catch (error) {
                if (error.response.status === 401) {
                    window.location.href = "/login";
                } else console.log(error.response);
            }
        }
        const stored = window.sessionStorage.getItem("user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else fetchData();
    }, []);
    useEffect(() => {
        // TODO: add api call to get known contacts
        if (user === false || contacts !== false) return;
        const stored = window.sessionStorage.getItem("contacts");
        if (stored) {
            let data = JSON.parse(stored);
            let contactMap = new Map();
            data.forEach((contact) => {
                let messages = window.sessionStorage.getItem(contact.email);
                if (messages) contact.messages = JSON.parse(messages);
                contactMap.set(contact.email, contact);
            });
            setContacts(contactMap);
            return;
        }
        async function fetchContacts() {
            try {
                const res = await axios.get("/api/connections/");
                let { contacts } = res.data;
                const contactMap = new Map();
                window.sessionStorage.setItem(
                    "contacts",
                    JSON.stringify(contacts)
                );
                contacts.forEach((contact) =>
                    contactMap.set(contact.email, contact)
                );
                setContacts(contactMap);
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    window.location.href = "/login";
                } else console.log(error.response);
            }
        }
        fetchContacts();
    }, [user]);

    useEffect(() => {
        if (contacts == false || ws != false) return;
        const newWs = new WebSocket("ws://" + window.location.host);
        newWs.onopen = () => {
            setWs(newWs);
        };
        newWs.onclose = (e) => {
            if (e.code == 4001 || e.code == 1011 || e.code == 4002)
                window.location.href = "/login";
            else if (e.code == 4000) setSocketState(2);
            else console.log(e);
        };
    }, [contacts]);

    useEffect(() => {
        if (ws === false) return;
        ws.onmessage = async (e) => {
            if (e.data === "pong") ws.send("ping");
            else {
                // TODO: Maybe a better way to handle updates.
                const data = JSON.parse(e.data);
                if (data.type === "get-all") setSocketState(1);
                const { messages } = data;
                if (messages.length == 0) return;
                let copy = new Map(contacts);
                let updateRecipient = false;
                let updateContacts = false;
                await messages.forEach(async (message) => {
                    if (copy.has(message.contact)) {
                        copy.get(message.contact).messages.push(message);
                        updateRecipient =
                            recipient && message.contact == recipient.email;
                    } else {
                        updateContacts = true;
                        try {
                            const res = await axios.get("/api/user/", {
                                params: { email },
                            });
                            const contact = res.data;
                            contact.messages = [message];
                            copy.set(email, contact);
                        } catch (error) {
                            console.log(error.data);
                        }
                    } // new contact
                });
                if (updateRecipient) setRecipient(copy.get(recipient.email));
                if (updateContacts) handleUpdateContacts(copy);
                else setContacts(copy);
                copy.forEach((contact) =>
                    window.sessionStorage.setItem(
                        contact.email,
                        JSON.stringify(contact.messages)
                    )
                );
            }
        };
        if (recipient === false) {
            ws.send("get-all");
            ws.send("ping");
        }
    }, [ws, recipient]);

    const handleSendMessage = (text) => {
        text = text.trim();
        if (text.length === 0) return;
        const timeStamp = Date.now();
        const message = {
            text,
            timeStamp,
            isSent: true,
            contact: recipient.email,
        };
        ws.send(
            JSON.stringify({
                type: "message",
                ...message,
            })
        );
        if (recipient && recipient.messages.length == 0) {
            ws.send(
                JSON.stringify({
                    type: "new-connection",
                    first: user.email,
                    second: recipient.email,
                })
            );
        }
        let copy = new Map(contacts);
        copy.get(recipient.email).messages.push(message); // weirdly this recipient state also gets updated by this.
        setContacts(copy);
        setRecipient({ ...copy.get(recipient.email) });
        window.sessionStorage.setItem(
            recipient.email,
            JSON.stringify(recipient.messages)
        );
    };
    const getOlderMessages = async (contact) => {
        if (contact.hasOldest) return;
        try {
            const res = await axios.get("/api/messages/", {
                params: {
                    recipient: contact.email,
                    time_stamp: contact.messages[0].timeStamp,
                },
            });
            let { messages } = res.data;
            contact.messages = messages.concat(contact.messages);
            window.sessionStorage.setItem(
                contact.email,
                JSON.stringify(contact.messages)
            );
            setContacts(new Map(contacts));
        } catch (err) {
            if (err.response.status === 404) {
                contact.hasOldest = true;
                contacts.set(contact.email, contact);
                handleUpdateContacts(new Map(contacts));
            }
        }
    };
    const handleChangeRecipient = async (contact) => {
        if (recipient.email === contact.email) {
            setChatFlag(true);
            return;
        }
        if (contact.messages.length < 20) await getOlderMessages(contact);
        setRecipient(contact);
        setChatFlag(true);
    };
    const handleCloseChat = () => {
        setChatFlag(false);
    };
    return contacts != false && socketState != false ? (
        socketState == 2 ? (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: "3vh",
                    color: "#00d8ff",
                }}>
                Please disconnect your session from other devices
            </div>
        ) : (
            <div style={styles}>
                <Dock
                    handleUpdateUser={handleUpdateUser}
                    user={user}
                    recipient={recipient}
                    chatFlag={chatFlag}
                    handleChangeRecipient={handleChangeRecipient}
                    contacts={contacts}
                />
                <ChatArea
                    user={user}
                    recipient={recipient}
                    chatFlag={chatFlag}
                    handleCloseChat={handleCloseChat}
                    handleSendMessage={handleSendMessage}
                    getOlderMessages={getOlderMessages}
                />
            </div>
        )
    ) : (
        <Spinner type="HashLoader" />
    );
};

ReactDOM.render(<Inbox />, document.getElementById("root"));
