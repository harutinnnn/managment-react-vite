import {useEffect, useState} from "react";
import {FolderKanban, PencilLine, Trash2, X} from "lucide-react";
import Modal from "react-modal";
import {ProjectsForm} from "@/pages/projects/ProjectsForm";
import {ProjectType} from "@/types/ProjectType";
import {deleteProject, getProject, getProjects} from "@/api/project.api";
import {ConfirmPopup} from "@/context/ConfirmPopup";
import './Projects.css'
import {capitalize} from "@/helpers/text.helper";
import {formatDateTime} from "@/helpers/date.heper";
import {ProgressBar} from "@/components/ProgressBar";
import {useNavigate} from "react-router-dom";

const Projects = () => {

    const navigate = useNavigate();

    const [projects, setProjects] = useState<ProjectType[] | []>([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [editProject, setEditProject] = useState<ProjectType | null>(null)

    const getProjectsHandle = async (): Promise<void> => {

        try {
            const projects: ProjectType[] = await getProjects();
            setProjects(projects)

        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message) // safe access
            } else {
                console.error(e) // fallback for non-Error thrown values
            }
        }
    }

    useEffect(() => {
        (async () => {
            await getProjectsHandle()
        })()
    }, [setProjects])

    const openModal = () => {
        setIsOpen(true);
    }

    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
    }

    const closeModal = () => {
        setIsOpen(false);
        setEditProject(null);
    }


    const [deleteId, setDeleteId] = useState<number>(0)
    const [showPopup, setShowPopup] = useState(false);
    const cancelDelete = () => {
        setShowPopup(false)
        setDeleteId(0)
    }
    const confirmDelete = async () => {
        if (deleteId > 0) {

            await deleteProject(deleteId)
            setDeleteId(0)
            setShowPopup(false);
            const projects = await getProjects();
            setProjects(projects)

        }
    };


    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };


    const editProjectFn = async (id: number) => {

        const project: ProjectType = await getProject(id)
        setEditProject(project)
        setIsOpen(true);
    }

    const handleDelete = (id: number) => {
        setDeleteId(id)
        setShowPopup(true)
    };


    return (<>
            <div className={"page-header mb-20"}>
                <h1>Projects</h1>
                <button className={"btn ml-auto"} onClick={() => {
                    openModal()
                }}>
                    <span>Add new</span>
                    <FolderKanban size={16}/>
                </button>
            </div>


            <div className="projects-list">
                {projects && projects.map(project => (
                    <div className="project-item" key={project.id}>
                        <h3 className="project-title">
                            <span>{project.title}</span>


                            <div className="project-actions">
                                <Trash2 size={20} className={'delete-project'}
                                        onClick={() => handleDelete(project.id)}/>

                                <PencilLine size={24} className={"edit-project"}
                                            onClick={() => editProjectFn(project.id)}/>

                                <FolderKanban size={24} onClick={() => navigate('/project/' + project.id)}
                                              className="project-tasks"/>

                            </div>
                        </h3>

                        <ProgressBar percent={project.progress} label={"Progress"}/>


                        <div className={"project-status " + project.status}>{capitalize(project.status)}</div>
                        <p className="project-desc">
                            {project.description}
                        </p>

                        <div className="project-created">{formatDateTime(project.createdAt.toString())}</div>
                    </div>
                ))}

            </div>

            {showPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this item?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <X onClick={closeModal} className="close-modal"/>

                <ProjectsForm closeModal={() => closeModal()} getProjects={() => getProjectsHandle()}
                              projectData={editProject}/>

            </Modal>
        </>
    );
};

export default Projects;