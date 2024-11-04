import React, { useEffect, useState } from 'react';
import Profile from "../assets/layoutDefaultProfile.jpg";
import FeatherIcon from 'feather-icons-react';
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png"
// import Logo from "../assets/eduzon.svg"
import SideClose from "../assets/carbon_side-panel-close.svg";
import { useDispatch } from 'react-redux'
import { toast } from "react-toastify";
import { toggleLoader } from "../redux/actions";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import formHandler from "../utils/FormHandler";

function Layout({ children }) {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const token = Cookies.get('tokenCookie');

    function settingPath() {

    }

    function toggleDrawer() {
        setOpen(!open);
    }

    useEffect(() => {
        if (!token) {
            // Handle the absence of the token (e.g., redirect to login)
            console.warn("No authentication token found. Some features may be limited.");
        }
    }, [token, navigate]);

    const handleLogout = async () => {
        try {
            const authTokenValue = token;
            console.log('Received token:', authTokenValue);
            // Make a POST request to your logout endpoint
            const response = await axios.post(
                "http://127.0.0.1:8000/api/logout/",
                null,
                {
                    headers: {
                        Authorization: `Token ${authTokenValue}`,
                    },
                }
            );
            console.log('Logout response:', response);
            console.log('Response status:', response.status);
            // Handle the response accordingly
            if (response.status === 204) {
                console.log('Logout successful');
                Cookies.remove('tokenCookie');
                // Redirect to the login page or perform any other action after successful logout
                navigate("/");
                console.log('Logout successful');
                toast.success(`Logout Successfully`)
            } else {
                // Handle errors, such as failed logout attempts
                console.error('Logout failed. Status:', response.status, 'Text:', response.statusText);
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('An error occurred during logout', error);
        }
    };

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
                console.error('Error updating user profile', err);
            })
            .finally(() => {
                dispatch(toggleLoader(false));
            });
    }

    const {
        handleChange,
        handleSubmit,
        setValue,
        initForm,
        values,
        errors,
    } = formHandler();

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap overflow-auto">
                <div className={(!open ? " col-xl-2" : " w-100px") + (!show ? " mobile-navbar-hide " : " mobile-show ") + " col-auto col-md-1 px-0 bg-default border-right min-vh-100 trans"}>
                    <div className={"logo"}>
                        {!open && <div className={"edulogo"}>
                            <img className={"logosvg ms-4"} src={Logo} alt="" />
                        </div>}
                        <div className={"close-btn-container mobile-hide"} onClick={toggleDrawer}>
                            <img src={SideClose} alt="SideClose" className={!!open ? "rotate-180" : ""} />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-2 pt-2 text-white pt-4">

                        {/* <div className={"w-100 px-sm-2 home-mobile"}>
                            <NavLink className={({ isActive }) => isActive ? "side-menu-item side-menu-active " : "side-menu-item "} to={"/home"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="home" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={'trans-1'}>Listado Entidades</div>}
                                </div>
                            </NavLink>
                        </div> */}

                        <div className={"w-100 px-sm-2 home-mobile"}>
                            <NavLink className={({ isActive }) => isActive ? "side-menu-item side-menu-active " : "side-menu-item "} to={"/periodos"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="list" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={'trans-1'}>Listado Periodos</div>}
                                </div>
                            </NavLink>
                        </div>
                        <div className={"w-100 px-sm-2"}>
                            <NavLink className={({ isActive }) => isActive ? "side-menu-item side-menu-active " : "side-menu-item "} to={"/avance"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="user-check" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={''}>Avance Total</div>}
                                </div>
                            </NavLink>
                        </div>
                        {/* <div className={"w-100 px-sm-2"}>
                            <NavLink className={({ isActive }) => isActive ? "side-menu-item side-menu-active " : "side-menu-item "} to={"/analysis"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="bar-chart-2" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={''}>Analysis</div>}
                                </div>
                            </NavLink>
                        </div> */}

                        <div className={'w-100 border-bottom-d1d1d1 mb-3'} />

                        <div className={"w-100 px-sm-2"}>
                            <NavLink
                                className={({ isActive }) => isActive ? "side-menu-item side-menu-active" : "side-menu-item"} to={"/settings"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="settings" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={''}>Configuracion</div>}
                                </div>
                            </NavLink>
                        </div>
                        <div className={"w-100 px-sm-2"}>
                            <NavLink
                                onClick={handleLogout}
                                className={({ isActive }) => isActive ? "side-menu-item side-menu-active" : "side-menu-item"} to={"/login"}>
                                <div className={'d-flex'}>
                                    <FeatherIcon icon="log-out" className={!open ? 'me-2' : "ms-1"} />
                                    {!open && <div className={''}>Salir</div>}
                                </div>
                            </NavLink>
                        </div>

                    </div>
                </div>
                <div className="col p-0">
                    <nav className="navbar navbar-expand-lg bg-white border-bottom-d1d1d1 px-4">
                        <div className="container-fluid">
                            {/*<a className="navbar-brand" href="#">Navbar</a>*/}
                            <div className="" id="">
                                <ul className="navbar-nav ms-auto align-items-center d-lg-none">
                                    <li className="nav-item px-2">
                                        <a className="nav-link  position-relative p-0" aria-current="page" href="#">

                                            <img src={Profile} className="rounded-circle user-profile mr-2" />
                                        </a>
                                    </li>
                                   </ul>
                            </div>
                            <button
                                className="navbar-toggler ms-auto toggle-expand-button"
                                type="button"
                                onClick={toggleDrawer}
                            >
                                <FeatherIcon icon="menu" className="justify-content-center" />
                            </button>

                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto align-items-center">
                                    <li className="nav-item px-2">
                                        <a className="nav-link  position-relative p-0" aria-current="page" href="#">

                                            <img src={Profile} className="rounded-circle user-profile mr-2" />
                                        </a>
                                    </li>
                                    <li className="nav-item px-2 pt-3">
                                        <div className="d-flex justify-content-center">
                                            <p className="custom-username-style">{values.username}</p>
                                            <span className="mx-2">||</span>
                                            <p className="custom-username-style">{values.email}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div>
                        <div className={show ? "nav-shadow opacity-100" : "invisible opacity-0"} onClick={() => setShow(!show)} />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;