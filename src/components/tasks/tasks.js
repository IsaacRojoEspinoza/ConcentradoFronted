import React, { useState, useEffect } from 'react'
import Layout from '../../layout/layout'
import FeatherIcon from 'feather-icons-react'
import { TaskForm } from './taskForm'
import { toggleConfirmationDialog, toggleLoader } from "../../redux/actions";
import axios from 'axios'
import { values, pick, filter, pluck, uniq } from "underscore";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateTask } from '../../utils/validation';
import formHandler from "../../utils/FormHandler";
import { filterDataByKey } from "../../utils/utils";

export const Tasks = () => {
  const [modalShow, setModalShow] = useState(false)
  const [modalType, setModalType] = useState("view")
  const [selectedTask, setSelectedTask] = useState(null)
  // const [taskAllList, setTaskAllList] = useState([])
  const [deletedId, setDeletedId] = useState(null)

  const [tasksAllList, setTasksAllList] = useState([])
  const [tasksList, setTasksList] = useState([])
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();

  function isLoading() {
    console.log("All are done")
  }

  function handleSearch(e) {
    let val = e.target.value;
    if (val !== "") {
      let res = filter(tasksAllList, function (item) { return values(pick(item, 'taskName', 'startDate', 'endDate', 'category', 'status')).toString().toLocaleLowerCase().includes(val.toLocaleLowerCase()) });
      console.log(res);
      setTasksList(res);
      console.log(res)
    } else {
      setTasksList(tasksAllList);
    }
  }
  function filterDataByKey(array, category, key = "category") {
    let filteredData = []
    if (category === "All") {
      filteredData = array
    } else {
      filteredData = array.filter((item) => item[key] === category)
    }
    return filteredData
  }

  function colorChange(status) {
    switch (status) {
      case "RUNNING":
        return "bg-warning text-dark"
      case "COMPLETED":
        return "bg-success text-white"
      case "FAILED":
        return "bg-danger text-white"
      default:
        return ""
    }
  }

  function handleDelete(id) {
    dispatch(toggleConfirmationDialog({
      isVisible: true,
      confirmationHeading: ('ARE YOU SURE YOU WANT TO DELETE TASK DATA'),
      confirmationDescription: ('THE DELETE ACTION WILL REMOVE THE TASK DETAILS')
    }));
    setDeletedId(id)
  }

  const confirmationDialog = useSelector(state => {
    return state.setting.confirmationDialog
  });

  console.log(confirmationDialog)
  console.log()
  useEffect(() => {
    if (!confirmationDialog || !confirmationDialog.onSuccess || !deletedId) {
      console.log("deleted")
      return;
    }
    console.log("deleted")
    dispatch(toggleLoader(true))

    axios.delete(`http://127.0.0.1:8000/task/${deletedId}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        setUpdate(!update)
        toast.success(`Successfully Deleted`)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        dispatch(toggleLoader(false))
        setDeletedId(null)
      })
  }, [confirmationDialog])

  useEffect(() => {
    (async () => await fetchData())()
  }, [update]);

  async function fetchData() {
    const data = await axios.get("http://127.0.0.1:8000/task", {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
    setTasksList(data.data);
    setTasksAllList(data.data);
  }

  return (
    <Layout>
      <div className={"container"}>
        <div className={"container-widget"}>
          <div className={"tasks_container"}>
            <h1 className="p-3 heading">Entregables</h1>
            <div className={"table-btn-container d-flex justify-content-end pb-3"}>
              <div className={"tasks-search"}>
                <div className="container-fluid">
                  <form className="d-flex" role="search">
                    {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                    <input className="form-control me-2" onChange={handleSearch} type="search" placeholder="Buscar"
                      aria-label="Search" />
                  </form>
                </div>
              </div>
              <div className={"dropdown"}>
                <button className={"btn btn-secondary dropdown-toggle tasks-dropdown-btn"} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Categoría {/* Change this text to your desired label */}
                </button>
                <ul className={"dropdown-menu dropdown-menu-dark"}>
                  {/* <li><a className={"dropdown-item"} href="#">Work</a></li>
                  <li><a className={"dropdown-item"} href="#">Personal</a></li>
                  <li><a className={"dropdown-item"} href="#">Health</a></li>
                  <li><a className={"dropdown-item"} href="#">Entertainment</a></li>
                  <li><a className={"dropdown-item"} href="#">Miscellaneous</a></li> */}
                  <li><a className={"dropdown-item cursor-pointer"} onClick={() => setTasksList(filterDataByKey(tasksAllList, "All"))}>All</a></li>
                  {uniq(pluck(tasksAllList, "category")).map((item, index) => <li><a className={"dropdown-item cursor-pointer"} key={index + item} onClick={() => setTasksList(filterDataByKey(tasksAllList, item))}>{item.replace("_", " ")}</a></li>)}

                </ul>
              </div>
              <button type="button" className={"btn btn-secondary tasks-dropdown-btn"}
                onClick={() => {
                  setModalType("Add");
                  setModalShow(true)
                }}>
                <FeatherIcon className={"action-icons text-white"} icon={"plus"} />
                Nuevo
              </button>
            </div>
          </div>
          <div className={"table-container"}>
            <table className={"table table-hover table-striped"} >
              <thead className={"top-0 position-sticky h-45"}>
                <tr>
                <th scope="col">Num</th>
                <th scope="col">Nombre</th>
                <th scope="col">Fecha de Inicio</th>
                <th scope="col">Fecha de Conclusion</th>
                <th scope="col">Categoría</th>
                <th scope="col">Estado</th>
                <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {tasksList.map((data, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{data.taskName}</td>
                    <td>{data.startDate}</td>
                    <td>{data.endDate}</td>
                    <td>{data.category.replace("_", " ")}</td>
                    {/* <td>{data.status}</td> */}
                    <td>
                      <div className={"task_state " + (colorChange(data.status))}
                        onClick={() => {
                          let temp = { ...data }
                          temp.date = data.date?.slice(0, 10)
                          setSelectedTask(temp)
                          setModalShow(true)
                          setModalType("State");
                        }
                        }>{data.status}</div>

                    </td>
                    <td>
                      <FeatherIcon className={"action-icons"} icon={"eye"}
                        onClick={() => {
                          setModalType("View");
                          let temp = { ...data }
                          temp.date = data.date?.slice(0, 10)
                          setSelectedTask(temp)
                          // setTasks(data)
                          setModalShow(true)
                        }} />
                      <FeatherIcon className={"action-icons"} icon={"edit"}
                        onClick={() => {
                          // setTasks(data)
                          // let temp = { ...data }
                          // temp.date = data.date?.slice(0, 10)
                          setModalType("Edit");
                          setModalShow(true)
                          setSelectedTask(data)
                        }} />
                      <FeatherIcon className={"action-icons text-red"} icon={"trash-2"} onClick={() => handleDelete(data.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasksList.length === 0 && <div className={"text-center py-5 fw-bold customFont"}>No hay Entregables</div>}
          </div>
        </div>
      </div>

      <TaskForm
        show={modalShow}
        type={modalType}
        selectedTask={selectedTask}
        update={() => setUpdate(!update)}
        onHide={() => {
          setModalShow(false)
          setSelectedTask(null)
        }}
      />
    </Layout >
  )
}
