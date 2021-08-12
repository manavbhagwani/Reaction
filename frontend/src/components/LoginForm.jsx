import { useState } from "react";
import { Button, Form, Segment, Header, Message } from "semantic-ui-react";
import axios from "axios";

const LoginForm = () => {
    const [errors, setErrors] = useState("");

    const submit = async (e) => {
        try {
            const { email, password } = e.target;
            if (!email.value) {
                setErrors({ email: "This field is required!" });
                return;
            } else if (!password.value) {
                setErrors({ password: "This field is required!" });
                return;
            }
            const response = await axios.post("/api/login/", {
                email: email.value,
                password: password.value,
            });
            window.sessionStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );
            window.location.href = "/";
        } catch (err) {
            console.log(err.response);
            setErrors(err.response.data.errors);
        }
    };

    return (
        <>
            <Header as="h2" className="form-header">
                Log-in into your account
            </Header>
            <Segment>
                <Form onSubmit={submit} error={false}>
                    <Form.Input
                        size="large"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="E-mail address"
                        type="text"
                        name="email"
                        error={errors.email ? errors.email : false}
                        onClick={() => setErrors("")}
                    />
                    <Form.Input
                        size="large"
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                        name="password"
                        error={errors.password ? errors.password : false}
                        onClick={() => setErrors("")}
                    />
                    <div
                        style={{
                            marginTop: "20px",
                            marginBottom: "10px",
                            fontSize: "1.1rem",
                        }}>
                        <a href="/reset">Forgot Password?</a>
                    </div>
                    <Button
                        size="large"
                        type="submit"
                        className="button-submit"
                        fluid
                        color="blue">
                        Submit
                    </Button>
                </Form>
            </Segment>
            <Message size="large" attached="bottom" className="">
                New to us ?{" "}
                <a href="/register" id="register-link">
                    Register here
                </a>
            </Message>
        </>
    );
};

export default LoginForm;
