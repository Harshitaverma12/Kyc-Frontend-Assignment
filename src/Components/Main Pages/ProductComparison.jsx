import React, { useState, useEffect } from "react";
import { Table, Modal, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const CompareProducts = () => {
  const [comparedProducts, setComparedProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = JSON.parse(
      localStorage.getItem("comparedProducts") || "[]"
    );
    setComparedProducts(storedProducts);

    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      });
  }, []);

  const columns = [
    {
      title: "Attribute",
      dataIndex: "attribute",
      key: "attribute",
    },
    ...comparedProducts.map((product, index) => ({
      title: `Product ${index + 1}`,
      dataIndex: `product${index}`,
      key: `product${index}`,
      render: (text) => {
        if (typeof text === "object" && text !== null) {
          return (
            <img src={text.thumbnail} alt="product" style={{ width: "50px" }} />
          );
        }
        return text;
      },
    })),
  ];

  const dataSource = [
    {
      attribute: "Title",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: product.title,
        }),
        {}
      ),
    },
    {
      attribute: "Description",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: product.description,
        }),
        {}
      ),
    },
    {
      attribute: "Price",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: `$${product.price}`,
        }),
        {}
      ),
    },
    {
      attribute: "Discount Percentage",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: `${product.discountPercentage}%`,
        }),
        {}
      ),
    },
    {
      attribute: "Brand",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: product.brand,
        }),
        {}
      ),
    },
    {
      attribute: "Category",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: product.category,
        }),
        {}
      ),
    },
    {
      attribute: "Image",
      ...comparedProducts.reduce(
        (acc, product, index) => ({
          ...acc,
          [`product${index}`]: { thumbnail: product.thumbnail },
        }),
        {}
      ),
    },
  ];

  const removeProduct = (productIndex) => {
    const updatedProducts = comparedProducts.filter(
      (_, index) => index !== productIndex
    );
    setComparedProducts(updatedProducts);
    localStorage.setItem("comparedProducts", JSON.stringify(updatedProducts));
    if (updatedProducts.length === 0) {
      navigate("/product-comparison");
    }
  };

  const addProduct = (product) => {
    if (
      comparedProducts.length < 4 &&
      !comparedProducts.some((p) => p.id === product.id)
    ) {
      const updatedProducts = [...comparedProducts, product];
      setComparedProducts(updatedProducts);
      localStorage.setItem("comparedProducts", JSON.stringify(updatedProducts));
    }
    setModalVisible(false);
  };

  return (
    <div>
      {comparedProducts.length === 0 ? (
        <Empty description="No products for comparison" />
      ) : (
        <>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="attribute"
          />
          {comparedProducts.map((product, index) => (
            <Button
              style={{
                marginTop: "1rem",
                marginRight: "1rem",
                marginLeft: "1rem",
              }}
              variant="contained"
              key={product.id}
              onClick={() => removeProduct(index)}
            >
              Remove {product.title}
            </Button>
          ))}
        </>
      )}
      <Button
        style={{ marginTop: "1rem" }}
        variant="contained"
        onClick={() => setModalVisible(true)}
        disabled={comparedProducts.length >= 4}
      >
        Add More
      </Button>
      <Modal
        title="Add Product to Compare"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={allProducts.filter(
            (p) => !comparedProducts.some((cp) => cp.id === p.id)
          )}
          columns={[
            { title: "Title", dataIndex: "title", key: "title" },
            { title: "Brand", dataIndex: "brand", key: "brand" },
            { title: "Price", dataIndex: "price", key: "price" },
            {
              title: "Action",
              key: "action",
              render: (text, record) => (
                <Button onClick={() => addProduct(record)}>Add</Button>
              ),
            },
          ]}
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default CompareProducts;
