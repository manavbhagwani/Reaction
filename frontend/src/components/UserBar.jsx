import { useState, useEffect } from "react";
import { Image, Icon, Dropdown } from "semantic-ui-react";
import axios from "axios";

const styles = {
    root: {
        background: "hsl(225deg 17% 19% / 0%)",
        marginTop: 0,
        marginBottom: 0,
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    menu: {
        marginTop: "5px",
        marginRight: "-10px",
    },
    icon: {
        color: "#e0e0e0",
    },
};

const UserBar = ({
    user,
    setSearchString,
    setUser,
    handleSwitch,
    handleProfileButton,
}) => {
    return (
        <div key={user} style={styles.root}>
            <Image
                onClick={handleSwitch}
                size="mini"
                src={user.src + "?" + new Date().getTime()}
                circular
            />
            <div>
                <span style={{ ...styles.icon, fontSize: "1.3em" }}>
                    {user.userName}
                </span>
            </div>
            <Icon
                onClick={() => {
                    setUser(false);
                    setSearchString("");
                    handleSwitch();
                }}
                size="large"
                link
                name="address book outline"
                style={styles.icon}
            />
            <form className="ui form huge">
                <Dropdown
                    pointing="top right"
                    icon="setting"
                    style={styles.icon}>
                    <Dropdown.Menu style={styles.menu}>
                        <Dropdown.Item
                            icon="user"
                            text="Profile"
                            onClick={handleProfileButton}
                        />
                        <Dropdown.Item
                            icon="arrow alternate circle left outline"
                            text="Logout"
                            onClick={() => {
                                async function logout() {
                                    try {
                                        await axios.get("/api/logout/");
                                        sessionStorage.clear();
                                        window.location.href = "/login";
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                                logout();
                            }}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </form>
        </div>
    );
};

export default UserBar;
