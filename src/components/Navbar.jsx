import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/authApi";

const Navbar = ({ restaurant, cartCount = 0 }) => {
  const { user, loading, setUser } = useAuth();

  if (loading) return null;

  const isLoggedIn = !!user;
  const isOwner = user?.roles?.includes("RESTAURANT_OWNER");
  const isCustomer = user?.roles?.includes("CUSTOMER");

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed →", err);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍔</span>
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-orange-500">Food</span>ie
          </h1>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {!isLoggedIn ? (
            <>
              <Link to="/signin">
                <button className="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition">
                  Sign In
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* CUSTOMER */}
              {isCustomer && (
                <Link to="/cart">
                  <button className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                    🛒
                    <span className="text-sm">Cart</span>

                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] px-1 flex items-center justify-center bg-orange-500 text-white text-[10px] rounded-full font-medium shadow">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </button>
                </Link>
              )}

              <Link to="/my-orders">
                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                  My Orders
                </button>
              </Link>

              {/* OWNER */}
              {isOwner && (
                <>
                  {restaurant ? (
                    <Link to="/my-restaurant">
                      <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                        My Restaurant
                      </button>
                    </Link>
                  ) : (
                    <Link to="/create-restaurant">
                      <button className="px-5 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm">
                        + Create
                      </button>
                    </Link>
                  )}
                </>
              )}

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-red-50 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;