import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    filteredOrders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.filteredOrders = action.payload; // initially filteredOrders same as orders
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
      state.filteredOrders = state.filteredOrders.filter(
        (order) => order.id !== action.payload
      );
    },
    editOrder: (state, action) => {
      const { id, updatedOrder } = action.payload;

      state.orders = state.orders.map((order) =>
        order.id === id
          ? {
              ...order,
              ...updatedOrder,
              Products: order.Products.filter((product) =>
                updatedOrder.productIds.includes(product.id)
              ),
            }
          : order
      );

      state.filteredOrders = state.filteredOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              ...updatedOrder,
              Products: order.Products.filter((product) =>
                updatedOrder.productIds.includes(product.id)
              ),
            }
          : order
      );
    },

    setFilteredOrders: (state, action) => {
      state.filteredOrders = action.payload;
    },
  },
});

export const { setOrders, deleteOrder, editOrder, setFilteredOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
