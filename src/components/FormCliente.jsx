import '../css/formcliente.css'
import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";

const FormCliente = ({ cliente }) => {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (cliente) {
            setNombre(cliente.name.firstname);
            setEmail(cliente.email);
            setTelefono(cliente.phone);
            setCiudad(cliente.address.city);
        }
    }, [cliente]);

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (
            nombre.trim() === "" ||
            email.trim() === "" ||
            telefono.trim() === "" ||
            ciudad.trim() === ""
        ) {

            setError("Complete todos los campos.");

            return;
        }

        const nuevoCliente = {

            email,

            username: nombre.toLowerCase().replace(/\s/g, ""),

            password: "1234",

            name: {
                firstname: nombre,
                lastname: "-"
            },

            address: {
                city: ciudad
            },

            phone: telefono
        };

       try{
                setLoading(true);
                let respuesta;
                if (cliente) {
                    respuesta = await clientesService.actualizarCliente(cliente.id, nuevoCliente);
                    setMensaje(`Cliente actualizado correctamente. ID: ${cliente.id}`);

                        setNombre("");
                        setEmail("");
                        setTelefono("");
                        setCiudad("");

                        setTimeout(() => {
                            window.location.href = "/clientes";
                        }, 1500);

                } else {

                    respuesta = await clientesService.crearCliente(nuevoCliente);
                    setMensaje(`Cliente creado correctamente. ID: ${respuesta.id}`);
                    setNombre("");
                    setEmail("");
                    setTelefono("");
                    setCiudad("");
                }

        } catch {
            setError( cliente  ? "Ocurrió un error al actualizar el cliente."    : "Ocurrió un error al crear el cliente.");

        } finally {
            setLoading(false);
        }

    };

    return (

        <div className='formulario-cliente'>

            <h3>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>

            <Form onSubmit={manejarSubmit}>

                <Form.Group className="mb-3">

                    <Form.Label>Nombre</Form.Label>

                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Email</Form.Label>

                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Teléfono</Form.Label>

                    <Form.Control
                        type="text"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Ciudad</Form.Label>

                    <Form.Control
                        type="text"
                        value={ciudad}
                        onChange={(e) =>
                            setCiudad(e.target.value)
                        }
                    />

                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? <Spinner size="sm" />
                            : cliente ?
                            "Editar Cliente"
                            : "Crear Cliente"
                    }

                </Button>

            </Form>

            {
                mensaje &&
                <Alert
                    className="mt-3"
                    variant="success"
                >
                    {mensaje}
                </Alert>
            }

            {
                error &&
                <Alert
                    className="mt-3"
                    variant="danger"
                >
                    {error}
                </Alert>
            }

        </div>

    );
};

export default FormCliente;