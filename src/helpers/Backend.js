/*
 *
 *
 * @author:Usman Sultan
 *All apis and backend work of the app is in this file
 *
 *
 */

import { baseUrl } from "./Config";
import axios from "axios";

// Axios instance with interceptors
const api = axios.create({ baseURL: baseUrl });

api.interceptors.request.use(
  (config) => {
    try {
      const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
      console.log("[API Request]", (config.method || "GET").toUpperCase(), fullUrl, {
        headers: config.headers,
        params: config.params,
        data: config.data,
      });
    } catch (_) {}
    return config;
  },
  (error) => {
    try {
      const cfg = error?.config || {};
      const fullUrl = `${cfg.baseURL || ""}${cfg.url || ""}`;
      console.log("[API Request Error]", error?.message, fullUrl);
    } catch (_) {}
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    try {
      const fullUrl = `${response?.config?.baseURL || ""}${response?.config?.url || ""}`;
      console.log("[API Response]", response.status, fullUrl, response?.data);
    } catch (_) {}
    return response;
  },
  (error) => {
    try {
      if (error?.response) {
        const { status, config, data } = error.response;
        const fullUrl = `${config?.baseURL || ""}${config?.url || ""}`;
        console.log("[API Response Error]", status, fullUrl, data);
      } else {
        const cfg = error?.config || {};
        const fullUrl = `${cfg.baseURL || ""}${cfg.url || ""}`;
        console.log("[API Response Error]", error?.message, fullUrl);
      }
    } catch (_) {}
    return Promise.reject(error);
  }
);

const getProducts = async (storeId, page, limit) => {
  try {
    return await api.get(`/product`);
  } catch (e) {
    return e;
  }
};
const getProductsByCategory = async (id, storeId) => {
  try {
    return await api.get(`/product/getAllByCategory/${id}`);
  } catch (e) {
    return e;
  }
};

const getCategories = async () => {
  try {
    return await api.get(`/category`);
  } catch (e) {
    return e;
  }
};

const GetSignedUserDetails = async (token) => {
  try {
    // const dbResponse = await axios.get(`${baseUrl}/getUserDetails`, {
    //     headers: {
    //         Authorization: `Bearer ${token}`
    //     }
    // })
    // return dbResponse
    return {
      data: {
        status: true,
        message: "success",
        data: {
          list: [],
        },
      },
    };
    // eslint-disable-next-line no-unreachable
  } catch (e) {
    return e;
  }
};

