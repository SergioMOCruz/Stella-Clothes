import './dash.css';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { APIContext } from '../contexts/context';

function Dash() {
  // context
  const context = useContext(APIContext);

  // account token
  const token = localStorage.getItem('token');

  //check if account is logged in
  useEffect(async () => {
    if (!token) {
      console.error('No token');
      return context.navigate('/');
    }
    await getAccountData();
  }, []);

  // get account data
  const getAccountData = async () => {
    await axios
      .get(context.api + '/accounts/token', context.headersCRUD)
      .then((response) => {
        console.log('Login successful!');
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

  //// DASHBOARD ////
  const [dashboard, setDashboard] = useState('orders');

  // search input ref
  const searchInput = useRef();

  // search
  const handleSearch = async (e) => {
    const search = searchInput.current.value;
    if (search.length === 0) {
      return alert('Digite algo para pesquisar.');
    }
    console.log('Searching for:', search);

    // clear search input
    searchInput.current.value = '';
    // unfocus search input
    searchInput.current.blur();
  };

  //// ORDERS ////
  const [orders, setOrders] = useState([1]);

  // load orders
  const handleLoadOrders = async (e) => {
    setDashboard('orders');
  };

  // new order
  const handleNewOrder = async (e) => {
    console.log('New order');
  };

  //// PRODUCTS ////
  const [products, setProducts] = useState([1]);

  // load products
  const handleLoadProducts = async (e) => {
    setDashboard('products');
  };

  // new product
  const handleNewProduct = async (e) => {
    console.log('New product');
  };

  //// CLIENTS ////
  const [clients, setClients] = useState([1]);

  // load clients
  const handleLoadClients = async (e) => {
    setDashboard('clients');
  };

  // new client
  const handleNewClient = async (e) => {
    console.log('New client');
  };

  return (
    <div className='dash'>
      <nav>
        <button className={dashboard === 'orders' ? 'selected' : ''} onClick={handleLoadOrders}>
          Encomendas
        </button>
        <button className={dashboard === 'products' ? 'selected' : ''} onClick={handleLoadProducts}>
          Produtos
        </button>
        <button className={dashboard === 'clients' ? 'selected' : ''} onClick={handleLoadClients}>
          Clientes
        </button>
      </nav>
      <section id='menu'>
        <div id='search'>
          <input
            type='text'
            placeholder='Pesquisar...'
            ref={searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        {dashboard === 'orders' && orders.length > 0 && <a onClick={handleNewOrder}>+ Adicionar</a>}
        {dashboard === 'products' && products.length > 0 && (
          <a onClick={handleNewProduct}>+ Adicionar</a>
        )}
        {dashboard === 'clients' && clients.length > 0 && (
          <a onClick={handleNewClient}>+ Adicionar</a>
        )}
      </section>
      {dashboard === 'orders' && orders.length > 0 && (
        <main>
          <table id='orders-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th style={{ fontWeight: 'var(--font-weight-semibold)' }}>Nome</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>834532</td>
                <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>José Castro</td>
                <td>Aberto</td>
              </tr>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.name}</td>
                  <td>{order.state}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div id='order-details'>
            <h2>Detalhes da encomenda</h2>
            <h3>Destinatário</h3>
            <p>José Castro</p>

            <h3>Morada</h3>
            <p>Rua de Cima, 45</p>
            <p>4710-765 Carcavelinhos</p>

            <h3>Produtos</h3>
            <ul>
              <li id='product-line'>
                <p id='product-quantity'>2x</p>
                <p id='product-category'>TSHIRT</p>
                <p id='product-name'>Santa Cruz Godlike</p>
                <p id='product-size-text'>Tamanho:</p>
                <p id='product-size'>L</p>
              </li>
            </ul>
            <div id='action-buttons'>
              <button id='ok-button'>Separar encomenda</button>
              <button id='cancel-button'>Cancelar</button>
            </div>
          </div>
        </main>
      )}

      {dashboard === 'products' && products.length > 0 && <p>Not implemented yet!</p>}

      {dashboard === 'clients' && clients.length > 0 && <p>Not implemented yet!</p>}
    </div>
  );
}

export default Dash;
