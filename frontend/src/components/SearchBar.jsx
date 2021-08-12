import { useEffect, useRef } from "react";
import { Input } from "semantic-ui-react";

const styles = {
    root: {
        background: "hsl(225deg 17% 19% / 0%)",
        padding: "10px",
    },
    input: {
        borderRadius: "20px",
        background: "#696c75",
    },
};

const SearchBar = ({ setSearchString, searchType, error }) => {
    const inputRef = useRef(false);
    useEffect(() => {
        if (inputRef) inputRef.current.value = "";
    }, [searchType]);
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (searchType) setSearchString(e.target.input.value);
            }}>
            <Input
                style={styles.root}
                fluid
                placeholder={searchType ? "Find user w/ Email" : "Search..."}>
                <input
                    ref={inputRef}
                    onChange={(e) =>
                        searchType === 0
                            ? setSearchString(e.target.value)
                            : null
                    }
                    style={styles.input}
                    name="input"
                />
            </Input>
        </form>
    );
};

export default SearchBar;
