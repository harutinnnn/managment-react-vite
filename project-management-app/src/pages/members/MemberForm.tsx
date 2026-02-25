import {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {addMember} from "@/api/members.api";
import {AxiosError} from "axios";

export const MemberForm = ({closeModal, getMembers}: { closeModal: () => void, getMembers: () => void }) => {


    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().required("Phone is required"),
        name: Yup.string().required("Name is required"),
    });

    type MemberFormValues = {
        email: string;
        phone: string;
        name: string;
    };

    const handleSubmit = async (values: MemberFormValues) => {

        setError("");


        const email = values.email;
        const phone = values.phone;
        const name = values.name;

        try {

            const data = await addMember({email, phone, name});


            if ("error" in data) {
                setError(data.error)
            } else {

                closeModal()
                getMembers()
            }

        } catch (err) {

            console.log("error", err);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Add member failed");
            }
        }

    }

    return (
        <div className="member-form">
            <div className="error-msg">{error}</div>
            <Formik
                initialValues={{email: "", phone: "", name: ""}}
                validationSchema={memberSchema}
                onSubmit={handleSubmit}
            >
                <Form>

                    <div className={"input-row"}>
                        <label htmlFor="name">Name</label>
                        <Field
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                        />
                        <ErrorMessage name="name" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="email">Email</label>
                        <Field
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                        />
                        <ErrorMessage name="email" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <label htmlFor="phone">Phone</label>
                        <Field
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Phone"
                        />
                        <ErrorMessage name="phone" component="div" className="error-msg"/>
                    </div>

                    <div className={"input-row"}>
                        <button className={'btn primary'} type="submit">Add member</button>
                    </div>


                </Form>
            </Formik>
        </div>
    )

}