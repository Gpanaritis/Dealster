import React, { useState, useRef, useEffect } from "react";
import UserService from "../../services/user.service";
import AuthService from "../../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import "../../styles/AddOffer.css";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const ChangeUsername = () => {

    const form = useRef();
    const checkBtn = useRef();

    const [user, setUser] = useState("");
    const [username, setusername] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
          const user = await AuthService.getUserSecure();
          setUser(user);
        };
        fetchUser();
      }, []);


    const onChangeusername = (e) => {
        const username = e.target.value;
        setusername(username);
    };

    const handleChangeUsername = (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            if (!user) {
                setMessage("You must be logged in to add an offer.");
                setSuccessful(false);
                return;
            }

            UserService.changeUsername(username).then(
                (response) => {
                    setMessage("Username changed successfully!");
                    setSuccessful(true);
                },
                (error) => {
                    const resMessage = error.response.data;

                    setMessage(resMessage);
                    setSuccessful(false);
                }
            );
        }
    };

    return (
        <div className="card card-container">
            <h2 style={{ textAlign: "center" }}>Change Username</h2>
            <Form onSubmit={handleChangeUsername} ref={form}>

                <div className="form-group">
                    <label htmlFor="username">New Username</label>
                    <Input
                        type="text"
                        className="form-control"
                        name="username"
                        value={username}
                        onChange={onChangeusername}
                        validations={[required]}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary btn-block">Change Username</button>
                </div>

                {(message || successful) && (
                    <div className="form-group text-center">
                        <div
                            className={
                                successful ? "alert alert-success" : "alert alert-danger"
                            }
                            role="alert"
                        >
                            {successful ? "Success" : message}
                        </div>
                    </div>
                )}
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
        </div>
    );
};

export default ChangeUsername;
