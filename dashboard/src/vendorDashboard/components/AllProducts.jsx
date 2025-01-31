import React, { useState, useEffect } from "react";
import { API_URL } from "../data/apiPath";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const productsHandler = async () => {
    const firmId = localStorage.getItem("firmId");
    try {
      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      const newProductsData = await response.json(); // combining the response data to variable
      setProducts(newProductsData.products || []); // for ensuring it was an array
      console.log(newProductsData);
    } catch (error) {
      console.error("failed to fetch products", error);
      alert("failed to fetch the products");
    }
  };

  useEffect(() => {
    productsHandler();
    console.log("This is useEffect");
  }, []);

  const deleteProductById = async (productId) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // ✅ Remove the deleted product from the list immediately
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      alert("Product Deleted Successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product");
    }
  };

  return (
    <div>
      {!products ? (
        <p>No products added</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              return (
                <tr key={item._id}>
                  <td>{item.productName}</td>
                  <td>{item.price}</td>
                  <td>
                    {item.image && (
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.productName}
                        style={{ paddingLeft: 80 }}
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => deleteProductById(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllProducts;
