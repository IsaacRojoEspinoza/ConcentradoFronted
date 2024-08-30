import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import axios from 'axios';
import { values, pick, filter } from 'underscore';
import { useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const Avance = () => {
  const [avanceAllList, setAvanceAllList] = useState([]);
  const [avanceList, setAvanceList] = useState([]);
  const [avanceTotales, setAvanceTotales] = useState({});
  const [nivel, setNivel] = useState({});
  const location = useLocation();
  const { entidad } = location.state || '';

  useEffect(() => {
    fetchData();
  }, [entidad]);

  async function fetchData() {
    try {
      const urlAvance = 'http://127.0.0.1:8000/avance';
      const urlAvanceTotales = 'http://127.0.0.1:8000/avanceTotales/';
      const urlNivel = 'http://127.0.0.1:8000/nivel/';
      const headers = { Authorization: `Token ${localStorage.getItem('token')}` };
      const params = entidad ? `?entidad=${entidad}` : '';

      let [avanceResponse, avanceTotalesResponse, nivelResponse] = [{}, {}, {}];

      if (params === '') {
        [avanceResponse, avanceTotalesResponse, nivelResponse] = await Promise.all([
          axios.get(urlAvance, { headers }),
          axios.get(urlAvanceTotales, { headers }),  // Nota: Sin parámetros de consulta
          axios.get(urlNivel + `?entidad=0`, { headers }),
        ]);
      } else {
        [avanceResponse, avanceTotalesResponse, nivelResponse] = await Promise.all([
          axios.get(urlAvance + params, { headers }),
          axios.get(urlAvanceTotales + params, { headers }),
          axios.get(urlNivel + params, { headers }),
        ]);
      }

      setAvanceList(avanceResponse.data);
      setAvanceAllList(avanceResponse.data);
      setAvanceTotales(avanceTotalesResponse.data || {});
      setNivel(nivelResponse.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleSearch(e) {
    const val = e.target.value.toLowerCase();
    let res = [];

    if (val !== '') {
      if (entidad && entidad.trim() !== '') {
        // Buscar por nombreEntidad si entidad tiene valor
        res = filter(avanceList, (item) =>
          (String(item.nombreEntidad) || '').toLowerCase().includes(val)
        );
      } else {
        // Buscar por distrito si entidad está vacío
        res = filter(avanceList, (item) =>
          (String(item.distrito) || '').toLowerCase().includes(val)
        );
      }
      setAvanceList(res);
    } else {
      setAvanceList(avanceList);
    }
  }

  const formatPercentage = (value) => {
    if (isNaN(value) || value === Infinity || value === -Infinity) {
      return '0%';
    }
    return `${(value * 100).toFixed(2)}%`;
  };

  const progress1 = nivel.nivelEsperado || 0;
  const progress2 = nivel.nivelObtenido || 0;

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
              text={`${formatPercentage(progress1 / 100)}`}
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
              text={`${formatPercentage(progress2 / 100)}`}
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
              <th scope="col">Designados</th>
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
                <td>{data.numeroInscritos}</td>
                <td>{formatPercentage(data.numeroInscritos / data.numeroDesignados)}</td>
                <td>{data.conIngreso}</td>
                <td>{formatPercentage(data.conIngreso / data.numeroInscritos)}</td>
                <td>{data.sinIngreso}</td>
                <td>{formatPercentage(data.sinIngreso / data.numeroInscritos)}</td>
                <td>{data.concluyeron}</td>
                <td>{formatPercentage(data.concluyeron / data.numeroDesignados)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}><strong>Total</strong></td>
              <td>{avanceTotales.totalDesignados || 0}</td>
              <td>{avanceTotales.totalInscritos || 0}</td>
              <td>{formatPercentage(avanceTotales.totalIncritosDesignados)}</td>
              <td>{avanceTotales.totalConIngreso || 0}</td>
              <td>{formatPercentage(avanceTotales.totalConIngresoInscritos)}</td>
              <td>{avanceTotales.totalSinIngreso || 0}</td>
              <td>{formatPercentage(avanceTotales.totalSinIngresoInscritos)}</td>
              <td>{avanceTotales.totalConcluyeron || 0}</td>
              <td>{formatPercentage(avanceTotales.totalConcluyeronDesignados / avanceTotales.totalIncritosDesignados )}</td>
            </tr>
          </tfoot>
        </table>
        {avanceList.length === 0 && <div className="text-center py-5 fw-bold customFont">No hay Registros</div>}
      </div>
    </Layout>
  );
};
