import './dash.css';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { APIContext } from '../contexts/context';

function Dash() {
  // context
  const context = useContext(APIContext);
  // account token
  const token = localStorage.getItem('token');
  // account object
  const [account, setAccount] = useState({});
  // get account data
  const getAccountData = async () => {
    await axios
      .get(context.api + '/accounts/token', context.headersCRUD)
      .then((response) => {
        setAccount(response.data);
      })
      .catch((error) => {
        console.error(error);
        console.log(error.response.data);
        if (error.response.status === 404) {
          localStorage.removeItem('token');
          alert('Sessão expirada, por favor faça login novamente.');
        }
        context.navigate('/');
      });
  };

  //check if account is logged in
  useEffect(async () => {
    if (!token) {
      console.error('No token');
      return context.navigate('/');
    }
    await getAccountData();
  }, []);

  return (
    <div className='dash'>
      <nav>
        <button className='selected'>
          Encomendas
        </button>
        <button>
          Produtos
        </button>
        <button>
          Clientes
        </button>
      </nav>
    </div>
  );
}

export default Dash;
