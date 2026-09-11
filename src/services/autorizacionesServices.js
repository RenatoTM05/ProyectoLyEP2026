const usuarios = [
  {
    email: 'antonella@gmail.com',
    password: 'Admin123',
    nombre: 'Antonella',
    sector: 'Soporte'
  },
  {
    email: 'jimena@gmail.com',
    password: 'Admin123',
    nombre: 'Jimena',
    sector: 'Gerencia'
  },
  {
    email: 'maia@gmail.com',
    password: 'Admin123',
    nombre: 'Maia',
    sector: 'Gerencia'
  },
  {
    email: 'abril@gmail.com',
    password: 'Admin123',
    nombre: 'Abril',
    sector: 'Soporte'
  },
  {
    email: 'guadalupe@gmail.com',
    password: 'Admin123',
    nombre: 'Guadalupe',
    sector: 'Soporte'
  },
  {
    email: 'lourdes@gmail.com',
    password: 'Admin123',
    nombre: 'Lourdes',
    sector: 'Gerencia'
  }
]
const login = (email, password, sector) => {
  const usuario = usuarios.find(
    u => u.email.toLowerCase() === email && u.password === password
  )
  if (!usuario) return { ok: false, error: 'CREDENCIALES' }
  if (usuario.sector !== sector) return { ok: false, error: 'SECTOR' }

  const { password: _omit, ...usuarioSeguro } = usuario  
  return { ok: true, usuario: usuarioSeguro }
}
export default {
  login
}