const GetFavProducts = async (token, id) => {
  try {
    console.log("ID=>", id);
    return await api.get(`/favorite/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    return e;
  }
};

const GetUserCart = async (token, id) => {
  try {
    return await api.get(`/user/getUserCart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    return e;
  }
};

const AddProductToCart = async (token, body) => {
  try {
    return await api.post(`/user/addToCart`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    return e;
  }
};
const AddDealToCart = async (token, body) => {
  try {
    return await api.post(`/user/addDealToCart`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    return e;
  }
};

const GetProductDetails = async (token, id) => {
  try {
    console.log("DIIDIDID", id);
    return await api.get(`/product/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    return e;
  }
};

const CreateUser = async (body) => {
  try {
    const dbResponse = await api.post(`/addUser`, body);
    return dbResponse;
  } catch (e) {
    return e;
  }
};

const UpdateUserInfo = async (token, body) => {
  try {
    const dbResponse = await api.put(`/updateUser`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (dbResponse.data.status) {
      const response = await GetSignedUserDetails(token);
      return response.data.data.list;
    }
  } catch (e) {
    return e;
  }
};

const AddUserAddress = async (token, body) => {
  try {
    const dbResponse = await api.post(`/address/add`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return dbResponse.data;
  } catch (e) {
    return e;
  }
};
const GetUserAddresses = async (userId) => {
  try {
    console.log("User ID ", userId);
    const dbResponse = await api.get(`/address/get/${userId}`);

    console.log("User db", dbResponse.data);
    return dbResponse.data;
  } catch (e) {
    console.log("ERERERERERER", e);
    return e;
  }
};

const DeleteProductFromCart = async (token, pid, uid) => {
  const body = {
    userId: uid,
    productId: pid,
  };
  console.log("body", body);
  try {
    await api.post(`/user/cart/delete`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await GetUserCart(token, uid);
    console.log("response", response);
    return response.data.data;
  } catch (e) {
    return e;
  }
};
const DeleteDealFromCart = async (token, dId, uid) => {
  const body = {
    userId: uid,
    dealId: dId,
  };
  console.log("body", body);
  try {
    await api.post(`/user/cart/deal/delete`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await GetUserCart(token, uid);
    console.log("response", response);
    return response.data.data;
  } catch (e) {
    return e;
  }
};

const CheckOutCart = async (data) => {
  try {
    const dbResponse = await api.post(`/order/checkout`, data);
    return dbResponse.data.data;
  } catch (e) {
    return e;
  }
};

const AddOrder = async (data) => {
  console.log("data", JSON.stringify(data));
  try {
    const dbResponse = await api.post(`/order/createOrder`, data);
    console.log("dbRes=>", dbResponse);
    return dbResponse.data;
  } catch (e) {
    console.log("error=>", e.message);
    return e;
  }
};

const GetStoreId = async (zip, token) => {
  try {
    console.log(`${baseUrl}/store?zipCode=${zip.toUpperCase()}`);
    const dbResponse = await api.get(
      `/store?zipCode=${zip.toUpperCase()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("dbResponse=>", dbResponse.data);
    return {
      data: {
        status: dbResponse.data.data > 0,
        message: "success",
        data: {
          list: {
            store_id: dbResponse.data.data[0],
            store_name: "Store 1",
            store_address: "Address 1",
            store_phone: "1234567890",
            store_zip: "12345",
            store_state: "CA",
            store_city: "San Francisco",
            store_image: "https://example.com/image.jpg",
          },
        },
      },
    };
  } catch (e) {
    console.log("e=>", e);
    return e;
  }
};

const GetOrders = async (id, token, page, limit) => {
  try {
    console.log(`${baseUrl}/order/getOrders/${id}`);
    const dbResponse = await api.get(`/order/getOrders/${id}`);
    return dbResponse.data.data;
  } catch (e) {
    return e;
  }
};

const GetSetupIntent = async (token) => {
  try {
    const dbResponse = await api.get(`/setupIntent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return dbResponse.data.data.list;
  } catch (e) {
    return e;
  }
};

const DeleteUserCard = async (token, id) => {
  try {
    await api.delete(`/cards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await GetSignedUserDetails(token);

    return response.data.data.list;
  } catch (e) {
    return e;
  }
};

const SetToken = async (body) => {
  // const dbResponse = await api.post(`/token`, body)
  // return dbResponse
  return {
    status: true,
    message: "success",
  };
};

const AddProdToFav = async (token, body) => {
  try {
    const dbResponse = await api.post(`/favorite/create`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return dbResponse;
  } catch (e) {
    return e;
  }
};

const RemoveProdToFav = async (token, body) => {
  try {
    const dbResponse = await api.delete(`/favourite_products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: body,
    });
    return dbResponse;
  } catch (e) {
    return e;
  }
};

const RemoveAddress = async (token, id) => {
  try {
    await api.delete(`/address/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await GetSignedUserDetails(token);
    return response.data.data.list;
  } catch (e) {
    return e;
  }
};

const VerifyPromoCode = async (token, body) => {
  try {
    const dbResponse = await api.post(`/verifyPromo`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return dbResponse;
  } catch (e) {
    return e;
  }
};
const VerifyUserAccount = async (token, body) => {
  try {
    const dbResponse = await api.post(`/auth/verify-otp`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return dbResponse;
  } catch (e) {
    return e;
  }
};

const GetFeaturedProducts = async () => {
  try {
    return await api.get(`/product/featured`);
  } catch (e) {
    return e;
  }
};

const GetActiveDeals = async () => {
  try {
    return await api.get(`/deal/active`);
  } catch (e) {
    return e;
  }
};
const FetchUserAddresses = async (id) => {
  try {
    return await api.get(`/address/get/${id}`);
  } catch (e) {
    return e;
  }
};

const SignUpWithEmailAndPassword = async (email, password) => {
  try {
    return await api.post(`/auth/register`, {
      email,
      password,
      phone: "+9232423",
      username: email.split("@")[0],
      stripe_id: null,
      image: "",
    });
  } catch (e) {
    console.log(e);
    return e;
  }
};

const SignInWithEmailAndPassword = async (email, password) => {
  try {
    console.log("email", email);
    console.log("password", password);
    const loginUrl = `/auth/login`;
    return await api.post(
      loginUrl,
      {
        email: email.toLowerCase(),
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return e;
  }
};

export {
  SignInWithEmailAndPassword,
  SignUpWithEmailAndPassword,
  getProducts,
  getCategories,
  getProductsByCategory,
  GetSignedUserDetails,
  GetFavProducts,
  GetUserCart,
  AddProductToCart,
  GetProductDetails,
  CreateUser,
  UpdateUserInfo,
  AddUserAddress,
  DeleteProductFromCart,
  CheckOutCart,
  AddOrder,
  GetStoreId,
  GetOrders,
  GetSetupIntent,
  DeleteUserCard,
  SetToken,
  AddProdToFav,
  RemoveAddress,
  RemoveProdToFav,
  VerifyPromoCode,
  GetFeaturedProducts,
  GetUserAddresses,
  VerifyUserAccount,
  FetchUserAddresses,
  GetActiveDeals,
  AddDealToCart,
  DeleteDealFromCart
};
