import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext";
import {registerRequest} from "@/api/auth.api";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup"

export const Register = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const signupSchema = Yup.object({
        companyName: Yup.string().min(3, "Minimum 3 characters").required("Required"),
        name: Yup.string().min(3, "Minimum 3 characters").required("Required"),
        address: Yup.string().min(3, "Minimum 3 characters").required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Required"),
    });

    type SignupFormValues = {
        companyName: string;
        name: string;
        address: string;
        email: string;
        password: string;
        confirmPassword: string;
    };


    const handleSubmit = async (values: SignupFormValues) => {

        setError("");

        const companyName = values.companyName;
        const name = values.name;
        const email = values.email;
        const password = values.password;
        const address = values.address;


        try {
            const data = await registerRequest({companyName, name, email, password, address});

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);

            login(data.token, data.user);

            navigate("/");

        } catch (err: any) {

            setError(err.response?.data?.message || "Login failed");
        }
    };


    return (
        <div>


            <h1 className={"mb-20"}>Sign Up</h1>

            {error.length > 0 && <div className="error-msg">{error}</div>}
            <Formik
                initialValues={{companyName: "", name: "", email: "", password: "", confirmPassword: "", address: ""}}
                validationSchema={signupSchema}
                onSubmit={handleSubmit}
            >
                <Form>

                    <div className={"input-row"}>
                        <label htmlFor="companyName">Company name *</label>
                        <Field
                            type="text"
                            id="companyName"
                            name="companyName"
                            placeholder="Company name"
                        />
                        <ErrorMessage name="companyName" component="div" className="error-msg"/>
                    </div>


                    <div className={"input-row"}>
                        <label htmlFor="name">Your name *</label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Company name"
                        />
                        <ErrorMessage name="name" component="div" className="error-msg"/>
                    </div>


                    <div className={"input-row"}>
                        <label htmlFor="email">Your Email *</label>
                        <Field
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                        />
                        <ErrorMessage name="email" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="password">Password *</label>
                        <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                        />
                        <ErrorMessage name="password" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="confirmPassword">Password *</label>
                        <Field
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Password confirmation"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="address">Company address (optional)</label>
                        <Field
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Address"
                        />
                        <ErrorMessage name="address" component="div" className="error-msg"/>
                    </div>


                    <div className={"input-row"}>
                        <button className={'btn primary'}>Register</button>
                    </div>
                </Form>
            </Formik>

        </div>

    )

}