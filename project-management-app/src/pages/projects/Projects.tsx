import {useEffect, useState} from "react";
import {FolderKanban, SquarePen, Trash2, X} from "lucide-react";
import Modal from "react-modal";
import {ProjectsForm} from "@/pages/projects/ProjectsForm";
import {ProjectType} from "@/types/ProjectType";
import {deleteProject, getProject, getProjects} from "@/api/project.api";
import {ConfirmPopup} from "@/context/ConfirmPopup";


const Projects = () => {

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
                <h1>Projects Page</h1>
                <button className={"btn ml-auto"} onClick={() => {
                    openModal()
                }}>
                    <span>Add new</span>
                    <FolderKanban size={16}/>
                </button>
            </div>

            <div className="items-list">
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>ID:</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created at</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects && projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>{project.createdAt.toString()}</td>
                            <td>{project.status}</td>
                            <td className="actions">

                                <SquarePen size={24} className={'edit-element'}
                                           onClick={() => editProjectFn(project.id)}/>
                                <Trash2 size={24} className={'delete-element'}
                                        onClick={() => handleDelete(project.id)}/>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

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