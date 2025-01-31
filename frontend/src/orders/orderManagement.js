import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrders, setFilteredOrders } from "./orderSlice";
import OrderTable from "./orderTable";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import BlinkWorxIMG from "../img/blinkworx-img.png";
import ScaleLoader from "react-spinners/ScaleLoader";

const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/`
      );
      dispatch(setOrders(response.data));
    } catch (err) {
      console.error("Error while fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [dispatch]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      dispatch(setFilteredOrders(orders));
    } else {
      const filtered = orders.filter(
        (order) =>
          order.id.toString().includes(value) ||
          order.orderDescription.toLowerCase().includes(value.toLowerCase())
      );
      dispatch(setFilteredOrders(filtered));
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    dispatch(setFilteredOrders(orders));
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 5, minHeight: "100vh", backgroundColor: "#D6D4CE" }}
    >
      <Paper
        elevation={6}
        sx={{ p: 4, borderRadius: 3, backgroundColor: "#FFFFFF" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 3, 
            flexWrap: "wrap", 
          }}
        >
          
          <img
            src={BlinkWorxIMG}
            alt="BlinkWorx Logo"
            style={{
              height: "30px", 
              width: "auto",
              maxWidth: "100%", 
            }}
          />

          
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#4A3F35"
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem", md: "1.8rem" }, 
              whiteSpace: "nowrap", 
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Order Management
          </Typography>
        </Box>

        {/* Search Filter */}
        <TextField
          label="Search Order by ID or Description"
          variant="outlined"
          placeholder="ex: order for customer xyz"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          slotProps={{
            inputAdornment: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#4A3F35" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchTerm && (
                    <IconButton onClick={clearSearch}>
                      <ClearIcon sx={{ color: "#4A3F35" }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
          sx={{
            backgroundColor: "#F9F9F7",
            borderRadius: 3,
            mb: 4,
          }}
        />

        {/* Orders Component */}
        {/* <Paper
          elevation={4}
          sx={{ p: 3, borderRadius: 3, backgroundColor: "#FFFFFF", mb: 4 }}
        > */}
        <Box
          sx={{
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px", 
            width: "100%", 
          }}
        >
          {loading ? (
            <ScaleLoader
              color="#5A846A"
              height={40}
              width={6}
              radius={2}
              margin={4}
            />
          ) : (
            <OrderTable />
          )}
        </Box>
        {/* </Paper> */}

        {/* Book New Order Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#5A846A",
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderRadius: 3,
              padding: "12px 24px",
              "&:hover": { backgroundColor: "#4A6A55" },
            }}
            onClick={() => navigate("/add-order")}
          >
            Book New Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderManagement;
