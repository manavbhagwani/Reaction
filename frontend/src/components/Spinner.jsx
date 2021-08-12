import HashLoader from "react-spinners/HashLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import { css } from "@emotion/react";

const override = css`
    display: block;
    margin: auto;
`;

const Spinner = ({ type }) => {
    return type == "HashLoader" ? (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
            }}>
            <HashLoader color={"#00d8ff"} size={60} css={override} />
        </div>
    ) : (
        <div
            style={{
                height: "8vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <ScaleLoader
                color={"#00d8ff"}
                css={override}
                speedMultiplier={0.8}
            />
        </div>
    );
};

export default Spinner;
