import {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {addMember} from "@/api/members.api";

export const MemberForm = ({closeModal, getMembers}: { closeModal: () => void, getMembers: () => void }) => {


    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        name: Yup.string().required("Name is required"),
    });

    type MemberFormValues = {
        email: string;
        name: string;
    };

    const handleSubmit = async (values: MemberFormValues) => {

        setError("");


        const email = values.email;
        const name = values.name;

        try {

            const data = await addMember({email, name});


            if ("error" in data) {
                setError(data.error)
            } else {

                closeModal()
                getMembers()
            }

            console.log("data", data);
        } catch (err: any) {
            console.log("error", err);

            setError(err.response?.data?.message || "Add member failed");
        }

    }

    return (
        <div className="member-form">
            <Formik
                initialValues={{email: "", name: ""}}
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
                        <button className={'btn primary'} type="submit">Add member</button>
                    </div>


                </Form>
            </Formik>
        </div>
    )

}