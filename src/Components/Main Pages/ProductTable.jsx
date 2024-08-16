import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./../../Styles/ProductStyle.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [comparedProducts, setComparedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error("Unexpected data structure");
        }
      })
      .catch((error) => {
        message.error("Failed to load products. Please try again later.");
      })
      .finally(() => setLoading(false));
    // Load compared products from localStorage
    const storedComparedProducts = JSON.parse(
      localStorage.getItem("comparedProducts") || "[]"
    );
    setComparedProducts(storedComparedProducts);
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text) => (
        <img src={text} alt="product" style={{ width: "50px" }} />
      ),
      className: "custom-header", // Apply custom header class
    },
    {
      title: "Compare",
      key: "compare",
      render: (text, record) => (
        <Button
          onClick={() => handleCompare(record)}
          disabled={comparedProducts.some((p) => p.id === record.id)}
        >
          Compare
        </Button>
      ),
      className: "custom-header", // Apply custom header class
    },
  ];

  const handleCompare = (product) => {
    const updatedComparedProducts = [...comparedProducts, product];
    setComparedProducts(updatedComparedProducts);
    localStorage.setItem(
      "comparedProducts",
      JSON.stringify(updatedComparedProducts)
    );
    navigate("/product-comparison");
  };

  return (
    <Table
      dataSource={products}
      columns={columns}
      pagination={{ pageSize: 10 }}
      rowKey="id"
      loading={loading}
    />
  );
};

export default ProductTable;
