import React, { useEffect, useState } from 'react';
import Layout from '../../layout/layout';
import formHandler from "../../utils/FormHandler";
import { validateTaskSetting } from "../../utils/validation";
import { toggleLoader } from "../../redux/actions";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import PasswordSetting from "../password-setting/password-setting";
import Cookies from 'js-cookie';


const Settings = () => {
    const dispatch = useDispatch();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const {
        handleChange,
        handleSubmit,
        setValue,
        initForm,
        values,
        errors,
    } = formHandler(taskSetting, validateTaskSetting);



    const handleSubmitt = (e) => {
        e.preventDefault()

        dispatch(toggleLoader(true));
        const token = Cookies.get('tokenCookie');
        const config = {
            headers: {
                'Authorization': `Token ${token}`
            }
        };
        axios.put('http://127.0.0.1:8000/user/', {
            email: values.email,
            username: values.username
        }, config)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setValue(res.data.data)
                    toast.success("Successfully Updated")
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error("Failed to Update")
                }

            })
            .catch((err) => {
                toast.error("Failed to update user data");
                console.error('Error updating user profile', err);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .finally(() => {
                dispatch(toggleLoader(false));
            });
    }

    function taskSetting() {
        setFormSubmitted(true);
    }

    useEffect(() => {
        getUserDetails();
    }, [])

    function getUserDetails() {
        dispatch(toggleLoader(true));
        const token = Cookies.get('tokenCookie');
        const config = {
            headers: {
                'Authorization': `Token ${token}`
            }
        };
        axios.get('http://127.0.0.1:8000/user/', config)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    console.log(res.data.data)
                    setValue(res.data.data)

                }
            })
            .catch((err) => {
                toast.error("Failed to update user data");
                console.error('Error updating user profile', err);
            })
            .finally(() => {
                dispatch(toggleLoader(false));
            });
    }

    return (
        <Layout>
            <div className={'container'}>
                <div className={'container-widget'}>
                    <h1 className={'p-3 heading'}>Configuracion</h1>
                    <div className={'form-container'}>
                        <form onSubmit={(e) => handleSubmitt(e)} className={'row task-settings-form'}>
                            <div className={'col-md-6'}>
                                <div className={'mb-3'}>
                                    <h6>
                                        <label htmlFor="exampleInputEmail1" className="settings-form-text">
                                            Nombre de Usuario
                                        </label>
                                    </h6>
                                    <input
                                        name={'username'}
                                        className={`form-control ${errors.username ? 'border-red' : ''}`}
                                        id="exampleInputEmail1"
                                        onChange={handleChange}
                                        value={values.username || ''}
                                    />
                                    {errors.username && <p className={'text-red'}>{errors.username}</p>}
                                </div>
                            </div>
                            <div className={'col-md-6'}>
                                <div className={'mb-3'}>
                                    <h6>
                                        <label htmlFor="exampleInputEmail1" className="settings-form-text">
                                            Correo
                                        </label>
                                    </h6>
                                    <input
                                        name={'email'}
                                        placeholder={'Enter Email'}
                                        className={`form-control ${errors.email ? 'border-red' : ''}`}
                                        id="exampleInputEmail1"
                                        onChange={handleChange}
                                        value={values.email || ''}
                                    />
                                    {errors.email && <p className={'text-red'}>{errors.email}</p>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="submit" className={'btn btn-secondary tasks-dropdown-btn'}>
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                    <PasswordSetting />
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
