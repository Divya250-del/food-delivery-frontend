import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-container">
      <div className="card">
        <h1>Welcome 🚀</h1>
        <p>Create your account or login</p>

        <Link to="/signup">
          <button className="btn btn-primary">Sign Up</button>
        </Link>

        <Link to="/signin">
          <button className="btn btn-secondary">Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default Home; 