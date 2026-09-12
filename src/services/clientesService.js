import axios from "axios";

const URL = "https://fakestoreapi.com/users";

const crearCliente = async (cliente) => {

    const respuesta = await axios.post(URL,cliente);

    return respuesta.data;
};

const actualizarCliente = async (id, cliente) => {

    const respuesta = await axios.put(
        `${URL}/${id}`,
        cliente
    );

    return respuesta.data;
};



export default {
    crearCliente,
    actualizarCliente
};