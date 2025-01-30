import OrderManagement from "./orders/orderManagement";
import AddNewOrder from "./orders/addNewOrder";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderManagement />} />
        <Route path="/add-order" element={<AddNewOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
