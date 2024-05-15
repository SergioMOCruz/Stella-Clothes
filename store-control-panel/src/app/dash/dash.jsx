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
  const newProductCategory = useRef();
  const newProductPrice = useRef();

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

    // show product details
    showProductDetails();
  };

  // new product
  const handleNewProduct = async (e) => {
    // hide product details
    hideProductDetails();
    // clear product
    setProduct({});
  };

  // add more stock
  const handleAddMoreStock = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // values from inputs
    const productSize = e.target[1].value;
    const productStock = e.target[2].value;

    // check if all fields are filled
    if (!productStock) {
      return alert('Por favor, preencha todos os campos.');
    }

    // add stock to product
    const body = {
      reference: product.reference,
      size: productSize,
      stock: productStock,
    };

    await axios
      .put(context.api + '/products/stock', body, context.headersCRUD)
      .then((response) => {
        console.log('Stock added:', response.data);
        // reload products
        handleLoadProducts();
        // clear inputs
        e.target[2].value = '';
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // add product
  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // values from inputs
    const productReference = newProductReference.current.value;
    const productName = newProductName.current.value;
    const productDescription = newProductDescription.current.value;
    const productCategory = newProductCategory.current.value;
    const productPrice = newProductPrice.current.value;

    console.log(
      'Reference:',
      productReference,
      'Name:',
      productName,
      'Description:',
      productDescription,
      'Category:',
      productCategory,
      'Price:',
      productPrice
    );

    // check if all fields are filled
    if (
      !productReference ||
      !productName ||
      !productDescription ||
      !productCategory ||
      !productPrice
    ) {
      return alert('Por favor, preencha todos os campos.');
    }

    //add product to database
    await axios
      .post(
        context.api + '/products',
        {
          reference: productReference,
          name: productName,
          description: productDescription,
          price: productPrice,
          size: 'XS',
          stock: 0,
          category: productCategory,
        },
        context.headersCRUD
      )
      .then((response) => {
        console.log('Product added:', response.data);
        // reload products
        handleLoadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // product states
  const [productReference, setProductReference] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // update product states when product changes
  useEffect(() => {
    if (product) {
      setProductReference(product.reference);
      setProductName(product.name);
      setProductDescription(product.description);
      setProductCategory(product.category);
      setProductPrice(product.price);
    }
  }, [product]);

  // update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // check which field was updated and if it was actually updated
    switch (e.target.id) {
      case 'pRef':
        if (e.target.value === product.reference) {
          return;
        }
        break;
      case 'pCat':
        if (e.target.value === product.category) {
          return;
        }
        break;
      case 'pName':
        if (e.target.value === product.name) {
          return;
        }
        break;
      case 'pDesc':
        if (e.target.value === product.description) {
          return;
        }
        break;
      case 'pPrice':
        if (e.target.value == product.price) {
          return;
        }
        break;
      default:
        return;
    }

    // check if all fields are filled
    if (
      !productReference ||
      !productName ||
      !productDescription ||
      !productCategory ||
      !productPrice
    ) {
      return alert('Por favor, preencha todos os campos.');
    }

    console.log(
      'Reference:',
      productReference,
      'Name:',
      productName,
      'Description:',
      productDescription,
      'Category:',
      productCategory,
      'Price:',
      productPrice
    );

    // update product
    await axios
      .put(
        context.api + '/products/reference/' + product.reference,
        {
          ref: productReference,
          name: productName,
          description: productDescription,
          category: productCategory,
          price: productPrice,
        },
        context.headersCRUD
      )
      .then((response) => {
        console.log('Product updated:', response.data);
        // reload products
        handleLoadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // hide product
  const handleHideProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // check if the user is sure
    if (!window.confirm('Tem a certeza que deseja esconder o produto?')) {
      return;
    }

    // hide product
    await axios
      .put(context.api + '/products/hide/' + product.reference, {}, context.headersCRUD)
      .then((response) => {
        console.log('Product deleted:', response.data);
        // reload products
        handleLoadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // show product
  const handleShowProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // show product
    await axios
      .put(context.api + '/products/show/' + product.reference, {}, context.headersCRUD)
      .then((response) => {
        console.log('Product deleted:', response.data);
        // reload products
        handleLoadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // cancel new product
  const handleCancelNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // hide new product form
    setPanelProductDetails(true);
    // set product to first product
    setProduct(products[0]);
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

      {dashboard === 'products' && (
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
              {product &&
                products.map((p) => (
                  <tr
                    key={p.reference}
                    onClick={(e) => handleClickProduct(e, p.reference)}
                    className={p.reference === product.reference ? 'selected' : ''}
                  >
                    <td>{p.reference}</td>
                    <td>{p.name}</td>
                    <td>{p.stock.reduce((acc, curr) => acc + curr.stock, 0)}</td>
                  </tr>
                ))}
              {products.length === 0 ? (
                <tr style={{ display: 'flex' }}>
                  <td>Sem produtos</td>
                </tr>
              ) : (
                <></>
              )}
            </tbody>
          </table>

          {panelProductDetails && product && (
            <div id='product-details' ref={productDetails}>
              <h2>Detalhes do produto</h2>
              <div id='product-data'>
                <div id='product-image'>
                  <label htmlFor='product-img'>
                    <input type='file' id='product-img' style={{ display: 'none' }} />
                    <img src='https://via.placeholder.com/150' alt='Product image' />
                  </label>
                </div>
                <div id='product-description'>
                  <input
                    id='pRef'
                    type='text'
                    value={productReference}
                    onChange={(e) => setProductReference(e.target.value)}
                    onBlur={handleUpdateProduct}
                  />
                  <select
                    name='product-category'
                    id='pCat'
                    value={productCategory}
                    onChange={handleUpdateProduct}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.value}>
                        {category.description}
                      </option>
                    ))}
                  </select>
                  <input
                    id='pPrice'
                    type='text'
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    pattern='[0-9]+([.][0-9]+)?'
                    onBlur={handleUpdateProduct}
                  />
                  <input
                    id='pName'
                    type='text'
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    onBlur={handleUpdateProduct}
                  />
                  <textarea
                    id='pDesc'
                    type='text'
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    onBlur={handleUpdateProduct}
                  />
                </div>
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
                <input
                  type='number'
                  placeholder='1'
                  // only numbers, no decimals or negative numbers or dots or commas
                  pattern='[0-9]'
                />
              </form>
              <div id='action-buttons'>
                {product.active ? (
                  <button id='hide-button' onClick={handleHideProduct}>
                    Esconder da loja
                  </button>
                ) : (
                  <button id='show-button' onClick={handleShowProduct}>
                    Mostrar na loja
                  </button>
                )}
              </div>
            </div>
          )}

          {(!panelProductDetails || products.length === 0) && (
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
                  <input
                    type='text'
                    id='price'
                    placeholder='19.99'
                    ref={newProductPrice}
                    pattern='[0-9]+([.][0-9]+)?'
                  />
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
