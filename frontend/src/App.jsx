import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop"; // ✅ ADD THIS

function App() {
  return (
    <Router>
      <ScrollToTop />   {/* ✅ YAHIN lagana hai (MOST IMPORTANT) */}
      
      <UserProvider>
        <CartProvider>
          <Navbar />
          <AppRoutes />
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
