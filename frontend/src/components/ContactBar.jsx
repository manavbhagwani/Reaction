import { Image, Icon } from "semantic-ui-react";

const styles = {
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "7.5%",
        boxSizing: "border-box",
        background: "white",
    },
    item: {
        margin: "10px",
    },
};

const ContactBar = ({ recipient, handleCloseChat }) => (
    <>
        <Icon
            onClick={handleCloseChat}
            className="button-none"
            style={{ position: "absolute", marginTop: "4.5%" }}
            name="arrow left"
            size="large"
        />
        <div style={styles.root}>
            <Image
                src={recipient.src}
                circular
                size="mini"
                style={styles.item}
            />
            <span style={{ ...styles.item, fontSize: "1.3em" }}>
                {recipient.userName}
            </span>
        </div>
    </>
);

export default ContactBar;
