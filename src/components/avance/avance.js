import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import axios from 'axios';
import { values, pick, filter } from 'underscore';
import { useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export const Avance = () => {
  const [AvanceAllList, setAvanceAllList] = useState([]);
  const [avanceList, setAvanceList] = useState([]);
  const location = useLocation();
  const { entidad } = location.state || {};

  useEffect(() => {
    fetchData();
  }, [entidad]);

  async function fetchData() {
    try {
      let url = 'http://127.0.0.1:8000/avance';
      if (entidad) {
        url += `/?entidad=${entidad}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      setAvanceList(response.data);
      setAvanceAllList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleSearch(e) {
    let val = e.target.value;
    if (val !== '') {
      let res = filter(AvanceAllList, function (item) {
        return values(pick(item, 'entidad', 'nombreEntidad', 'distrito', 'numeroDesignados', 'numeroInscritos', 'inscritosDesignados', 'ingreso', 'ingresoInscritos', 'sinIngreso', 'sinIngresoInscritos', 'concluyeron', 'concluyeronDesignados')).toString().toLowerCase().includes(val.toLowerCase());
      });
      setAvanceList(res);
    } else {
      setAvanceList(AvanceAllList);
    }
  }

  function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
  }

  // Placeholder values for the progress bars
  const progress1 = 13; // Puedes ajustar esto según tus datos reales
  const progress2 = 13.14; // Puedes ajustar esto según tus datos reales

  return (
    <Layout>
      <div className="container mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="p-3 heading">Avance</h1>
          <div className="tasks-search">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                onChange={handleSearch}
                type="search"
                placeholder="Buscar"
                aria-label="Search"
              />
            </form>
          </div>
        </div>

        {/* Container for Progress Bars */}
        <div className="top-container d-flex justify-content-around align-items-center mb-4">
  <div className="progress-bar-container">
    <CircularProgressbar
      value={progress1}
      text={`${progress1}%`}
      styles={buildStyles({
        pathColor: '#4db8ff',
        textColor: '#4db8ff',
        trailColor: '#d6d6d6',
      })}
    />
    <p className="progress-text">Nivel esperado</p>
  </div>
  <div className="progress-bar-container">
    <CircularProgressbar
      value={progress2}
      text={`${progress2}%`}
      styles={buildStyles({
        pathColor: '#ff6f61',
        textColor: '#ff6f61',
        trailColor: '#d6d6d6',
      })}
    />
    <p className="progress-text">Nivel Obtenido</p>
  </div>
</div>
      </div>

      {/* Existing Table Container */}
      <div className="table-container">
        <table className="table table-hover table-striped">
          <thead className="top-0 position-sticky h-45">
            <tr>
              <th scope="col">Num Entidad</th>
              <th scope="col">Nombre Entidad</th>
              <th scope="col">Distrito</th>
              <th scope="col">Incritos</th>
              <th scope="col">% inscritos/designados</th>
              <th scope="col">Con ingreso</th>
              <th scope="col">% con ingreso/ inscritos</th>
              <th scope="col">Sin ingreso</th>
              <th scope="col">% sin ingreso/ inscritos</th>
              <th scope="col">Concluyeron 100%</th>
              <th scope="col">% concluyeron/ designados</th>
            </tr>
          </thead>
          <tbody>
            {avanceList.map((data, index) => (
              <tr key={index}>
                <td>{data.entidad}</td>
                <td>{data.nombreEntidad}</td>
                <td>{data.distrito}</td>
                <td>{data.numeroDesignados}</td>
                <td>{formatPercentage(data.numeroInscritos / data.numeroDesignados)}</td>
                <td>{data.inscritosDesignados}</td>
                <td>{formatPercentage(data.ingresoInscritos / data.numeroInscritos)}</td>
                <td>{data.sinIngreso}</td>
                <td>{formatPercentage(data.sinIngresoInscritos / data.numeroInscritos)}</td>
                <td>{data.concluyeron}</td>
                <td>{formatPercentage(data.concluyeronDesignados / data.numeroDesignados)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {avanceList.length === 0 && <div className="text-center py-5 fw-bold customFont">No hay Registros</div>}
      </div>
    </Layout>
  );
};
