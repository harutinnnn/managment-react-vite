import {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AxiosError} from "axios";
import {addSkill} from "@/api/skills.api";

export const SkillForm = ({closeModal, getMembers}: { closeModal: () => void, getMembers: () => void }) => {


    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        name: Yup.string().required("Name is required"),
    });

    type MemberFormValues = {
        name: string;
    };

    const handleSubmit = async (values: MemberFormValues) => {

        setError("");


        const name = values.name;

        try {

            const data = await addSkill({name});


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
                initialValues={{name: ""}}
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
                        <button className={'btn primary'} type="submit">Add skill</button>
                    </div>


                </Form>
            </Formik>
        </div>
    )

}