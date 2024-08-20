import Layout from '../../layout/layout'
import React, { useState } from 'react'
import homeimage from '../../assets/home-image.png'
import Chart from "react-apexcharts"
import FeatherIcon from 'feather-icons-react'
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { cardData } from './datos';

export const Home = () => {
  // const location = useLocation();
  // const token = location?.state?.token;
  const token = Cookies.get('tokenCookie');
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/home');
        console.log(response.data);
        setTaskData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <Layout>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {cardData.map((card, index) => (
          <div className="col d-flex justify-content-center" key={index}>
            <div className="card">
              <div className="card-img-wrapper">
                <img src={card.imgSrc} className="card-img-top" alt={`Card ${index + 1}`} />
              </div>
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};