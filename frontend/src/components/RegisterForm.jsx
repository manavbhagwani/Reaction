import { useState } from "react";
import {
    Button,
    Form,
    Segment,
    Header,
    Message,
    Checkbox,
} from "semantic-ui-react";
import axios from "axios";

const RegisterForm = () => {
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        phone_number: "",
        user_name: "",
        agreed_tnc: "",
    });

    const removeError = (e) => {
        const { name } = e.target;
        if (errors[name] !== "") {
            let clone = { ...errors };
            clone[name] = "";
            setErrors(clone);
        }
    };

    const submit = async (e) => {
        try {
            const { email, phone_number, password, user_name, agreed_tnc } =
                e.target;
            console.log(agreed_tnc.value);
            if (!user_name.value) {
                setErrors({ user_name: "This field is required!" });
                return;
            } else if (!phone_number.value) {
                setErrors({ phone_number: "This field is required!" });
                return;
            } else if (!/^\d+$/.test(phone_number.value)) {
                setErrors({
                    phone_number: "Please enter a valid mobile number!",
                });
                return;
            } else if (!email.value) {
                setErrors({ email: "This field is required!" });
                return;
            } else if (!password.value) {
                setErrors({ password: "This field is required!" });
                return;
            } else if (!agreed_tnc.checked) {
                setErrors({
                    agreed_tnc: {
                        content: "This field is required!",
                        pointing: "left",
                    },
                });
                return;
            }
            const response = await axios.post("/api/register/", {
                email: email.value,
                phone_number: phone_number.value,
                password: password.value,
                user_name: user_name.value,
                agreed_tnc: agreed_tnc.checked,
            });
            if (response.data.errors) setErrors(response.data.errors);
            else {
                window.sessionStorage.setItem(
                    "user",
                    JSON.stringify(response.data)
                );
                window.location.href = "/";
            }
        } catch (err) {
            console.log(err.response);
        }
    };
    return (
        <>
            <Header as="h2" className="form-header">
                Register Your Account
            </Header>
            <Segment>
                <Form onSubmit={submit}>
                    <Form.Input
                        size="large"
                        type="text"
                        fluid
                        icon="quote left"
                        iconPosition="left"
                        placeholder="user_name"
                        name="user_name"
                        error={
                            errors.user_name !== "" ? errors.user_name : false
                        }
                        onClick={removeError}
                    />
                    <Form.Input
                        size="large"
                        type="text"
                        fluid
                        icon="phone"
                        iconPosition="left"
                        placeholder="Phone Number"
                        name="phone_number"
                        error={
                            errors.phone_number !== ""
                                ? errors.phone_number
                                : false
                        }
                        onClick={removeError}
                    />
                    <Form.Input
                        size="large"
                        type="email"
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="E-mail address"
                        name="email"
                        error={errors.email !== "" ? errors.email : false}
                        onClick={removeError}
                    />
                    <Form.Input
                        size="large"
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="password"
                        type="password"
                        name="password"
                        error={errors.password !== "" ? errors.password : false}
                        onClick={removeError}
                    />
                    <Form.Field
                        control={Checkbox}
                        label={
                            <label
                                style={{
                                    marginTop: "20px",
                                    fontSize: "1.1rem",
                                }}>
                                I agree to the{" "}
                                <a href="/tnc">Terms and Conditions</a>
                            </label>
                        }
                        name="agreed_tnc"
                        error={
                            errors.agreed_tnc !== "" ? errors.agreed_tnc : false
                        }
                        onClick={() => setErrors("")}
                    />
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
                Have an account ?{" "}
                <a href="/login" id="register-link">
                    Log in
                </a>
            </Message>
        </>
    );
};

export default RegisterForm;
