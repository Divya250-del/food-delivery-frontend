import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, role, restaurant, cartCount = 0 }) => {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
      <Link to="/">
        <h1 className="text-2xl font-medium">
          <span className="text-orange-500">Food</span>ie
        </h1>
      </Link>

      <div className="flex gap-3 items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/signin">
              <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                Sign In
              </button>
            </Link>

            <Link to="/signup">
              <button className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/cart">
              <button className="relative px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 flex items-center justify-center bg-orange-500 text-white text-[11px] rounded-full font-medium">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>
            </Link>
            <Link to="/my-orders">
            <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
              My Orders
            </button>
          </Link>

            {restaurant ? (
              <Link to="/my-restaurant">
                <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition">
                  My Restaurant
                </button>
              </Link>
            ) : (
              <Link to="/create-restaurant">
                <button className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                  + Create Restaurant
                </button>
              </Link>
            )}

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;