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


const ChangePassword = () => {

    const form = useRef();
    const checkBtn = useRef();

    const [user, setUser] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const user = await AuthService.getUserSecure();
            setUser(user);
        };
        fetchUser();
    }, []);

    const onChangeOldPassword = (e) => {
        const password = e.target.value;
        setOldPassword(password);
    };

    const onChangeNewPassword = (e) => {
        const password = e.target.value;
        setNewPassword(password);
    };

    const handleChangePassword = (e) => {
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

            UserService.changePassword(oldPassword, newPassword).then(
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
            <h2 style={{ textAlign: "center" }}>Change Password</h2>
            <Form onSubmit={handleChangePassword} ref={form}>

                <div className="form-group">
                    <label htmlFor="price">Old Password</label>
                    <Input
                        type="password"
                        className="form-control"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={onChangeOldPassword}
                        validations={[required]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">New Password</label>
                    <Input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={newPassword}
                        onChange={onChangeNewPassword}
                        validations={[required]}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-primary btn-block">Change Password</button>
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

export default ChangePassword;
