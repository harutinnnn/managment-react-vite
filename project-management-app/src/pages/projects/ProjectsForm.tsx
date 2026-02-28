    import {useState} from "react";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AxiosError} from "axios";
import {ProjectStatuses, ProjectType} from "@/types/ProjectType";
import {capitalize} from "@/helpers/text.helper";
import {addProject, editProject} from "@/api/project.api";

interface ProjectFormProps {
    closeModal: () => void;
    getProjects: () => void;
    projectData: ProjectType | null;
}

interface ProjectFormValues {
    title: string;
    description: string;
    status: ProjectStatuses
}

export const ProjectsForm = ({closeModal, getProjects, projectData}: ProjectFormProps) => {
    const [error, setError] = useState("");

    const memberSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        status: Yup.mixed<ProjectStatuses>().oneOf(Object.values(ProjectStatuses), "Invalid gender")
            .required("Gender is required"),
    });

    const handleSubmit = async (values: ProjectFormValues) => {
        setError("");
        try {
            if (projectData) {

                // Logic for Editing
                const result = await editProject({
                    id: projectData.id,
                    description: values.description,
                    title: values.title,
                    status: values.status,
                });

                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getProjects();
                }
            } else {

                // Logic for Adding
                const result = await addProject({
                    title: values.title,
                    description: values.description,
                    status: values.status
                });
                if (result && "error" in result) {
                    setError(result.error);
                } else {
                    closeModal();
                    getProjects();
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
                enableReinitialize={true}
                initialValues={{
                    title: projectData?.title || "",
                    status: projectData?.status || ProjectStatuses.PENDING,
                    description: projectData?.description || ""
                }}
                validationSchema={memberSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
                    <Form>

                        <div className={"input-row"}>
                            <label htmlFor="status">Status *</label>
                            <Field as="select" name="status" id="status">

                                {projectData?.id &&
                                    <>
                                        <option value={ProjectStatuses.COMPLETED}
                                                key={ProjectStatuses.COMPLETED}>{capitalize(ProjectStatuses.COMPLETED)}</option>
                                        <option value={ProjectStatuses.ACTIVE}
                                                key={ProjectStatuses.ACTIVE}>{capitalize(ProjectStatuses.ACTIVE)}</option>
                                    </>
                                }
                                <option value={ProjectStatuses.PENDING}
                                        key={ProjectStatuses.PENDING}>{capitalize(ProjectStatuses.PENDING)}</option>


                            </Field>
                        </div>

                        <div className={"input-row"}>
                            <label htmlFor="title">Title</label>
                            <Field
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Title"
                            />
                            <ErrorMessage name="title" component="div" className="error-msg"/>
                        </div>
                        <div className={"input-row"}>
                            <label htmlFor="description">Description</label>
                            <Field
                                type="text"
                                as="textarea"
                                name="description"
                                id="description"
                                placeholder="Description"
                            />
                            <ErrorMessage name="description" component="div" className="error-msg"/>
                        </div>

                        <div className={"input-row"}>
                            <button
                                className={'btn primary'}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {projectData ? "Update Project" : "Add Project"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};