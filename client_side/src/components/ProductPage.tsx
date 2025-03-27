'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Input, Pagination, Spin, Button } from 'antd';
import './Style.css';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/cartSlice';

const { Search } = Input;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();


  useEffect(() => {
    fetchProducts();
  }, [current, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      const filteredData = data.filter((product: any) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error);
    }
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
    setCurrent(1);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addProduct(product));
    console.log('Added to cart:', product);
  };

  return (
    <div className="product-list">
      <Search
        placeholder="Search for products"
        onSearch={onSearch}
        className="search-bar"
      />
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Row gutter={[16, 16]}>
          {products
            .slice((current - 1) * pageSize, current * pageSize)
            .map((product: any) => (
                <Col key={product.id} span={6}>
                <Card
                  hoverable
                  className="product-card"
                  cover={<img alt={product.title} src={product.image} className="product-image" />}
                >
                  <Card.Meta
                    title={product.title}
                    description={`$${product.price}`}
                  />
                  <p className="product-description">{product.description}</p>
                  <Button type="primary" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </Card>
              </Col>
            ))}
        </Row>
      )}
      <Pagination
        current={current}
        total={products.length}
        pageSize={pageSize}
        onChange={(page) => setCurrent(page)}
        className="pagination"
      />
    </div>
  );
}