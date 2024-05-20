const nodemailer = require('nodemailer');
const Order = require('../models/order');
const Account = require('../models/account');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Category = require('../models/category');
const OrderData = require('../models/order_data');
const { uploadSingleFile } = require('../utils/google-storage');

// Get all orders
const getAll = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const accountId = req.user.id;

    let order = await Order.findOne({ _id: id, accountId: accountId });

    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });

    let orderData = await OrderData.find({ orderId: id });

    order = order.toObject();
    delete order.accountId;
    delete order.paymentId;

    orderData = orderData.map((item) => {
      const obj = item.toObject();
      delete obj._id;
      return obj;
    });

    order.orderData = orderData;
    res.status(200).json(order);
  } catch (error) {
    console.error('Get Order By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by account id
const getByAccount = async (req, res) => {
  try {
    let orders = await Order.find({ accountId: req.user._id });
    if (!orders) return res.status(404).json({ message: 'Encomendas não encontradas!' });

    // Convert each Mongoose document to a plain JavaScript object
    orders = orders.map((order) => order.toObject());

    // Get order data for each order since this will be received by end user
    for (let order of orders) {
      const orderData = await OrderData.find({ orderId: order._id });
      if (!orderData)
        return res.status(404).json({ message: 'A encomenda não tem produtos associados!' });

      // Removing order account id for security measures
      delete order.accountId;
      order.orderData = orderData;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get Order By Account Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all orders by order data's
const getByOrderData = async (req, res) => {
  try {
    let orders = await Order.find();
    if (!orders) return res.status(404).json({ message: 'Encomendas não encontradas!' });

    // Convert each Mongoose document to a plain JavaScript object
    orders = orders.map((order) => order.toObject());

    // Get order data for each order since this will be received by end user
    for (let order of orders) {
      const orderData = await OrderData.find({ orderId: order._id });
      if (!orderData)
        return res.status(404).json({ message: 'A encomenda não tem produtos associados!' });

      order.products = orderData;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get Order By Order Data Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const accountId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, accountId: accountId });
    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Order Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search order by name
const search = async (req, res) => {
  try {
    const { name } = req.params;

    // Get all orders that have the name or a part of the name in the order data
    let orders = await Order.find({
      $or: [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } },
      ],
    });
    if (!orders) return res.status(404).json({ message: 'Encomendas não encontradas!' });

    // Convert each Mongoose document to a plain JavaScript object
    orders = orders.map((order) => order.toObject());

    // Get order data for each order since this will be received by end user
    for (let order of orders) {
      const orderData = await OrderData.find({ orderId: order._id });
      if (!orderData)
        return res.status(404).json({ message: 'A encomenda não tem produtos associados!' });

      order.products = orderData;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Search Order Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new order
const create = async (req, res) => {
  try {
    const accountId = req.user.id;
    const paymentId = req.body.paymentId;
    let total = 0;

    if (!paymentId) return res.status(400).json({ message: 'O ID do pagamento é obrigatório!' });

    let account = await Account.findOne({ _id: accountId });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada!' });
    const orderInfo = account.orderInfo;

    const productsWithQuantity = await Cart.find({ clientId: req.user.id });
    if (!productsWithQuantity || productsWithQuantity.length === 0)
      return res.status(404).json({ message: 'Carrinho vazio!' });

    // Check if all fields are filled except nif (nif is optional)
    if (
      !orderInfo.contactInfo ||
      !orderInfo.firstName ||
      !orderInfo.lastName ||
      !orderInfo.street ||
      !orderInfo.addressExtra ||
      !orderInfo.postalCode ||
      !orderInfo.city ||
      !orderInfo.country ||
      !productsWithQuantity ||
      !Array.isArray(productsWithQuantity) ||
      !productsWithQuantity.every(
        (product) => product.productReference && product.quantity && product.size
      )
    ) {
      return res.status(400).json({ message: 'Todos os campos devem estar preenchidos!' });
    }

    // Check if product exists
    for (const product of productsWithQuantity) {
      const { productReference, quantity, size } = product;
      const reference = productReference;

      const existingProduct = await Product.findOne({ reference, size });
      if (!existingProduct)
        return res.status(409).json({
          message: `O produto com a referência '${reference}' e tamanho '${size}' não existe!`,
        });
      if (existingProduct.stock < quantity)
        return res.status(409).json({
          message: `O produto com a referência '${reference}' e tamanho '${size}' não tem stock suficiente!`,
        });

      const subTotal = quantity * existingProduct.price;
      total += subTotal;
    }

    // Body of order
    let order = new Order({
      accountId: req.user._id,
      contactInfo: orderInfo.contactInfo,
      firstName: orderInfo.firstName,
      lastName: orderInfo.lastName,
      address: {
        street: orderInfo.street,
        addressExtra: orderInfo.addressExtra || null,
        city: orderInfo.city,
        postalCode: orderInfo.postalCode,
        country: orderInfo.country,
      },
      paymentId: paymentId,
      nif: orderInfo.nif || null,
      status: [
        {
          status: 'Pago',
          date: Date.now(),
        },
      ],
      total: total,
    });
    await order.save();

    let allOrderData = [];
    // Create order data for each product and remove stock from products after order is made
    for (const product of productsWithQuantity) {
      const { productReference, quantity, size } = product;
      const reference = productReference;

      const existingProduct = await Product.findOne({ reference, size });
      const productCategory = await Category.findOne({ _id: existingProduct.category });

      const orderData = new OrderData({
        orderId: order._id,
        productId: existingProduct._id,
        reference: existingProduct.reference,
        name: existingProduct.name,
        description: existingProduct.description,
        category: productCategory.description,
        quantity: quantity,
        image: existingProduct.image,
        priceAtTime: existingProduct.price,
        size: size,
      });
      await orderData.save();

      allOrderData.push(orderData);

      existingProduct.stock -= quantity;
      existingProduct.save();
    }

    await Cart.deleteMany({ clientId: accountId });
    await Account.updateOne({ _id: accountId }, { $unset: { orderInfo: '' } });

    console.log('Order created with success!\nOrder Id:', order._id);
    order = order.toObject();
    delete order.accountId;
    order.orderData = allOrderData;

    res.status(200).json({ order: order, message: 'Order registered!' });
  } catch (error) {
    console.error('Order Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload order pdf
const uploadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const pdf = req.file;

    const order = await Order.findById({ _id: id });

    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });

    if (!pdf) return res.status(400).json({ message: 'Erro ao ler o ficheiro.' });

    // Upload pdf to Google Cloud Storage
    const pdfUrl = await uploadSingleFile(pdf, id);

    // Update pdf to order
    order.pdfUrl = pdfUrl;

    await order.save();

    res.status(200).json(pdfUrl);
  } catch (error) {
    console.error('Update PDF Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a order
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountId, productsIds, paymentId, status } = req.body;

    // Find order by id
    let order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });

    // Update order and verify if all fields are filled
    order.accountId = accountId || order.accountId;
    order.cartId = cartId || order.cartId;
    order.productsIds = productsIds || order.productsIds;
    order.paymentId = paymentId || order.paymentId;
    order.status = status || order.status;

    await order.save();
    res.status(200).json({ message: 'Encomenda atualizada com sucesso!' });
  } catch (error) {
    console.error('Update Order Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find order by id
    let order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });

    // Check if status is valid
    if (!status || !['Em processo', 'Pago', 'Enviado', 'Entregue', 'Cancelado'].includes(status))
      return res.status(400).json({ message: 'Estado inválido!' });

    // Update order status and verify if all fields are filled
    order.status.push({
      status: status || order.status,
      date: Date.now(),
    });

    // Send email to user with order status with nodemailer
    const account = await Account.findById(order.accountId);
    const email = account.email;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    let mailOptions;
    if (status === 'Enviado') {
      mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Obrigado pela sua compra!',
        text: `O estado da sua encomenda foi atualizado para: ${status}
        \nObrigado por comprar na nossa loja!
        \nAtenciosamente,
        \nA equipa da Stella Clothes`,
      };
    }
    if (status === 'Cancelado') {
      mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'O seu pedido foi cancelado',
        text: `O estado da sua encomenda foi atualizado para: ${status}
        \nSe tiver alguma dúvida, por favor, contacte-nos.
        \nAtenciosamente,
        \nA equipa da Stella Clothes`,
      };
    }

    // Send the email
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    await order.save();
    return res.status(200).json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update Order Status Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a order
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: 'Encomenda não encontrada!' });
    res.status(200).json({ message: 'Encomenda removida com sucesso!' });
  } catch (error) {
    console.error('Delete Order Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getById,
  getByAccount,
  getByOrderData,
  verifyOrder,
  search,
  create,
  uploadPdf,
  update,
  updateStatus,
  remove,
};
