import { useEffect, useState, useRef } from "react";
import { name, image, lorem } from "faker";
import axios from "axios";
import UserBar from "./UserBar";
import Profile from "./Profile";
import ProfileCard from "./ProfileCard";
import SearchBar from "./SearchBar";
import ContactCard from "./ContactCard";

const styles = {
    borderRight: "1px solid lightgrey",
    paddingLeft: "0px",
    paddingRight: "0px",
    height: "100%",
    overflowY: "scroll",
    diplay: "flex",
    flexDirection: "column",
    background: "hsl(225deg 17% 19% / 95%)",
};

const Dock = ({
    user,
    recipient,
    contacts,
    chatFlag,
    handleChangeRecipient,
    handleUpdateUser,
}) => {
    const [profileFlag, setProfileFlag] = useState(false);
    // Flag to display profile. Used in this component for conditional rendering.
    // setProfileFlag: @UserBar, @Profile
    const [searchType, setSearchType] = useState(0);
    // Switches between searching known users and searching global users via email.
    // Type 0: Search known, Type 1: Search global
    // searchType: @Contacts
    // setSearchType: @UserBar
    const [searchString, setSearchString] = useState("");
    const Contacts = ({ searchString }) => {
        // TODO: MIGHT BE GETTING RESET TOO OFTEN CHECK.
        let contactList = [];
        contacts.forEach((contact) => {
            if (
                contact.userName
                    .toLowerCase()
                    .indexOf(searchString.toLowerCase().trim()) !== -1
            )
                contactList.push(contact);
        });
        {
            contactList.sort((contact1, contact2) => {
                const message1 =
                    contact1.messages[contact1.messages.length - 1];
                const message2 =
                    contact2.messages[contact2.messages.length - 1];
                return message2.timeStamp - message1.timeStamp;
            });
        }
        if (contactList.length == 0)
            return (
                <div className="no-user-exists">
                    Sorry, no such user exists!
                </div>
            );
        return contactList.map((contact, index) => (
            <ContactCard
                key={index}
                contact={contact}
                handleChangeRecipient={handleChangeRecipient}
                recipient={recipient}
            />
        ));
    };

    const [result, setSearchResult] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        async function fetchUser(email) {
            try {
                let data;
                if (email === user.email) data = user;
                else if (contacts.has(email)) data = contacts.get(email);
                else {
                    const response = await axios.get("/api/user/", {
                        params: { email },
                    });
                    data = response.data;
                }
                setSearchResult(data);
            } catch (error) {
                // setError(error.data.error);
                if (error.response.data.errors == "User does not exist.")
                    setSearchResult(404);
            }
        }
        if (searchType == 1 && searchString.trim().length > 0)
            fetchUser(searchString);
    }, [searchString]);
    return (
        <div
            id={"dock"}
            className={
                !chatFlag ? "scroll-hide shadow" : "scroll-hide shadow d-none"
            }
            style={styles}>
            <UserBar
                user={user}
                setUser={setSearchResult}
                setSearchString={setSearchString}
                handleSwitch={() => {
                    setProfileFlag(false);
                    setSearchType(searchType == 0 ? 1 : 0);
                }} // @Image.onClick, @Icon.onClick
                handleProfileButton={() => setProfileFlag(true)} // @Dropdown.Item.onClick
            />
            {profileFlag ? (
                <Profile
                    user={user}
                    handleUpdateUser={handleUpdateUser}
                    handleExit={() => setProfileFlag(false)} // @Button.onClick
                />
            ) : (
                <>
                    <SearchBar
                        setSearchString={setSearchString}
                        searchType={searchType}
                        error={error}
                    />
                    {searchType ? (
                        <ProfileCard
                            user={user}
                            result={result}
                            handleStartChat={(recipient) => {
                                setSearchType(0);
                                setSearchString("");
                                handleChangeRecipient(recipient);
                            }}
                        />
                    ) : (
                        <Contacts searchString={searchString} />
                    )}
                </>
            )}
        </div>
    );
};

export default Dock;
