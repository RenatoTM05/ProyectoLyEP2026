import '../css/detallecliente.css'
import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
 
const DetalleCliente = () => {
 const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clienteInexistente, setClienteInexistente] = useState(false);

  const cargarCliente = useCallback(async () => {
    setLoading(true);
    setError("");
    setClienteInexistente(false);
    setCliente(null);

    try {
      const res = await fetch(`https://fakestoreapi.com/users/${id}`);

      if (res.status === 404) {
        setClienteInexistente(true);
        return;
      }

      if (!res.ok) {
        throw new Error("No se pudo obtener la ficha del cliente.");
      }

      const data = await res.json();
      if (!data?.id || !data?.name || !data?.address) {
        setClienteInexistente(true);
        return;
      }

      setCliente(data);
    } catch (error) {
      setError(error.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const inicioCarga = window.setTimeout(cargarCliente, 0);
    return () => window.clearTimeout(inicioCarga);
  }, [cargarCliente]);

  const eliminarCliente = async () => {
    try {
      const respuesta = await fetch(
        `https://fakestoreapi.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (respuesta.ok) {
        setMensaje("Cliente eliminado correctamente");

        setTimeout(() => {
          navigate("/clientes");
        }, 2000);
      }
    } catch (error) {
      setMensaje("Error al eliminar cliente");
    }
  };
  if (loading) {
    return (
      <section className="estado-detalle" role="status" aria-live="polite">
        <h2>Cargando cliente...</h2>
        <p>Estamos obteniendo la ficha solicitada.</p>
      </section>
    );
  }

  if (clienteInexistente) {
    return (
      <section className="estado-detalle" role="alert">
        <h2>Cliente inexistente</h2>
        <p>No existe un cliente con el identificador solicitado.</p>
        <Link className="btn-volver-clientes" to="/clientes">Volver a clientes</Link>
      </section>
    );
  }

  if (error) {
    return (
      <section className="estado-detalle estado-detalle-error" role="alert">
        <h2>No se pudo cargar la ficha</h2>
        <p>{error}</p>
        <button type="button" onClick={cargarCliente}>Reintentar</button>
        <Link className="btn-volver-clientes" to="/clientes">Volver a clientes</Link>
      </section>
    );
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className = 'mensaje-eliminado'>{mensaje}</p>}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      <h2>Credenciales</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      <p>
        <strong>Contraseña:</strong> {cliente.password}
      </p>

      {role?.trim() === "Gerencia" && (
        <button className='btn-eliminar'onClick={eliminarCliente}>
          Eliminar Cliente
        </button>
      )}
    </div>
  );
};

export default DetalleCliente;
