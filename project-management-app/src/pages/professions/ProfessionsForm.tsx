import {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AxiosError} from "axios";
import {addProfession, editProfession} from "@/api/profession.api";
import {ProfessionType} from "@/types/ProfessionType";

interface ProfessionFormProps {
    closeModal: () => void;
    getMembers: () => void;
    professionData: ProfessionType | null;
}

interface MemberFormValues {
    name: string;
}

export const ProfessionsForm = ({closeModal, getMembers, professionData}: ProfessionFormProps) => {
    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        name: Yup.string().required("Name is required"),
    });

    const handleSubmit = async (values: MemberFormValues) => {
        setError("");
        try {
            if (professionData) {

                // Logic for Editing
                const result = await editProfession({
                    id: professionData.id,
                    name: values.name,
                });

                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getMembers();
                }
            } else {
                // Logic for Adding
                const result = await addProfession({name: values.name});
                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getMembers();
                }
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Operation failed");
            }
        }
    };

    return (
        <div className="member-form">
            <div className="error-msg">{error}</div>
            <Formik
                // KEY FIX #1: Tell Formik to watch for prop changes
                enableReinitialize={true}
                // KEY FIX #2: Ensure we are using professionData?.name correctly
                initialValues={{name: professionData?.name || ""}}
                validationSchema={memberSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
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
                            <button
                                className={'btn primary'}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {professionData ? "Update Profession" : "Add Profession"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};