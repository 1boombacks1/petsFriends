import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        await fetch('http://localhost:4000/api/register', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        setRegistered(true);
    }

    if (registered) {
        return <Navigate to="/login"/>;
    }

    return (
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please register</h1>
            <input
                type="text"
                className="form-control"
                placeholder="input name"
                required
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-100 btn btn-lg btn-primary" type="submit">
                Submit
            </button>
        </form>
    );
};

export default Register;
