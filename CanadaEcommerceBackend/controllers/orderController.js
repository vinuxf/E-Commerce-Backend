const orderDbService = require("../services/orderDbService");
// const emailDbService = require("../services/emailDbService");
const emailController = require("../controllers/emailController");

const addOrder = async (req, res) => {
  try {
    const {
      Subtotal,
      DeliveryFee,
      Total,
      Firstname,
      Lastname,
      Address1,
      Address2,
      City,
      DeliveryMethod,
      Province,
      PostalCode,
      Contact,
      User_idUsers,
      SaveIt,
      products,
      email,
      Discount
    } = req.body;

    const created_at = new Date();

    const add_result = await orderDbService.addOrder(
      Subtotal,
      DeliveryFee,
      Total,
      Firstname,
      Lastname,
      Address1,
      Address2,
      City,
      DeliveryMethod,
      Province,
      PostalCode,
      Contact,
      User_idUsers,
      SaveIt,
      created_at,
      Discount,
    );

    const insertedID = add_result.insertId;

    products.map(async (product) => {
      await orderDbService.addOrderHasProducts(
        product.Quantity,
        insertedID,
        product.Product_idProducts
      );
    });

    if (SaveIt == 1) {
      await orderDbService.checkCustomer(User_idUsers);
      await orderDbService.addCustomerDetails(
        Firstname,
        Lastname,
        Address1,
        Address2,
        City,
        Province,
        PostalCode,
        Contact,
        DeliveryMethod,
        User_idUsers
      );
    }

    await emailController.sendEmail({
      email: email,
      name: Firstname,
      item_id: 1,
      orderItems: products,
      subtotal: Subtotal,
      paymentMethod: 1,
      total: Total,
      Discount: Discount
    });

    await emailController.sendEmailForAdmin({
      email: email,
      name: Firstname,
      item_id: 1,
      orderItems: products,
      subtotal: Subtotal,
      paymentMethod: 1,
      total: Total,
    });

    res.status(201).json({ message: "Order process completed!" });
  } catch (err) {
    res.status(500).json({
      message: "Somthing went wrong when adding the order!",
      error: err.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const fetch_all = await orderDbService.getAllOrders();
    const data = await Promise.all(
      fetch_all.map(async (item) => {
        const getProductsAccordingtoOrderID =
          await orderDbService.getAllOrderedProducts(item.idOrder);
        const data2 = await Promise.all(
          getProductsAccordingtoOrderID.map(async (item2) => {
            const allProductDetails =
              await orderDbService.getAllDetailsByIDFROMPRODUCT(
                item2.Product_idProducts
              );
            return {
              ...item2,
              allProductDetails: allProductDetails,
            };
          })
        );

        return {
          ...item,
          Products: data2,
        };
      })
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(503).json({
      message: "Something went wrong when fetching the orders!",
      error: err.message,
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { idOrder } = req.params;
    await orderDbService.changeStatus(idOrder);
    res.status(201).json({ message: "Status Changed successfully!" });
  } catch (err) {
    res.status(503).json({
      message: "Somthing went wrong when changing the status!",
      error: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const fetch_all = await orderDbService.getOrderById(idOrder);
    const data = await Promise.all(
      fetch_all.map(async (item) => {
        const getProductsAccordingtoOrderID =
          await orderDbService.getAllOrderedProducts(item.idOrder);
        return {
          ...item,
          Products: getProductsAccordingtoOrderID,
        };
      })
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(503).json({
      message: "Somthing went wrong when fetching the orders!",
      error: err.message,
    });
  }
};

const fetchOrdersByUserId = async (req, res) => {
  try {
    const { User_idUsers } = req.params;
    const fetched_results = await orderDbService.fetchOrdersByUserId(
      User_idUsers
    );
    const baseURL = `${req.protocol}://${req.get("host")}/product-images/`;
    const data = await Promise.all(
      fetched_results.map(async (item) => {
        const fetched_products =
          await orderDbService.fetchAllProductsAccordintoOrderid(item.idOrder);
        const fetched_data_with_image_url = await Promise.all(
          fetched_products.map(async (item2) => {
            const picURL = baseURL + item2.Image;
            return {
              ...item2,
              PictureURL: picURL,
            };
          })
        );
        return {
          ...item,
          productDetails: fetched_data_with_image_url,
        };
      })
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(503).json({
      message: "Somthing went wrong when fetching the orders by userid!",
      error: err.message,
    });
  }
};
module.exports = {
  addOrder,
  getAllOrders,
  changeStatus,
  getOrderById,
  fetchOrdersByUserId,
};
