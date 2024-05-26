import './login.css';
import { useContext } from 'react';
import { APIContext } from '../contexts/context';
import axios from 'axios';
import logo from '../../assets/images/icon.png';

function Login() {
  const context = useContext(APIContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    context.setLoading(true);
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    const body = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(context.api + '/accounts/login', body, context.headersCRUD);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('accID', response.data.accID);
      
      context.setLoading(false);

      context.navigate('/dash');
    } catch (error) {
      console.error(error.message);
      context.setLoading(false);
      alert('Utilizador ou palavra-passe incorretos!');
      document.getElementById('password').value = '';
      document.getElementById('password').focus();
    }
  };

  return (
    <section id='menu-login'>
      <img src={logo} alt='' />
      <h2>Entrar / Iniciar Sessão</h2>
      <form onSubmit={handleSubmit} method='post'>
        <input type='email' id='email' name='email' placeholder='Email' required />
        <input type='password' id='password' name='password' placeholder='Password' required />
        <a
          id='forgot-pass'
          onClick={() => {
            alert('Envie email para suporte@trabalho-pds.com com o assunto Recuperação de Conta para prosseguir com a recuperação da sua conta.');
          }}
        >
          Esqueceu a password?
        </a>
        <button id='login-btn' type='submit'>
          Entrar
        </button>
      </form>
    </section>
  );
}

export default Login;
