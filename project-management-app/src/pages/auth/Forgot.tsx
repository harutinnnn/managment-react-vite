import {useState} from "react";
import {AxiosError} from "axios";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup"
import {forgotRequest} from "@/api/auth.api";

export const Forgot = () => {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const loginSchema = Yup.object({
        forgotEmail: Yup.string().email("Invalid email").required("Required"),
    });

    type LoginFormValues = {
        forgotEmail: string;
    };


    const handleLoginSubmit = async (values: LoginFormValues) => {

        setError("");

        const email = values.forgotEmail;

        try {
            const data = await forgotRequest({email});


            if ("error" in data) {
                setError(data.error)
            } else {
                setSuccess(data?.message)
            }

        } catch (err) {

            console.error(err);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Forgot failed");
            }
        }
    };


    return (

        <div>


            <h1 className={"mb-20"}>Sign In</h1>
            {error.length > 0 && <div className="error-msg">{error}</div>}
            {success.length > 0 && <div className="success-msg">{success}</div>}
            <Formik
                initialValues={{forgotEmail: ""}}
                validationSchema={loginSchema}
                onSubmit={handleLoginSubmit}
            >
                <Form>
                    <div className={"input-row"}>
                        <label htmlFor="email">Email</label>
                        <Field
                            type="email"
                            name="forgotEmail"
                            id="forgotEmail"
                            placeholder="Email"
                        />
                        <ErrorMessage name="forgotEmail" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <button className={'btn primary'} type={"submit"}>Forgot</button>
                    </div>
                </Form>
            </Formik>
        </div>

    )

}