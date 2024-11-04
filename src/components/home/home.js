import Layout from '../../layout/layout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export const Home = () => {
  const location = useLocation(); // Obtener el objeto de ubicación
  const periodoId = location.state?.periodoId; // Obtener el ID del estado
  const [entidades, setEntidades] = useState([]);
  const token = Cookies.get('tokenCookie');

  useEffect(() => {
    if (periodoId) {
      console.log("ID recibido:", periodoId); // Verificar el ID recibido
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/periodos/?periodo=${periodoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Datos recibidos:", response.data); // Verificar los datos recibidos

          // Acceder a las entidades desde el primer elemento del array
          const entidadesData = response.data[0]?.entidades || [];
          setEntidades(entidadesData); // Establecer entidades en el estado
        } catch (error) {
          console.error("Error fetching data:", error);
          console.error("Response data:", error.response?.data); // Mostrar el error de respuesta si existe
        }
      };

      fetchData();
    }
  }, [periodoId, token]);

  return (
    <Layout>
      <div className="container">
        <div className="container-widget">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {entidades.map((entidad, index) => (
              <div className="col d-flex justify-content-center" key={entidad.id}>
            <Link
                  to="/avance"
                  state={{ entidad: entidad.id }} // Pasa el parámetro 'entidad' a través del estado
                  className="text-decoration-none"
                >
                  <div className="card">
                    <div className="card-img-wrapper">
                      <img src={entidad.logo} className="card-img-top" alt={`Card ${index + 1}`} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{entidad.nombre}</h5>
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
