import Layout from '../../layout/layout'
import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import FeatherIcon from "feather-icons-react"
import { DtPicker } from 'react-calendar-datetime-picker'
import 'react-calendar-datetime-picker/dist/style.css'
import { validateEvent } from '../../utils/validation'
import formHandler from "../../utils/FormHandler"
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { toggleLoader } from "../../redux/actions";
import axios from 'axios'
import 'moment/locale/es'

// Configura moment para que utilice el idioma español
moment.locale('es');

const messages = {
  allDay: 'Todo el día',
  previous: '< Anterior',
  next: 'Siguiente >',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango',
  showMore: total => `+ Ver más (${total})`,
};


// const CustomYearView = ({ date, ...props }) => {
//   const months = Array.from({ length: 12 }, (e, i) => moment(date).month(i));
//   return (
//     <div className="rbc-year-view">
//       {months.map(month => (
//         <div key={month} className="rbc-month-container">
//           <h4>{month.format('MMMM YYYY')}</h4>
//           <Calendar
//             localizer={localizer}
//             date={month.toDate()}
//             events={props.events}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 300 }}
//             views={[Views.MONTH]}
//             toolbar={false}
//             messages={messages}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// const MyCalendarComponent = () => {
//   const [view, setView] = useState(Views.MONTH);

//   const handleViewChange = (newView) => {
//     setView(newView);
//   };

const localizer = momentLocalizer(moment);

