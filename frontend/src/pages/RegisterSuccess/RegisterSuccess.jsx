import { Link } from 'react-router-dom'

function RegisterSuccess() {
  return (
    <div>
      <h1>¡Usuario creado con éxito!</h1>
      <Link to="/login">Iniciar sesión</Link>
    </div>
  )
}

export default RegisterSuccess
