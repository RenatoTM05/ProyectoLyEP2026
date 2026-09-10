import "../css/listaclientes.css"
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormCliente from "../components/FormCliente";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarClientes = useCallback(() => {
    setLoading(true);
    setError("");

    fetch("https://fakestoreapi.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo obtener la lista de clientes.");
        }
        return res.json();
      })
      .then((data) => {
        setClientes(data);
      })
      .catch((error) => {
        setError(error.message || "Ocurrió un error inesperado.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const inicioCarga = window.setTimeout(cargarClientes, 0);
    return () => window.clearTimeout(inicioCarga);
  }, [cargarClientes]);

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.name.lastname
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      cliente.address.city
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <section className="mensaje-carga" role="status" aria-live="polite">
        <div className="spinner-carga" aria-hidden="true"></div>
        <h2>Cargando clientes...</h2>
        <p>Estamos obteniendo la información. Esperá un momento.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mensaje-error" role="alert">
        <h2>No se pudieron cargar los clientes</h2>
        <p>{error}</p>
        <button type="button" onClick={cargarClientes}>
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <div className="clientes-container">

      <h1>Clientes</h1>
      <FormCliente />

      <hr />

      <div className="contenedor-buscador">

        <h2 className="titulo-buscador">
          Buscar Clientes
        </h2>

        <input
          className="buscador"
          type="text"
          placeholder="Buscar por apellido o ciudad"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <p className="cantidad-clientes">
          Clientes encontrados: {clientesFiltrados.length}
        </p>

      </div>
      {clientes.length === 0 ? (

        <p className="mensaje-lista-vacia">
          No hay clientes registrados todavía.
        </p>

      ) : clientesFiltrados.length === 0 ? (
        
        <p className="mensaje-lista-vacia">
          No se encontraron clientes con esa búsqueda.
        </p>

      ) : (

      <table className="tabla-clientes">

        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>

              <td>{cliente.id}</td>

              <td>
                {cliente.name.firstname} {cliente.name.lastname}
              </td>

              <td>{cliente.email}</td>

              <td>{cliente.phone}</td>

              <td>{cliente.address.city}</td>

              <td>
                <Link
                  className="btn-ficha"
                  to={`/clientes/${cliente.id}`}
                >
                  Ver Ficha Completa
                </Link>
              </td>

            </tr>
          ))}

        </tbody>

      </table>
      )}

    </div>
  );
};

export default ListaClientes;
