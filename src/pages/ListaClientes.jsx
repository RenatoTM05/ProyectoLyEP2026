import "../css/listaclientes.css";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FormCliente from "../components/FormCliente";

const ListaClientes = () => {
  const location = useLocation();

  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [criterioOrden, setCriterioOrden] = useState("nombre");
  const [direccionOrden, setDireccionOrden] = useState("ascendente");
  const [paginaActual, setPaginaActual] = useState(1);
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
        const clienteEliminado = location.state?.clienteEliminado;

        const clientesActualizados = clienteEliminado
          ? data.filter(
              (cliente) =>
                String(cliente.id) !== String(clienteEliminado)
            )
          : data;

        setClientes(clientesActualizados);
        setPaginaActual(1);

        if (clienteEliminado) {
          window.history.replaceState({}, document.title);
        }
      })
      .catch((error) => {
        setError(error.message || "Ocurrió un error inesperado.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location]);

  useEffect(() => {
    const inicioCarga = window.setTimeout(cargarClientes, 0);

    return () => window.clearTimeout(inicioCarga);
  }, [cargarClientes]);

  const consulta = busqueda.toLowerCase();

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.name.firstname.toLowerCase().includes(consulta) ||
      cliente.name.lastname.toLowerCase().includes(consulta) ||
      cliente.address.city.toLowerCase().includes(consulta) ||
      cliente.email.toLowerCase().includes(consulta)
  );

  const clientesOrdenados = [...clientesFiltrados].sort((clienteA, clienteB) => {
    const valores = {
      nombre: `${clienteA.name.firstname} ${clienteA.name.lastname}`
        .toLowerCase()
        .localeCompare(
          `${clienteB.name.firstname} ${clienteB.name.lastname}`.toLowerCase()
        ),
      email: clienteA.email
        .toLowerCase()
        .localeCompare(clienteB.email.toLowerCase()),
      ciudad: clienteA.address.city
        .toLowerCase()
        .localeCompare(clienteB.address.city.toLowerCase()),
    };

    return direccionOrden === "ascendente"
      ? valores[criterioOrden]
      : -valores[criterioOrden];
  });

  const clientesPorPagina = 5;
  const totalPaginas = Math.ceil(
    clientesOrdenados.length / clientesPorPagina
  );

  const paginaValida =
    totalPaginas === 0
      ? 1
      : Math.min(paginaActual, totalPaginas);

  const indiceInicial = (paginaValida - 1) * clientesPorPagina;

  const clientesPaginados = clientesOrdenados.slice(
    indiceInicial,
    indiceInicial + clientesPorPagina
  );

  useEffect(() => {
    if (paginaActual !== paginaValida) {
      setPaginaActual(paginaValida);
    }
  }, [paginaActual, paginaValida]);

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
        <h2 className="titulo-buscador">Buscar Clientes</h2>

        <input
          className="buscador"
          type="text"
          placeholder="Buscar por nombre completo, email o ciudad"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
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
        <section className="mensaje-lista-vacia" role="status">
          <p>No se encontraron clientes con esa búsqueda.</p>
          <button type="button" onClick={() => setBusqueda("")}>
            Limpiar búsqueda
          </button>
        </section>
      ) : (
        <>
          <div className="ordenamiento-clientes">
            <span className="ordenamiento-titulo">Ordenar clientes</span>

            <label>
              Criterio
              <select
                className="ordenamiento-select"
                value={criterioOrden}
                onChange={(e) => {
                  setCriterioOrden(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="nombre">Nombre</option>
                <option value="email">Email</option>
                <option value="ciudad">Ciudad</option>
              </select>
            </label>

            <label>
              Dirección
              <select
                className="ordenamiento-select"
                value={direccionOrden}
                onChange={(e) => {
                  setDireccionOrden(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="ascendente">Ascendente</option>
                <option value="descendente">Descendente</option>
              </select>
            </label>
          </div>

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
              {clientesPaginados.map((cliente) => (
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
        </>
      )}
      
      {totalPaginas > 1 && (
        <div className="paginacion-clientes">
          <button
            type="button"
            className="boton-paginacion"
            disabled={paginaValida === 1}
            onClick={() => setPaginaActual((pagina) => pagina - 1)}
          >
            Anterior
          </button>

          <span>
            Página {paginaValida} de {totalPaginas}
          </span>

          <button
            type="button"
            className="boton-paginacion"
            disabled={paginaValida === totalPaginas}
            onClick={() => setPaginaActual((pagina) => pagina + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaClientes;
