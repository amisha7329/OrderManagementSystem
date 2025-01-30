import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, editOrder } from "./orderSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OrderTable() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.filteredOrders || [])
    .slice()
    .sort((a, b) => a.id - b.id);

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDescription, setOrderDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOrderDescription(order.orderDescription);
    setSelectedProducts(new Set(order.Products.map((product) => product.id)));
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleProductCheckbox = (productId) => {
    setSelectedProducts((prevProducts) => {
      const newProducts = new Set(prevProducts);

      if (newProducts.has(productId)) {
        if (newProducts.size === 1) {
          alert(
            "You cannot remove the last product. Please delete the order instead."
          );
          return prevProducts;
        }
        newProducts.delete(productId);
      } else {
        newProducts.add(productId);
      }
      return newProducts;
    });
  };

  const handleEditSubmit = async () => {
    if (!selectedOrder) return;

    const updatedOrder = {
      orderDescription,
      productIds: Array.from(selectedProducts),
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/orders/${selectedOrder.id}`,
        updatedOrder
      );

      if (response.status === 200) {
        dispatch(
          editOrder({
            id: selectedOrder.id,
            updatedOrder: {
              orderDescription,
              productIds: Array.from(selectedProducts),
            },
          })
        );
        handleCloseModal();
        alert("Order updated successfully!");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${orderId}`);
      dispatch(deleteOrder(orderId));
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error while deleting order", err);
      alert("Failed to delete the Order");
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
        }}
      >
        {orders.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ p: 3, color: "#4A3F35", fontStyle: "italic" }}
          >
            No orders available.
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#D6D4CE" }}>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#4A3F35" }}
                  align="center"
                >
                  Order ID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#4A3F35" }}
                  align="center"
                >
                  Order Description
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#4A3F35" }}
                  align="center"
                >
                  No. of Products
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#4A3F35" }}
                  align="center"
                >
                  Created At
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "#4A3F35" }}
                  align="center"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const totalQuantity = order.Products.reduce(
                  (sum, product) => sum + (product.quantity || 0),
                  0
                );
                return (
                  <TableRow
                    key={order.id}
                    sx={{ "&:hover": { backgroundColor: "#F9F9F9" } }}
                  >
                    <TableCell align="center">{order.id}</TableCell>
                    <TableCell align="center">
                      {order.orderDescription}
                    </TableCell>
                    <TableCell align="center">{totalQuantity}</TableCell>
                    <TableCell align="center">
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleOpenModal(order)}>
                        <EditIcon sx={{ color: "#4A3F35" }} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteOrder(order.id)}>
                        <DeleteIcon sx={{ color: "#E53935" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Edit Order Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "500px" }, 
            maxWidth: "95vw", 
            bgcolor: "#FFFFFF",
            boxShadow: 24,
            p: { xs: 2, sm: 4 }, 
            borderRadius: 3,
            border: "1px solid #4A6A55",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: "#4A6A55",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Edit Order
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Order Description"
            fullWidth
            variant="outlined"
            value={orderDescription}
            onChange={(e) => setOrderDescription(e.target.value)}
            sx={{ mb: 3, backgroundColor: "#F9F9F9", borderRadius: 1 }}
          />

          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "#4A3F35", fontWeight: "bold" }}
          >
            Select Products to be removed
          </Typography>

          <List
            sx={{
              maxHeight: 200,
              overflow: "auto",
              mb: 3,
              border: "1px solid #F1F1F1",
              borderRadius: 1,
            }}
          >
            {selectedOrder?.Products.map((product) => (
              <ListItem key={product.id} sx={{ paddingLeft: 0 }}>
                <Checkbox
                  checked={!selectedProducts.has(product.id)}
                  onChange={() => handleProductCheckbox(product.id)}
                  disabled={
                    selectedProducts.size === 1 &&
                    selectedProducts.has(product.id)
                  }
                  sx={{ color: "#5A846A" }}
                  color="error"
                />
                <ListItemText
                  primary={product.productName}
                  secondary={product.productDescription}
                  slots={{
                    primary: Typography,
                    secondary: Typography,
                  }}
                  slotProps={{
                    primary: {
                      sx: {
                        color: "#4A3F35",
                        fontWeight: "bold",
                      },
                    },
                    secondary: {
                      sx: {
                        color: "#6D6D6D",
                        fontWeight: "normal",
                      },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>

          {selectedProducts.size === 1 && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              You cannot remove the last product. Please delete the order
              instead.
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#E53935",
                color: "#E53935",
                "&:hover": {
                  backgroundColor: "#FFE9E9",
                  borderColor: "#E53935",
                },
              }}
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#5A846A",
                "&:hover": { backgroundColor: "#4A6A55" },
              }}
              onClick={handleEditSubmit}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
