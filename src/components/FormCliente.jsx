import '../css/formcliente.css'
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";

const FormCliente = () => {

    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña,setContraseña]=useState("");
    const [telefono, setTelefono] = useState("");
    const [ciudad, setCiudad] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const telefonoRegex = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;

if (!emailRegex.test(email) || !telefonoRegex.test(telefono)){
            setError("Debe ingresar un formato de email o telefonos valido")
            return;
        }
        if(contraseña.length<8 || !/[A-Z]/.test(contraseña) || !/[0-9]/.test(contraseña)){
            setError(
        "Parámetros de contraseña incorrectos. La contraseña debe tener: " +
        "mínimo 8 caracteres, una mayúscula y un número."
            );
                return;
        }
    
        const nuevoCliente = {

            email,

            username: nombre.toLowerCase().replace(/\s/g, ""),

            password: contraseña,

            name: {
                firstname: nombre,
                lastname: "-"
            },

            address: {
                city: ciudad
            },

            phone: telefono
        };

        try {

            setLoading(true);

            const respuesta = await clientesService.crearCliente( nuevoCliente);

            setMensaje(
                `Cliente creado correctamente. ID: ${respuesta.id}`
            );

            setNombre("");
            setEmail("");
            setContraseña("");
            setTelefono("");
            setCiudad("");

        } catch {

            setError(
                "Ocurrió un error al crear el cliente."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className='formulario-cliente'>

            <h3>Nuevo Cliente</h3>

            <Form onSubmit={manejarSubmit}>

                <Form.Group className="mb-3">

                    <Form.Label>Nombre</Form.Label>

                    <Form.Control
                        type="text"
                        value={nombre}
                        onChange={(e) =>setNombre(e.target.value)}
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label>Contraseña</Form.Label>

                    <Form.Control
                        type="password"
                        value={contraseña}
                        onChange={(e) =>setContraseña(e.target.value)}
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
                            : "Guardar Cliente"
                    }

                </Button>

            </Form>

            {
                mensaje &&
                <Alert
                    className="mt-3"
                    variant="success">
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