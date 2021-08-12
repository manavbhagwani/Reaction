import "core-js/stable";
import "regenerator-runtime/runtime";
import { hot } from "react-hot-loader/root";
import ReactDOM from "react-dom";
import RegisterForm from "./components/RegisterForm";
import { Grid, Segment } from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import "./styles.css";
axios.defaults.baseURL = window.location.origin;

axios.defaults.baseURL = window.location.origin;

axios.defaults.baseURL = window.location.origin;

const pageStyles = {
    height: "100%",
    margin: "0",
    paddingBottom: "50px",
};

const Register = () => (
    <Grid
        textAlign="center"
        verticalAlign="middle"
        style={pageStyles}
        className="auth-bg">
        <Grid.Column style={{ maxWidth: 600 }} textAlign="left">
            <Segment className="shadow">
                <RegisterForm />
            </Segment>
        </Grid.Column>
    </Grid>
);

ReactDOM.render(<Register />, document.getElementById("root"));