export const Calender = () => {
  const dispatch = useDispatch();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [update, setIsUpdate] = useState(false);

  let events = []
  const [eventList, setEventList] = useState([]);


  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event?.bgColor ? event?.bgColor : '#262c3163',
      borderRadius: '5px',
      opacity: 0.8,
      color: "white",
      border: '0px',
      display: 'block',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
    };
    return {
      style,
    };
  };

  const {
    handleChange,
    handleSubmit,
    setValue,
    values,
    initForm,
    deleteErrors,
    errors,
  } = formHandler(isLoading, validateEvent);


  function isLoading() {
    console.log("loading")
    let data = {
      // id: eventList.length + 1,
      textColor: values.textColor,
      bgColor: values.bgColor,
      title: values.title,
      start: new Date(values.start.year, values.start.month - 1, values.start.day, values.start.hour, values.start.minute, 0),
      end: new Date(values.end.year, values.end.month - 1, values.end.day, values.end.hour, values.end.minute, 0),
      // resourceId: 9,
    }
    // setEventList([...eventList, data])
    console.log(values)
    setIsModalVisible(false);
    setIsSubmitted(true)
  }

  function resetForm() {
    const values = {};
    initForm({ ...values });
    Object.keys(values).forEach((key) => delete values[key]);
    deleteErrors(errors);
    setIsModalVisible(false);
    setIsUpdateAvailable(false);
  }
  function getDateInfo(date) {
    return {
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      month: date.getMonth() + 1, // Adding 1 because getMonth() returns 0-indexed month (0 for January, 1 for February, etc.)
      year: date.getFullYear(),
    };
  }

  function getTasks() {
    axios.get(`http://127.0.0.1:8000/task`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      }
    })
      .then((response) => {
        console.log(response.data)
        let events = response.data.map((task) => {
          const startDate = moment(`${task.startDate} ${task.startTime}`);
          const endDate = moment(`${task.endDate} ${task.endTime}`);
          return {
            id: task.id,
            title: task.taskName,
            description: task.description,
            category: task.category,
            status: task.status,
            start: startDate.toDate(),
            end: endDate.toDate(),
            textColor: 'blue',
            bgColor: task.color
          };
        })
        setEventList(events)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    getTasks()
  }, [update])

  function onSelect(event) {
    setLastSelectedId(event.id);
    setIsModalVisible(true);
    setIsUpdateAvailable(true);
    let value = {
      title: event.title,
      status: event.status,
      category: event.category,
      start: getDateInfo(event.start),
      end: getDateInfo(event.end),
      category: event.category,
      status: event.status,
      description: event.description,
      color: event.color,
      _id: event._id,
    }
    initForm(value);

  }

  const [lastSelectedId, setLastSelectedId] = useState(null);


  function saveUpdateBtn() {
    if (isUpdateAvailable) {
      setIsUpdateAvailable(false)
      if (values.start && values.end) {
        const formattedStartDate = `${values.start.year}-${values.start.month}-${values.start.day}`
        const formattedStartTime = `${values.start.hour}:${values.start.minute}:00`
        const formattedEndDate = `${values.end.year}-${values.end.month}-${values.end.day}`
        const formattedEndTime = `${values.end.hour}:${values.end.minute}:00`
        if (values.color === undefined) {
          values.color = "#015C6CFF"
        }
        const payload = {
          taskName: values.title,
          startDate: formattedStartDate,
          startTime: formattedStartTime,
          endDate: formattedEndDate,
          endTime: formattedEndTime,
          category: values.category,
          status: values.status,
          description: values.description,
          color: values.color
        }
        let url = 'http://127.0.0.1:8000/task/' + lastSelectedId //here
        axios.put(url, payload)
          .then(response => {
            if (response.data === 'Updated Successfully') {
              toast.success("Updated Successfully")
            } else {
              toast.error('Error Updating')
            }
            console.log('PUT Response : ', response.data)
            getTasks()
          })
          .catch(error => {
            console.error(error)
          })
      }
      resetForm()
    }
    else if (!isUpdateAvailable) {
      if (values.start && values.end) {
        const formattedStartDate = `${values.start.year}-${values.start.month}-${values.start.day}`
        const formattedStartTime = `${values.start.hour}:${values.start.minute}:00`
        const formattedEndDate = `${values.end.year}-${values.end.month}-${values.end.day}`
        const formattedEndTime = `${values.end.hour}:${values.end.minute}:00`
        if (values.color === undefined) {
          values.color = "#015C6CFF"
        }
        const payload = {
          taskName: values.title,
          startDate: formattedStartDate,
          startTime: formattedStartTime,
          endDate: formattedEndDate,
          endTime: formattedEndTime,
          category: values.category,
          status: values.status,
          description: values.description,
          color: values.color
        }
        let url = 'http://127.0.0.1:8000/task'
        axios.post(url, payload)
          .then(response => {
            if (response.data === "Added Successfully") {
              toast.success("Added Successfully")
            } else {
              toast.error("Error Adding")
            }
            console.log('POST Response : ', response.data)
            getTasks()
          })
          .catch(error => {
            console.error(error)
          })
      }

    }
  }
  function trashOnClick() {
    if (isUpdateAvailable) {
      console.log('Deleting');
      let url = 'http://127.0.0.1:8000/task/' + lastSelectedId;
      axios.delete(url)
        .then(response => {
          console.log('DELETE Response:', response.data);
          setEventList(prevEvents => prevEvents.filter(event => event.id !== lastSelectedId));
          setIsModalVisible(false);
        })
        .catch(error => {
          console.error(error);
        });
      setIsUpdateAvailable(false)
      resetForm()
    }
  }


  return (
    <Layout>
      <div className={"container"}>
        <div className={"container-widget"}>
          <h1 className="p-3 heading">Calendario</h1>
          <div className={"d-flex justify-content-end pb-3"}>
            <button
              className={"btn btn-secondary tasks-dropdown-btn"}
              onClick={() => setIsModalVisible(!isModelVisible)}
            >
              <FeatherIcon className={"action-icons text-white"} icon={"plus"} /> Add
            </button>
          </div>
          <div className={"calender-container mt-0"}>
            <Calendar
              localizer={localizer}
              events={eventList}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={onSelect}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '80vh', width: '80vw' }}
              messages={messages}
              // views={{ month: true, week: true, day: true, agenda: true, year: CustomYearView }}
              // defaultView={view}
              // onView={handleViewChange}
              // scrollToTime={moment().startOf('day').toDate()}
            />
          </div>

          {isModelVisible && (
            <div className="sa-popup-bg">
              <div className="sa-popup">
                <form onSubmit={handleSubmit} className={'sa-modal-box-style overflow-visible'}>
                  <div className="sa-popup-header modal-header border-radius-top-9">
                    <span className={'sa-model-heading'}>
                      {!isUpdateAvailable ? "Add Event" : "Edit Event"}{" "}
                    </span>
                    <div className="sa-popup-close-icon" onClick={resetForm}>
                      <FeatherIcon className={"sa-modal-close-icon"} icon={"x"} />
                    </div>
                  </div>
                  <div className={"row p-3"}>
                    <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="title" className="form-label calendar-label">
                          Title
                        </label>
                        <input
                          name={"title"}
                          placeholder={"Enter Name"}
                          className={`form-control ${errors.title ? "border-red" : ""}`}
                          id="title"
                          onChange={handleChange}
                          value={values.title || ""}
                        />
                        {errors.title && <p className={"text-red"}>{errors.title}</p>}
                      </div>
                    </div>

                    <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="start" className="form-label">
                          Start Time
                        </label>
                        <DtPicker
                          placeholder={"Enter Start Time"}
                          inputClass={`form-control ${errors.start ? "border-red" : ""}`}
                          onChange={(time) => setValue({ start: time })}
                          withTime
                          initValue={values.start}
                          showTimeInput
                        />
                        {errors.start && <p className={"text-red"}>{errors.start}</p>}
                      </div>
                    </div>

                    <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="end" className="form-label">
                          End Time
                        </label>
                        <DtPicker
                          placeholder={"Enter End Time"}
                          inputClass={`form-control ${errors.end ? "border-red" : ""}`}
                          onChange={(time) => setValue({ end: time })}
                          withTime
                          initValue={values.end}
                          showTimeInput
                        />
                        {errors.end && <p className={"text-red"}>{errors.end}</p>}
                      </div>
                    </div>

                    <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="category" className="form-label">
                          Category
                        </label>
                        <select
                          name={"category"}
                          className={`form-control ${errors.category ? "border-red" : ""}`}
                          id="category"
                          onChange={handleChange}
                          value={values.category || ""}
                        >
                          <option value="">Select Category</option>
                          <option value="Work">Work</option>
                          <option value="Personal">Personal</option>
                          <option value="Health">Health</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Miscellaneous">Miscellaneous</option>
                        </select>
                        {errors.category && <p className={"text-red"}>{errors.category}</p>}
                      </div>
                    </div>

                    <div className={"col-md-6"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="status" className="form-label">
                          Status
                        </label>
                        <select
                          name={"status"}
                          className={`form-control ${errors.status ? "border-red" : ""}`}
                          id="status"
                          onChange={handleChange}
                          value={values.status || ""}
                        >
                          <option value="">Select Status</option>
                          <option value="FAILED">Failed</option>
                          <option value="RUNNING">Running</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                        {errors.status && <p className={"text-red"}>{errors.status}</p>}
                      </div>
                    </div>

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
                  <div className={"row p-3"}>
                    <div className={"col-md-12"}>
                      <div className="mb-3 me-3">
                        <label htmlFor="title" className="form-label calendar-label">
                          Description
                        </label>
                        <textarea name={"description"} placeholder={"Enter Description"} rows="5"
                          className={`form-control ${errors.description ? "border-red" : ""}`}
                          id="exampleInputEmail5"
                          onChange={handleChange}
                          value={values.description || ""}
                          aria-describedby="emailHelp"
                          // disabled={["View", "State"].includes(props.type)} 
                          />
                        {errors.description && <p className={"text-red"}>{errors.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="sa-popup-footer">
                    <div className={"d-flex justify-content-between"}>
                      <FeatherIcon className={"text-red cursor-pointer"} icon={"trash-2"} onClick={trashOnClick} />
                      <div>
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-secondary ms-3 px-3 tasks-dropdown-btn"
                          onClick={saveUpdateBtn}
                        >
                          {isUpdateAvailable ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}  