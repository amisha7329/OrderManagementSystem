import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  IconButton,
  Container,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BlinkWorxIMG from "../img/blinkworx-img.png"
import ScaleLoader from "react-spinners/ScaleLoader";

const AddNewOrder = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [cart, setCart] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error while fetching products", err);
    } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    setCart(new Set());
    fetchProducts();
  }, []);

  const handleCheckbox = (productId) => {
    setCart((prevCart) => {
      const newCart = new Set(prevCart);
      if (newCart.has(productId)) {
        newCart.delete(productId);
      } else {
        newCart.add(productId);
      }
      return newCart;
    });
  };

  const handleSubmit = async () => {
    if (orderDescription === "") {
      alert("Please enter Order Description");
      return;
    }

    if (cart.size === 0) {
      alert("Please select at least one product to book order");
      return;
    }

    const newOrder = {
      orderDescription,
      productIds: Array.from(cart),
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, newOrder);
      alert("Order Successfully added");
      navigate("/");
      setOrderDescription("");
      setCart(new Set());
    } catch (err) {
      console.log("Error while booking order", err);
      alert("Failed to book order");
    }
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
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2, 
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
    Book Your Order
  </Typography>
</Box>
          <IconButton>
            <Badge badgeContent={cart.size} color="success" showZero>
              <ShoppingCartIcon sx={{ fontSize: 40, color: "#5A846A" }} />
            </Badge>
          </IconButton>
        </Box>

        <TextField
          label="Order Description"
          fullWidth
          variant="outlined"
          value={orderDescription}
          onChange={(event) => setOrderDescription(event.target.value)}
          sx={{ mb: 3, backgroundColor: "#F9F9F9", borderRadius: 1 }}
          slotProps={{
            inputLabel: {
              sx: { color: "#4A3F35" },
            },
          }}
        />

        <Paper
          elevation={3}
          sx={{
            maxHeight: 400,
            overflow: "auto",
            p: 2,
            borderRadius: 2,
            backgroundColor: "#D6D4CE",
            minHeight: "200px", 
            display: loading ? "flex" : "block", 
            justifyContent: loading ? "center" : "flex-start", 
            alignItems: loading ? "center" : "stretch", 
          }}
        >
             {loading ? (
            <ScaleLoader color="#5A846A" height={40} width={6} radius={2} margin={4} />
          ) : (
          <List>
            {products.map((product, index) => (
              <Box key={product.id}>
                <ListItem>
                  <Checkbox
                    color="success"
                    checked={cart.has(product.id)}
                    onChange={() => handleCheckbox(product.id)}
                    sx={{ color: "#5A846A" }}
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
                        sx: { color: "#4A3F35" },
                      },
                      secondary: {
                        sx: { color: "#6D6D6D" },
                      },
                    }}
                  />
                </ListItem>
                {index !== products.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
          )}
        </Paper>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
        >
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderColor: "#E53935",
              color: "#E53935",
              "&:hover": {
                backgroundColor: "#FFE9E9",
                borderColor: "#E53935",
              },
            }}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#5A846A",
              "&:hover": {
                backgroundColor: "#4A6A55",
              },
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            Book Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddNewOrder;
