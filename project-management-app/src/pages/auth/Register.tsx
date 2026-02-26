import {useState} from "react";
import {registerRequest} from "@/api/auth.api";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup"
import {AxiosError} from "axios";
import {Gender} from "@/enums/Gender";
import {capitalize} from "@/helpers/text.helper";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";

export const Register = () => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const signupSchema = Yup.object({
        companyName: Yup.string().min(3, "Minimum 3 characters").required("Company name is required"),
        name: Yup.string().min(3, "Minimum 3 characters").required("Name is required"),
        address: Yup.string().min(3, "Minimum 3 characters").required("Address is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        gender: Yup.mixed<Gender>()
            .oneOf(Object.values(Gender), "Invalid gender")
            .required("Gender is required"),
        phone: Yup.string().required("Phone is required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Required"),
    });

    type SignupFormValues = {
        companyName: string;
        name: string;
        address: string;
        email: string;
        gender: Gender;
        phone: string;
        password: string;
        confirmPassword: string;
    };


    const handleSubmit = async (values: SignupFormValues) => {

        setError(null);
        setDisableBtn(true);

        const companyName = values.companyName;
        const name = values.name;
        const email = values.email;
        const gender = values.gender;
        const phone = values.phone;
        const password = values.password;
        const address = values.address;


        try {
            const data = await registerRequest({companyName, name, email, gender, phone, password, address});

            if ("error" in data) {
                setError(data.error as string);
            } else {

                setSuccess("Successfully registered please check your email!");

                setTimeout(() => {
                    setSuccess(null);
                }, 5000)

                values.companyName = ''
                values.name = ''
                values.email = ''
                values.phone = ''
                values.password = ''
                values.address = ''
            }
            setDisableBtn(false);

        } catch (err) {

            setDisableBtn(false);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Login failed");

            }
        }
    };


    return (
        <div>


            <h1 className={"mb-20"}>Sign Up</h1>

            {error && <Alerts text={error} type={AlertEnums.danger}/>}
            {success && <Alerts text={success} type={AlertEnums.success}/>}
            <Formik
                initialValues={{
                    companyName: "",
                    name: "",
                    email: "",
                    gender: Gender.MALE,
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    address: ""
                }}
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
                            placeholder="Some company"
                        />
                        <ErrorMessage name="companyName" component="div" className="error-msg"/>
                    </div>


                    <div className={"input-row"}>
                        <label htmlFor="name">Your name *</label>
                        <Field
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John..."
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
                        <label htmlFor="email">Gender *</label>
                        <Field as="select" name="professionId" id="professionId">

                            <option value={Gender.MALE}
                                    key={Gender.MALE}>{capitalize(Gender.MALE)}</option>
                            <option value={Gender.FEMALE}
                                    key={Gender.FEMALE}>{capitalize(Gender.FEMALE)}</option>
                            <option value={Gender.UNKNOWN}
                                    key={Gender.UNKNOWN}>{capitalize(Gender.UNKNOWN)}</option>


                        </Field>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="phone">Your phone *</label>
                        <Field
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="+ 9 ..."
                        />
                        <ErrorMessage name="phone" component="div" className="error-msg"/>
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
                        <button className={'btn primary'} type={"submit"} disabled={disableBtn}>Register</button>
                    </div>
                </Form>
            </Formik>

        </div>

    )

}