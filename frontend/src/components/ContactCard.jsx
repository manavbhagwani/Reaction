import { Grid, Card, Image } from "semantic-ui-react";
import axios from "axios";

const styles = {
    root: {
        boxShadow: "none",
        marginTop: 0,
        marginBottom: 0,
        color: "#e0e0e0",
        background: "hsl(225deg 17% 19% / 0%)",
    },
    description: {
        fontSize: "1.1em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};

const ContactCard = ({ handleChangeRecipient, contact, recipient }) => {
    const { userName, day, messages, src } = contact;
    const message =
        messages.length > 0 ? messages[messages.length - 1].text : "LOREM";
    return (
        <>
            <Card
                fluid
                style={styles.root}
                onClick={() => {
                    handleChangeRecipient(contact);
                }}>
                <Card.Content>
                    <Grid verticalAlign="middle" columns={2} divided>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Image
                                    circular
                                    floated="left"
                                    size="tiny"
                                    src={src}
                                />
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <div>
                                    <strong>{userName}</strong>
                                </div>
                                <Card.Meta>{day}</Card.Meta>
                                <br />
                                <Card.Description style={styles.description}>
                                    {message}
                                </Card.Description>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
            <hr className="chat-separator" />
        </>
    );
};

export default ContactCard;
