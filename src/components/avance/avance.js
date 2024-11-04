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
  const [avanceTotales, setAvanceTotales] = useState([]);
  const [nivel, setNivel] = useState({});
  const [periodo, setPeriodo] = useState([]);
  const location = useLocation();
  const { entidad } = location.state || {};

  useEffect(() => {
    fetchData();
  }, [entidad]);

  async function fetchData() {
    try {
      const urlAvance = 'http://127.0.0.1:8000/avance';
      const urlAvanceTotales = 'http://127.0.0.1:8000/avanceTotales/';
      const urlNivel = 'http://127.0.0.1:8000/nivel/';
      const urlPeriodo = 'http://127.0.0.1:8000/periodos/';

      const params = entidad ? `?entidad=${entidad}` : '';

      const [avanceResponse, avanceTotalesResponse, nivelResponse, periodoResponse] = await Promise.all([
        axios.get(urlAvance + params, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }),
        axios.get(urlAvanceTotales + params, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }),
        axios.get(urlNivel + params, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }),
        axios.get(urlPeriodo , { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }),
      ]);

      setAvanceList(avanceResponse.data);
      setAvanceAllList(avanceResponse.data);
      setAvanceTotales(avanceTotalesResponse.data);
      setNivel(nivelResponse.data);
      setPeriodo(periodoResponse.data); // Se corrigió de `setNivel` a `setPeriodo`
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleSearch(e) {
    const val = e.target.value;
    if (val !== '') {
      const res = filter(avanceAllList, (item) => {
        return values(pick(item, 'numero_entidad', 'nombre', 'distrito', 'numero_designados', 'numero_inscritos', 'inscritos_designados', 'con_ingreso', 'con_ingreso_inscritos', 'sin_ingreso', 'sin_ingreso_inscritos', 'concluyeron', 'concluyeron_designados')).toString().toLowerCase().includes(val.toLowerCase());
      });
      setAvanceList(res);
    } else {
      setAvanceList(avanceAllList);
    }
  }

  const formatPercentage = (value) => {
    if (isNaN(value) || value === Infinity || value === -Infinity || value === 0) {
      return '0%'; // Ajusta el valor predeterminado según tu preferencia
    }
    return `${(value * 100).toFixed(2)}%`; // Ajusta la cantidad de decimales según tu preferencia
  };

  // Placeholder values for the progress bars
  const progress1 = nivel.nivel_esperado || 0; // Evitar NaN si no hay valor
  const progress2 = nivel.nivel_obtenido || 0; // Evitar NaN si no hay valor

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
                <td>{data.numero_entidad}</td>
                <td>{data.nombre}</td>
                <td>{data.distrito}</td>
                <td>{data.numero_designados}</td>
                <td>{data.numero_inscritos}</td>
                <td>{formatPercentage(data.numero_inscritos / data.numero_designados)}</td>
                <td>{data.con_ingreso}</td>
                <td>{formatPercentage(data.con_ingreso / data.numero_inscritos)}</td>
                <td>{data.sin_ingreso}</td>
                <td>{formatPercentage(data.sin_ingreso / data.numero_inscritos)}</td>
                <td>{data.concluyeron}</td>
                <td>{formatPercentage(data.concluyeron / data.concluyeron_designados)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {avanceList.length === 0 && <div className="text-center py-5 fw-bold customFont">No hay Registros</div>}
      </div>
    </Layout>
  );
};
