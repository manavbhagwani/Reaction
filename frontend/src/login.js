import "core-js/stable";
import "regenerator-runtime/runtime";
import { hot } from "react-hot-loader/root";
import ReactDOM from "react-dom";
import { Grid, Segment } from "semantic-ui-react";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import "./styles.css";
import "semantic-ui-css/semantic.min.css";
axios.defaults.baseURL = window.location.origin;

axios.defaults.baseURL = window.location.origin;

axios.defaults.baseURL = window.location.origin;

const styles = {
    root: {
        height: "100%",
        margin: "0",
        paddingBottom: "50px",
    },
    column: {
        maxWidth: "600px",
    },
};

const Login = () => (
    <Grid
        textAlign="center"
        verticalAlign="middle"
        style={styles.root}
        className="auth-bg">
        <Grid.Column style={styles.column} textAlign="left">
            <Segment className="shadow">
                <LoginForm />
            </Segment>
        </Grid.Column>
    </Grid>
);

ReactDOM.render(<Login />, document.getElementById("root"));
