import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Login1 = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signed, setSigned] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });

        const content = await response.json();

        setSigned(true);
        props.setName(content.name);
    }

    if (signed) {
        return <Navigate to={"/petForm"}/>;
    }

    return (
        <form onSubmit={submit}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
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
                Sign in
            </button>
        </form>
    );
};

export default Login1;
