import { Loader } from "semantic-ui-react";

const Loading = () => {
    return (
        <div style={{ height: "100%", width: "100%", paddingTop: "25%" }}>
            <Loader size="massive" active inline="centered" />
        </div>
    );
};

export default Loading;
