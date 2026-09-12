import '../css/nav.css'
import { NavLink } from 'react-router-dom'
const Nav = () => {
    return (
        <nav className="nav">
            <ul className="nav-lista">
                <li>
                    <NavLink to="/">
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/clientes">
                        Clientes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Formulario">
                        Crear Cliente
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
    
};
export default Nav;