import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginRequest } from "@/api/auth.api";
import { AxiosError } from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"

export const Login = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState("");


    const loginSchema = Yup.object({
        loginEmail: Yup.string().email("Invalid email").required("Required"),
        loginPassword: Yup.string().min(6, "Minimum 6 characters").required("Required"),
    });

    type LoginFormValues = {
        loginEmail: string;
        loginPassword: string;
    };


    const handleLoginSubmit = async (values: LoginFormValues) => {

        setError("");

        const email = values.loginEmail;
        const password = values.loginPassword;

        try {
            const data = await loginRequest({ email, password });

            if ("error" in data) {
                setError(data.error)
            } else {
                localStorage.setItem("refreshToken", data.refreshToken);

                login(data.token, data.user);

                navigate("/");
                localStorage.setItem("accessToken", data.token);

            }


        } catch (err) {

            console.error(err);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Login failed");
            }
        }
    };


    return (

        <div>


            <h1 className={"mb-20"}>Sign In</h1>
            {error.length > 0 && <div className="error-msg">{error}</div>}
            <Formik
                initialValues={{ loginEmail: "", loginPassword: "" }}
                validationSchema={loginSchema}
                onSubmit={handleLoginSubmit}
            >
                <Form>
                    <div className={"input-row"}>
                        <label htmlFor="email">Email</label>
                        <Field
                            type="email"
                            name="loginEmail"
                            id="loginEmail"
                            placeholder="Email"
                        />
                        <ErrorMessage name="loginEmail" component="div" className="error-msg" />
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="loginPassword">Password</label>
                        <Field
                            type="password"
                            id="loginPassword"
                            placeholder="Password"
                            name="loginPassword"
                        />
                        <ErrorMessage name="loginPassword" component="div" className="error-msg" />
                    </div>

                    <div className={"input-row"}>
                        <button className={'btn primary'} type={"submit"}>Sign in</button>
                    </div>
                </Form>
            </Formik>
        </div>

    )

}