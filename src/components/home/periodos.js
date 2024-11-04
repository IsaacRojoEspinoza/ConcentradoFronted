import Layout from '../../layout/layout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const token = Cookies.get('tokenCookie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/periodos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const periodosData = response.data.map(periodo => ({
          id: periodo.periodo_id,
          anioRango: `${periodo.anio_inicio}-${periodo.anio_fin}`,
        }));
        setPeriodos(periodosData);
      } catch (error) {
        console.error("Error fetching periodos:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Layout>
      <div className="container">
        <div className="container-widget">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {periodos.map((periodo) => (
              <div className="col d-flex justify-content-center" key={periodo.id}>
                <Link to="/home" state={{ periodoId: periodo.id }} className="text-decoration-none">
                  <div className="card p-3" style={{ width: '18rem', height: '12rem' }}>
                    <div className="card-body d-flex align-items-center justify-content-center">
                      <h3 className="card-text text-center" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {periodo.anioRango}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
