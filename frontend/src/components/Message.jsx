const makeStyles = (isSent) => {
    const styles = {
        root: {
            borderRadius: "5px",
            paddingBottom: "5px",
            display: "inline-flex",
            float: isSent ? "right" : "left",
            clear: "both",
            margin: "10px 0px 10px 0px",
        },
        text: {
            padding: "5px",
            border: "1px solid " + (!isSent ? "#88bb71" : "#94c2ec"),
            borderRadius: "5px",
            borderTopLeftRadius: isSent ? "5px" : "0px",
            borderTopRightRadius: isSent ? "0px" : "5px",
            display: "inline-flex",
            flexDirection: "column",
            backgroundColor: !isSent ? "#88bb71" : "#94c2ec",
        },
        p: {
            margin: "5px",
            maxWidth: "400px",
            color: !isSent ? "#404040" : "black",
        },
        sub: {
            textAlign: "right",
            wordSpacing: 5,
            margin: "6px 0px 6px 0px",
            color: !isSent ? "#404040" : "black",
        },
    };
    return styles;
};
const Message = ({ message }) => {
    const { text, timeStamp, isSent } = message;
    const date = new Date(timeStamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeStr =
        date.getDate() +
        "-" +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " @" +
        hours +
        ":" +
        minutes;
    const styles = makeStyles(isSent);
    return (
        <div style={styles.root}>
            <div className={isSent ? "arrow-right" : "arrow-left"} />
            <div style={styles.text}>
                <p style={styles.p}>{text}</p>
                <sub style={styles.sub}>{timeStr}</sub>
            </div>
        </div>
    );
};

export default Message;
