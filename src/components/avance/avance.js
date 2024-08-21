import React, { useState, useEffect } from 'react';
import Layout from '../../layout/layout';
import axios from 'axios';
import { values, pick, filter } from "underscore";
import { useLocation } from 'react-router-dom';

export const Avance = () => {
  const [AvanceAllList, setAvanceAllList] = useState([]);
  const [avanceList, setAvanceList] = useState([]);
  const [update] = useState(false);
  const location = useLocation();
  const { entidad } = location.state || {};

  console.log("soy la entidad numero:",entidad);

  function handleSearch(e) {
    let val = e.target.value;
    if (val !== "") {
      let res = filter(AvanceAllList, function (item) {
        return values(pick(item, 'entidad', 'nombreEntidad', 'distrito', 'numeroDesignados', 'numeroInscritos', 'inscritosDesignados', 'ingreso', 'ingresoInscritos', 'sinIngreso', 'sinIngresoInscritos', 'concluyeron', 'concluyeronDesignados')).toString().toLocaleLowerCase().includes(val.toLocaleLowerCase());
      });
      setAvanceList(res);
    } else {
      setAvanceList(AvanceAllList);
    }
  }

  useEffect(() => {
    (async () => await fetchData())();
  }, [update]);

  async function fetchData() {
    const data = await axios.get("http://127.0.0.1:8000/avance", {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    });
    setAvanceList(data.data);
    setAvanceAllList(data.data);
  }

  // Función para formatear a porcentaje
  function formatPercentage(value) {
    return (value * 100).toFixed(2) + '%';
  }

  return (
    <Layout>
      <div className={"container-widget"}>
        <div className={"tasks_container"}>
          <h1 className="p-3 heading">Avance total 2024</h1>
          <div className={"table-btn-container d-flex justify-content-end pb-2"}>
            <div className={"tasks-search"}>
              <div className="container-fluid">
                <form className="d-flex" role="search">
                  <input className="form-control me-2" onChange={handleSearch} type="search" placeholder="Buscar"
                    aria-label="Search" />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={"table-container"}>
          <table className={"table table-hover table-striped"}>
            <thead className={"top-0 position-sticky h-45"}>
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
          {avanceList.length === 0 && <div className={"text-center py-5 fw-bold customFont"}>No hay Registros</div>}
        </div>
      </div>
    </Layout>
  );
}
