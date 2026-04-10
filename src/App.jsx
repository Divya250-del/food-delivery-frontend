import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import CreateRestaurant from "./pages/CreateRestaurant";
import AddDishes from "./pages/AddDishes";
import MyRestaurant from "./pages/MyRestaurant";
import RestaurantsByDish from "./pages/RestaurantsByDish";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/add-dishes" element={<AddDishes />} />
        <Route path="/my-restaurant" element={<MyRestaurant />} />
        <Route path="/restaurants" element={<RestaurantsByDish />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;