import { useState, useEffect } from "react";
import { Card, Icon, Image, Label, Button } from "semantic-ui-react";
import Spinner from "./Spinner";

const styles = {
    root: { boxShadow: "none" },
    img: { margin: "auto" },
    container: {
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
    },
    item: {
        fontSize: "1em",
        margin: "auto",
        marginBottom: "10px",
    },
    content: { border: "0px" },
    button: { maxWidth: "60%", display: "block", margin: "auto" },
};

const ProfileCard = ({ user, result, handleStartChat }) => {
    if (user == "404")
        return (
            <div className="no-user-exists">Sorry, no such user exists!</div>
        );
    return result ? (
        <>
            <Card fluid style={styles.root}>
                <div>
                    <Image
                        src={result.src}
                        size="small"
                        circular
                        style={styles.img}
                    />
                    <div style={styles.container}>
                        <Label style={styles.item}>
                            <Icon name="phone square" />
                            {result.phoneNumber}
                        </Label>
                        <Label style={styles.item}>
                            <Icon name="mail" />
                            {result.email}
                        </Label>
                    </div>
                </div>
                <Card.Content style={styles.content}>
                    <Card.Header>{result.userName}</Card.Header>
                    <Card.Meta>About</Card.Meta>
                    <Card.Description>{result.about}</Card.Description>
                </Card.Content>
            </Card>
            {user.email !== result.email ? (
                <Button
                    fluid
                    style={styles.button}
                    primary
                    onClick={() => {
                        handleStartChat(result);
                    }}>
                    Chat
                </Button>
            ) : null}
        </>
    ) : (
        <div>
            <div className="no-user-exists" style={{ color: "black" }}>
                Search a new user!
            </div>
            <Spinner type="PropagateLoader" />
        </div>
    );
};

export default ProfileCard;
