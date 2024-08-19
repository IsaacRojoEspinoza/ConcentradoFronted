import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
// import {createBrowserRouter, Route, Routes} from "react-router-dom"
import Layout from './layout/layout';
import { Route, Routes } from 'react-router-dom';
import { Home } from "./components/home/home";
import { Tasks } from './components/tasks/tasks';
import { Calender } from './components/calender/calender';
import { Analysis } from './components/analysis/analysis';
import Settings from './components/settings/settings';
import { Login } from './components/login/login';
import { SignUp } from './components/login/signup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-calendar-datetime-picker/dist/index.css'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from "./components/utils-components/confirmation-dialog";
import Loader from "./components/utils-components/loader";

function App() {
  return (
    <div>
      <Loader />
      <ConfirmationDialog />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calender />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
