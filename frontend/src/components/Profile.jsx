import { useState, useRef } from "react";
import {
    Button,
    Icon,
    Image,
    Label,
    TextArea,
    Form,
    Input,
} from "semantic-ui-react";
import axios from "axios";

const styles = {
    root: {
        padding: "5px",
        display: "flex",
        flexDirection: "column",
    },
    item: {
        margin: "2vh auto",
    },
    button: {
        marginTop: "5px",
        marginRight: "auto",
    },
    label: {
        margin: "1vh auto",
        fontSize: "1em",
    },
};

// setSrc(URL.createObjectURL(input.current.files[0]))
const Profile = ({ user, handleExit, handleUpdateUser }) => {
    const [src, setSrc] = useState(user.src);
    const [userName, setUserName] = useState(user.userName);
    const [about, setAbout] = useState(user.about);
    let input = useRef();

    const submit = async (e) => {
        e.preventDefault();
        var formData = new FormData();
        let flag = false;
        if (input.current.files[0]) {
            flag = true;
            formData.append("file", input.current.files[0]);
        }
        if (user.userName != userName) {
            flag = true;
            formData.append("userName", userName);
        }
        if (user.about != about) {
            flag = true;
            formData.append("about", about);
        }
        if (flag) {
            try {
                const res = await axios.post("/api/user/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                handleUpdateUser({
                    ...user,
                    about,
                    userName,
                    src: res.data ? res.data.src : user.src,
                });
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <form onSubmit={submit} style={styles.root}>
            <Button
                type="button"
                size="mini"
                onClick={handleExit}
                icon
                style={styles.button}>
                <Icon name="close" />
            </Button>
            <Image
                onClick={() => {
                    input.current.click();
                }}
                src={src}
                size="small"
                style={styles.item}
                circular
                className="upload-dp"
            />
            <input
                name="dp"
                ref={input}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                style={{ display: "none" }}
                onChange={() =>
                    setSrc(URL.createObjectURL(input.current.files[0]))
                }
            />
            <Label style={styles.label}>
                <Icon name="phone square" />
                {user.phoneNumber}
            </Label>
            <Label style={styles.label}>
                <Icon name="mail" />
                {user.email}
            </Label>
            <Input
                name="userName"
                style={styles.item}
                size="small"
                icon="pencil alternate"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
            />
            <TextArea
                style={styles.item}
                placeholder="About"
                rows={2}
                onChange={(e) => setAbout(e.target.value)}
                value={about}
            />
            <Button
                type="submit"
                animated="vertical"
                style={styles.item}
                size="small">
                <Button.Content hidden>Save</Button.Content>
                <Button.Content visible>
                    <Icon name="save" />
                </Button.Content>
            </Button>
        </form>
    );
};

export default Profile;
