import React from "react";
import "../Dashboard.css"; // we'll style it separately

function Dashboard() {
  return (
    <div className="DashboardPage">
      {/* Top Navbar */}
      <header className="Navbar">
        <div className="Logo">Autronicas</div>
        <div className="NavActions">
          <button className="AdminBtn">👤 Administrator</button>
          <button className="ProfileBtn">⚙️</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="Tabs">
        <button className="Tab active">📊 Dashboard</button>
        <button className="Tab">📦 Inventory</button>
        <button className="Tab">🛠 Job Orders</button>
        <button className="Tab">💰 Sales</button>
      </nav>

      {/* Summary Cards */}
      <section className="Cards">
        <div className="Card">
          <h3>Total Products</h3>
          <p className="Number">000</p>
          <span>Across 8 product categories</span>
        </div>
        <div className="Card">
          <h3>Total Sales</h3>
          <p className="Number">₱000,000.00</p>
          <span>Current inventory value</span>
        </div>
        <div className="Card">
          <h3>Total Jobs</h3>
          <p className="Number">0</p>
          <span>Job Order No.</span>
        </div>
        <div className="Card">
          <h3>Stock Status</h3>
          <p className="Number">0</p>
          <span>All items in stock</span>
        </div>
      </section>

      {/* Product Category Breakdown */}
      <section className="Breakdown">
        <h3>Product Category Breakdown</h3>
        <p>Inventory distribution across categories</p>
        <ul className="CategoryList">
          {[
            "Oil Filter",
            "Fuel Filter",
            "Engine Oil",
            "Wiper Blade",
            "Electrical",
            "Coolant",
            "Cabin Filter",
            "Air Filter",
          ].map((item, i) => (
            <li key={i} className="CategoryItem">
              <div>
                <strong>{item}</strong>
                <p>Current: 0 | Minimum: 0</p>
              </div>
              <span className="Value">₱00,000.00</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
