import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import formHandler from "../../utils/FormHandler"
import { validateTask } from "../../utils/validation"
import axios from 'axios';
import FeatherIcon from "feather-icons-react"
import { toast } from "react-toastify";
import { isEmpty } from 'underscore';
import { useDispatch } from "react-redux";
import { toggleConfirmationDialog, toggleLoader } from "../../redux/actions";


export const TaskForm = (props) => {
    const dispatch = useDispatch();
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false);
    const [tasksList, setTasksList] = useState([]);
    const {
        handleChange,
        handleSubmit,
        setValue,
        initForm,
        values,
        errors,
    } = formHandler(stateTask, validateTask);

    useEffect(() => {
        dispatch(toggleLoader(true))
        axios.get(`http://127.0.0.1:8000/task`)
            .then((res) => {
                setTasksList(res.data)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                dispatch(toggleLoader(false))
            })
    }, [])

    useEffect(() => {
        if (["View", "State", "Edit"].includes(props.type) && !isEmpty(props.selectedTask)) {

            initForm(props.selectedTask)
        }
    }, [props.type, props.selectedTask])

    console.log(props.selectedTask)
    console.log(values)

    useEffect(() => {
        dispatch(toggleLoader(true))
        axios.get(`http://127.0.0.1:8000/task`)
            .then((res) => {
                setTasksList(res.data)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                dispatch(toggleLoader(false))
            })
    }, [])

    useEffect(() => {
        if (!isSubmit || props.type !== "Add") {
            return
        }
        dispatch(toggleLoader(true))
        axios.post(`http://127.0.0.1:8000/task`, values)
            .then((res) => {
                console.log(res.data)
                props.update()
                props.onHide();
                toast.success(`Successfully Task Created`)
            }).catch((err) => {
                toast.error("Something went wrong")
            }).finally(() => {
                dispatch(toggleLoader(false))
                setIsSubmit(false);
                resetForm()
            })
    }, [isSubmit]);

    function resetForm() {
        initForm({})
    }

    useEffect(() => {
        if (!isSubmit || props.type !== "Edit") {
            return
        }
        dispatch(toggleLoader(true))
        axios.put(`http://127.0.0.1:8000/task/${values.id}`, values)
            .then((res) => {
                console.log(res.data)
                toast.success(`Successfully Task Updated`)
                props.update()
            }).catch((err) => {
                toast.error("Something went wrong")
            }).finally(() => {
                dispatch(toggleLoader(false))
                setIsSubmit(false);
                resetForm()
                props.onHide()
            })
    }, [isSubmit])

    console.log(values.id);

    function stateTask() {
        setIsSubmit(true)
    }

    function statusUpdate(status) {
        values.status = status
        console.log(props.selectedTask)
        console.log(props.selectedTask._id)

        dispatch(toggleLoader(true))
        axios.put(`http://127.0.0.1:8000/task/${values.id}`, values)
            .then((res) => {
                console.log(res.data)
                toast.success(`Successfully Updated`)
                props.update()
            }).catch((err) => {
                toast.error("Something went wrong")
            }).finally(() => {
                dispatch(toggleLoader(false))
                setIsSubmit(false)
                resetForm()
                props.onHide()
            })
    }

    console.log(props.type)

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            scrollable={true}
        >
            <Modal.Header closeButton onHide={() => {
                if (!formSubmitted) {
                    initForm({});
                }
            }}>
                {<Modal.Title id="contained-modal-title-vcenter">
                    {props.type === "Add" && <div> Nuevo Entregable</div>}
                    {props.type === "View" && <div> Ver Entregable</div>}
                    {props.type === "Edit" && <div> Editar Entregable</div>}
                    {props.type === "State" && <div> Estatus del Entregable</div>}
                </Modal.Title>}
            </Modal.Header>
            <Modal.Body scrollable>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div className={"pop-up-form-container"}>
                            <div className={"row"}>

                                {<div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Nombre del Entregable</label>
                                        <input name={"taskName"} placeholder={"Nombre del Entregable"}
                                            className={`form-control ${errors.taskName ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            id="exampleInputEmail5"
                                            onChange={handleChange}
                                            value={values.taskName || ""}
                                            aria-describedby="emailHelp"
                                            disabled={["View", "State"].includes(props.type)} />
                                        {errors.taskName && <p className={"text-red"}>{errors.taskName}</p>}
                                    </div>
                                </div>}
                                <div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Categoria</label>
                                        <select className={`form-control ${errors.category ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            value={values.category || ""}
                                            name={"category"}
                                            aria-label="Default select example"
                                            disabled={["View", "State"].includes(props.type)}>
                                            <option hidden>Select Category</option>
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Health">Health</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Miscellaneous">Miscellaneous</option>
                                        </select>
                                        {errors.category && <p className={"text-red"}>{errors.category}</p>}
                                    </div>
                                </div>
                                {<div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Fecha de Inicio</label>
                                        <input id="startDate"
                                            className={`form-control ${errors.startDate ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            name={"startDate"}
                                            value={values.startDate || ""}
                                            type="date"

                                            disabled={["View", "State"].includes(props.type)} />

                                        {errors.startDate && <p className={"text-red"}>{errors.startDate}</p>}
                                    </div>
                                </div>}
                                {<div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Hora de Inicio</label>
                                        <input id="startTime"
                                            className={`form-control  ${errors.startTime ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            name={"startTime"}
                                            value={values.startTime || ""}
                                            type="time"

                                            disabled={["View", "State"].includes(props.type)} />
                                        {errors.startTime && <p className={"text-red"}>{errors.startTime}</p>}
                                    </div>
                                </div>}
                                {<div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Fecha de Termino</label>
                                        <input id="endDate"
                                            className={`form-control ${errors.endDate ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            name={"endDate"}
                                            value={values.endDate || ""}
                                            type="date"

                                            disabled={["View", "State"].includes(props.type)} />

                                        {errors.endDate && <p className={"text-red"}>{errors.endDate}</p>}
                                    </div>
                                </div>}
                                {<div className={"col-md-6"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Hora de Termino</label>
                                        <input id="endTime"
                                            className={`form-control  ${errors.endTime ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            name={"endTime"}
                                            value={values.endTime || ""}
                                            type="time"

                                            disabled={["View", "State"].includes(props.type)} />
                                        {errors.endTime && <p className={"text-red"}>{errors.endTime}</p>}
                                    </div>
                                </div>}
                                {<div className={"col-md-12"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail5"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Descripcion</label>
                                        <textarea name={"description"} placeholder={"Coloca una descripcion"} rows="5"
                                            className={`form-control ${errors.description ? "border-red" : ""}${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            id="exampleInputEmail5"
                                            onChange={handleChange}
                                            value={values.description || ""}
                                            aria-describedby="emailHelp"
                                            disabled={["View", "State"].includes(props.type)} />
                                        {errors.description && <p className={"text-red"}>{errors.description}</p>}
                                    </div>
                                </div>}

                                {<div className={"col-md-12"}>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1"
                                            className={`form-label ${["View", "State"].includes(props.type) ? " task-view-text " : "form-label"}`}>Estado</label>
                                        <select className={`form-control ${errors.status ? "border-red" : ""} ${["View", "State"].includes(props.type) ? " form-control:disabled " : ""} `}
                                            onChange={handleChange}
                                            value={values.status || ""}
                                            name={"status"}
                                            aria-label="Default select example"
                                            disabled={["View", "State"].includes(props.type)}>
                                            <option hidden>SELECCIONA UN ESTATUS</option>
                                            <option value="RUNNING">Running</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="FAILED">Failed</option>
                                        </select>
                                        {errors.status && <p className={"text-red"}>{errors.status}</p>}
                                    </div>
                                </div>}

                                <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="color" className="form-label">
                          Color
                        </label>
                        <div className={"d-flex gap-3"}>
                          <div className={"select-round green-round " + (values.color === "#01452EFF" ? "selected-round" : "")} onClick={() => setValue({ color: "#01452EFF", textColor: "#01452E" })}>
                            {values.color === "#01452EFF" && <FeatherIcon className={"text-white"} icon={"check"} />}
                          </div>
                          <div className={"select-round red-round " + (values.color === "#FF0000FF" ? "selected-round" : "")} onClick={() => setValue({ color: "#FF0000FF", textColor: "#FF0000" })}>
                            {values.color === "#FF0000FF" && <FeatherIcon className={"text-white"} icon={"check"} />}
                          </div>
                          <div className={"select-round darkBlue-round " + (values.color === "#0000FFFF" ? "selected-round" : "")} onClick={() => setValue({ color: "#0000FFFF", textColor: "#0000FF" })}>
                            {values.color === "#0000FFFF" && <FeatherIcon className={"text-white"} icon={"check"} />}
                          </div>
                          <div className={"select-round purple-round " + (values.color === "#800080FF" ? "selected-round" : "")} onClick={() => setValue({ color: "#800080FF", textColor: "#800080" })}>
                            {values.color === "#800080FF" && <FeatherIcon className={"text-white"} icon={"check"} />}
                          </div>
                          <div className={"select-round yellow-round " + (values.color === "#BCBC07" ? "selected-round" : "")} onClick={() => setValue({ color: "#BCBC07", textColor: "#FFFF00" })}>
                            {values.color === "#BCBC07" && <FeatherIcon className={"text-dark"} icon={"check"} />}
                          </div>
                        </div>
                      </div>
                    </div>

                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className={"btn btn-secondary"}
                    onClick={() => {
                        if (!formSubmitted) { // Prevent hiding the modal if the form is submitted
                            props.onHide();
                            initForm({});
                        }
                    }}
                >
                    Cancelar
                </button>

                {props.type === "Add" && <button
                    type="button"
                    className={"btn btn-secondary tasks-dropdown-btn"}
                    onClick={handleSubmit}
                >
                    Guardar
                </button>}

                {props.type === "State" && <div className='d-flex gap-2'>
                    <button
                        type="button"
                        className={"btn btn-warning"}
                        onClick={() => statusUpdate("RUNNING")}
                    >
                        Running
                    </button>
                    <button
                        type="button"
                        className={"btn btn-success"}
                        onClick={() => statusUpdate("COMPLETED")}
                    >
                        Completed
                    </button>
                    <button
                        type="button"
                        className={"btn btn-danger"}
                        onClick={() => statusUpdate("FAILED")}
                    >
                        Failed
                    </button>
                </div>}

                {props.type === "Edit" && <button
                    type="button"
                    className={"btn btn-secondary tasks-dropdown-btn"}
                    onClick={handleSubmit}
                >
                    Update
                </button>}
            </Modal.Footer>
        </Modal>
    )
}
