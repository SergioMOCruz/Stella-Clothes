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
    //await handleLoadOrders();
  }, []);

  //// AUTH ////
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
  const [orders, setOrders] = useState([
    {
      _id: '834532',
      name: 'José Castro',
      state: 'Aberto',
      products: [
        {
          reference: 'SCGL',
          quantity: 2,
          size: 'L',
          name: 'Santa Cruz Godlike',
          category: 'TSHIRT',
        },
      ],
    },
  ]);

  // order details div ref
  const orderDetails = useRef();
  // new order div ref
  const newOrder = useRef();
  // new order product refs
  const newOrderProductRef = useRef();
  const newOrderProductQnt = useRef();
  const newOrderProductSize = useRef();

  // load orders
  const handleLoadOrders = async (e) => {
    setDashboard('orders');

    // get orders
    try {
      const ordersResponse = await axios.get(context.api + '/orders', context.headersCRUD);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  // new order
  const handleNewOrder = async (e) => {
    // show new order form
    newOrder.current.style.display = 'flex';
    // hide orders table
    orderDetails.current.style.display = 'none';
  };

  // add product to order
  const [newOrderProductsList, setNewOrderProductsList] = useState([
    {
      reference: 'SCGL',
      quantity: 2,
      size: 'L',
      name: 'Santa Cruz Godlike',
      category: 'TSHIRT',
    },
  ]);

  // add product to order
  const handleAddProductToOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // values from inputs
    const productRef = newOrderProductRef.current.value;
    const productQnt = newOrderProductQnt.current.value;
    const productSize = newOrderProductSize.current.value;
    console.log('Product:', productRef, 'Quantity:', productQnt, 'Size:', productSize);

    // check if all fields are filled
    if (!productRef || !productQnt || !productSize) {
      return alert('Por favor, preencha todos os campos.');
    }

    // search for product in database by reference
    // JUST TESTING
    setNewOrderProductsList([
      ...newOrderProductsList,
      {
        reference: productRef,
        quantity: productQnt,
        size: productSize,
        name: 'Carhartt WIP Hoodie',
        category: 'SWEATSHIRT',
      },
    ]);
  };

  // cancel new order
  const handleCancelNewOrder = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // hide new order form
    newOrder.current.style.display = 'none';
    // show orders table
    orderDetails.current.style.display = 'flex';
  };

  //// PRODUCTS ////
  // products state
  const [products, setProducts] = useState([]);
  // active product state
  const [product, setProduct] = useState({});

  // product details div ref
  const productDetails = useRef();
  // new product div ref
  const newProduct = useRef();
  // new product product refs
  const newProductReference = useRef();
  const newProductName = useRef();
  const newProductDescription = useRef();
  const newProductSize = useRef();
  const newProductCategory = useRef();
  const newProductPrice = useRef();
  const newProductStock = useRef();

  // categories
  const [categories, setCategories] = useState([]);

  // load products
  const handleLoadProducts = async (e) => {
    setDashboard('products');

    // get categories
    try {
      const categoriesResponse = await axios.get(context.api + '/categories', context.headersCRUD);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error(error);
    }

    // get products
    try {
      const productsResponse = await axios.get(
        context.api + '/products/allByReference',
        context.headersCRUD
      );
      console.log('Products:', productsResponse.data);
      setProducts(productsResponse.data);
      setProduct(productsResponse.data[0]);

      // show product details
      showProductDetails();
      // add selected class to first product line
      document.querySelector('#products-table tbody tr').classList.add('selected');
    } catch (error) {
      console.error(error);
    }
  };

  // panel changing state
  const [panelProductDetails, setPanelProductDetails] = useState(false);
  const hideProductDetails = () => {
    setPanelProductDetails(false);
  };
  const showProductDetails = () => {
    setPanelProductDetails(true);
  };

  // click product
  const handleClickProduct = async (e, ref) => {
    // get product data
    const productData = products.find((product) => product.reference === ref);
    setProduct(productData);

    // add selected class to clicked product line
    const productLines = document.querySelectorAll('#products-table tbody tr');
    productLines.forEach((line) => {
      line.classList.remove('selected');
    });
    // check if the clicked element is text or the row itself
    if (e.target.tagName === 'TD') {
      e.target.parentElement.classList.add('selected');
    } else {
      e.target.classList.add('selected');
    }

    // show product details
    showProductDetails();
  };

  // new product
  const handleNewProduct = async (e) => {
    // hide product details
    hideProductDetails();
  };

  // add more stock
  const handleAddMoreStock = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // values from inputs
    const productSize = e.target[1].value;
    const productStock = e.target[2].value;

    // check if all fields are filled
    if (!productSize || !productStock) {
      return alert('Por favor, preencha todos os campos.');
    }

    // add stock to product
    // JUST TESTING
    const newStock = {
      size: productSize,
      stock: productStock,
    };
    console.log('New stock:', newStock);
  };

  // add product
  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // values from inputs
    const productReference = newProductReference.current.value;
    const productName = newProductName.current.value;
    const productDescription = newProductDescription.current.value;
    const productSize = newProductSize.current.value;
    const productCategory = newProductCategory.current.value;
    const productPrice = newProductPrice.current.value;
    const productStock = newProductStock.current.value;

    console.log(
      'Reference:',
      productReference,
      'Name:',
      productName,
      'Description:',
      productDescription,
      'Size:',
      productSize,
      'Category:',
      productCategory,
      'Price:',
      productPrice,
      'Stock:',
      productStock
    );

    // check if all fields are filled
    if (
      !productReference ||
      !productName ||
      !productDescription ||
      !productSize ||
      !productCategory ||
      !productPrice ||
      !productStock
    ) {
      return alert('Por favor, preencha todos os campos.');
    }

    // add product to database
    // await axios
    //   .post(
    //     context.api + '/products',
    //     {
    //       reference: productReference,
    //       name: productName,
    //       description: productDescription,
    //       price: productPrice,
    //       size: productSize,
    //       stock: [
    //         {
    //           size: productSize,
    //           stock: productStock,
    //         },
    //       ],
    //       category: productCategory,
    //     },
    //     context.headersCRUD
    //   )
    //   .then((response) => {
    //     console.log('Product added:', response.data);
    //     // hide new product form
    //     setPanelProductDetails(true);
    //     // reload products
    //     handleLoadProducts();
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  // delete product
  const handleDeleteProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // check if the user is sure
    if (!window.confirm('Tem a certeza que deseja apagar o produto?')) {
      return;
    }

    // delete product
    await axios
      .delete(context.api + '/products/reference/' + product.reference, context.headersCRUD)
      .then((response) => {
        console.log('Product deleted:', response.data);
        // hide product details
        hideProductDetails();
        // reload products
        handleLoadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // cancel new order
  const handleCancelNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // hide new product form
    setPanelProductDetails(true);
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
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-4)}</td>
                  <td style={{ fontWeight: 'var(--font-weight-semibold)' }}>{order.name}</td>
                  <td>
                    {order.status == 1 ? 'Aberto' : order.status == 2 ? 'Separado' : 'Cancelado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div id='order-details' ref={orderDetails}>
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

          <div id='new-order' ref={newOrder}>
            <h2>Nova encomenda</h2>
            <form id='new-order-form'>
              <div id='new-order-destinatary'>
                <label htmlFor='destinatary'>Destinatário</label>
                <input type='text' id='destinatary' placeholder='Nome Completo' />
              </div>
              <div id='new-order-address'>
                <label htmlFor='address'>Morada</label>
                <input type='text' id='address' placeholder='Rua' />
                <input type='text' id='address' placeholder='Nº da porta' />
                <input type='text' id='postal-code' placeholder='Código Postal' />
                <input type='text' id='city' placeholder='Cidade' />
              </div>
              <div id='new-order-products'>
                <label htmlFor='products'>Produtos</label>
                <div id='new-order-products-inputs'>
                  <input
                    type='text'
                    id='products'
                    placeholder='Referência'
                    ref={newOrderProductRef}
                  />
                  <input type='number' id='products' placeholder='99' ref={newOrderProductQnt} />
                  <select id='products' ref={newOrderProductSize}>
                    <option value='XS'>XS</option>
                    <option value='S'>S</option>
                    <option value='M'>M</option>
                    <option value='L'>L</option>
                    <option value='XL'>XL</option>
                  </select>
                  <button onClick={handleAddProductToOrder}>+</button>
                </div>
              </div>
              <div id='new-order-products-list'>
                <ul>
                  {newOrderProductsList.map((product) => (
                    <li id='product-line' key={product.reference}>
                      <p id='product-quantity'>{product.quantity}x</p>
                      <p id='product-category'>{product.category}</p>
                      <p id='product-name'>{product.name}</p>
                      <p id='product-size-text'>Tamanho:</p>
                      <p id='product-size'>{product.size}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div id='action-buttons'>
                <button id='ok-button' type='submit'>
                  Adicionar encomenda
                </button>
                <button id='cancel-button' onClick={handleCancelNewOrder}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {dashboard === 'products' && products.length > 0 && (
        <main>
          <table id='products-table'>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Descrição</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.reference}
                  onClick={(e) => handleClickProduct(e, product.reference)}
                >
                  <td>{product.reference}</td>
                  <td>{product.name}</td>
                  <td>
                    {product.stock.reduce((acc, s) => {
                      return acc + s.stock;
                    }, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {panelProductDetails && (
            <div id='product-details' ref={productDetails}>
              <h2>Detalhes do produto</h2>
              <div id='product-data'>
                <div id='product-image'>
                  <label htmlFor='product-img'>
                    <input type='file' id='product-img' style={{ display: 'none' }} />
                    <img src='https://via.placeholder.com/150' alt='Product image' />
                  </label>
                </div>
                <form id='product-description'>
                  <input
                    type='text'
                    value={product.reference}
                    onChange={(e) => setProduct({ ...product, reference: e.target.value })}
                  />
                  <input
                    type='text'
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  />
                  <input
                    type='text'
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  />
                  <input
                    type='text'
                    value={product.price + '€'}
                    pattern='[0-9]+([.][0-9]+)?'
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  />
                </form>
              </div>
              <div id='product-stock-table'>
                <table>
                  <thead>
                    <tr>
                      <th>XS</th>
                      <th>S</th>
                      <th>M</th>
                      <th>L</th>
                      <th>XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {product.stock.map((size, i) => {
                          return size.size === 'XS' ? size.stock : '';
                        })}
                      </td>
                      <td>
                        {product.stock.map((size, i) => {
                          return size.size === 'S' ? size.stock : '';
                        })}
                      </td>
                      <td>
                        {product.stock.map((size, i) => {
                          return size.size === 'M' ? size.stock : '';
                        })}
                      </td>
                      <td>
                        {product.stock.map((size, i) => {
                          return size.size === 'L' ? size.stock : '';
                        })}
                      </td>
                      <td>
                        {product.stock.map((size, i) => {
                          return size.size === 'XL' ? size.stock : '';
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <form id='product-add-stock' onSubmit={handleAddMoreStock}>
                <button type='submit'>+ Adicionar</button>
                <select name='product-sizes' id='product-sizes'>
                  <option value='XS'>XS</option>
                  <option value='S'>S</option>
                  <option value='M'>M</option>
                  <option value='L'>L</option>
                  <option value='XL'>XL</option>
                </select>
                <input type='number' placeholder='1' />
              </form>
              <div id='action-buttons'>
                <button id='ok-button'>Guardar</button>
                <button id='cancel-button' onClick={handleDeleteProduct}>
                  Apagar
                </button>
              </div>
            </div>
          )}

          {!panelProductDetails && (
            <div id='new-product' ref={newProduct}>
              <h2>Novo produto</h2>
              <form id='new-product-form' onSubmit={handleAddNewProduct}>
                <div id='new-product-reference'>
                  <label htmlFor='reference'>Referência</label>
                  <input type='text' id='reference' placeholder='SCGL' ref={newProductReference} />
                </div>
                <div id='new-product-name'>
                  <label htmlFor='name'>Nome</label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Santa Cruz Godlike'
                    ref={newProductName}
                  />
                </div>
                <div id='new-product-description'>
                  <label htmlFor='description'>Descrição</label>
                  <input
                    type='text'
                    id='description'
                    placeholder='100% Algodão'
                    ref={newProductDescription}
                  />
                </div>
                <div id='new-product-size'>
                  <label htmlFor='size'>Tamanho</label>
                  <select
                    name='new-product-sizes-select'
                    id='new-product-sizes-select'
                    ref={newProductSize}
                  >
                    <option value='XS'>XS</option>
                    <option value='S'>S</option>
                    <option value='M'>M</option>
                    <option value='L'>L</option>
                    <option value='XL'>XL</option>
                  </select>
                </div>
                <div id='new-product-category'>
                  <label htmlFor='new-product-categories-select'>Categoria</label>
                  <select
                    name='new-product-categories-select'
                    id='new-product-categories-select'
                    ref={newProductCategory}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.description}>
                        {category.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div id='new-product-price'>
                  <label htmlFor='price'>Preço</label>
                  <input type='number' id='price' placeholder='19.99' ref={newProductPrice} />
                </div>
                <div id='new-product-stock'>
                  <label htmlFor='stock'>Stock</label>
                  <input type='number' id='stock' placeholder='5' ref={newProductStock} />
                </div>
                <div id='action-buttons'>
                  <button id='ok-button' type='submit'>
                    Adicionar produto
                  </button>
                  <button id='cancel-button' onClick={handleCancelNewProduct}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      )}

      {dashboard === 'clients' && clients.length > 0 && <p>Not implemented yet!</p>}
    </div>
  );
}

export default Dash;
