import React, { useEffect, useState } from "react";
import axios from "axios";

function Membership() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/purchases/user/${currentUser._id}`
        );
        setPurchases(res.data);
      } catch (error) {
        console.error("❌ Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [currentUser]);

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-white">My Membership Purchases</h2>
      {purchases.length === 0 ? (
        <p className="text-white">No purchases found.</p>
      ) : (
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase.plan}</td>
                <td>{purchase.price}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Membership;
