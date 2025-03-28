'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row, Input, Pagination, Spin, Button, Typography, Modal, Form, message } from 'antd';
import './Style.css';
import { addProduct, initializeCart } from '../redux/cartSlice';
import { RootState } from '../redux/store';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

const { Search } = Input;
const { Text } = Typography;

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      dispatch(initializeCart(JSON.parse(storedProducts)));
    }
  }, []);

  useEffect(()=> {
    fetchProducts()
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts));
  }, [cartProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://fakestoreapi.com/products');
      const customData = await axios.get('http://localhost:8800/api/products');
      const combinedData = [...data, ...customData.data];

      const filteredData = combinedData.filter((product: any) =>
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

  const isProductInCart = (id: number) => {
    return cartProducts.some((p: Product) => p.id === id);
  };

  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateProduct = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/products', values);
      message.success('Product created successfully');
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to create product');
    }
  };

  return (
    <div className="product-list">
      <Row>
        <Col span={18}>
          <Search
            placeholder="Search for products"
            onSearch={onSearch}
            className="search-bar"
          />
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={showCreateModal}>
            Create Product
          </Button>
        </Col>
      </Row>
      <Spin tip="Loading..." spinning={loading}>
        <Row gutter={[16, 16]}>
          {products
            .slice((current - 1) * pageSize, current * pageSize)
            .map((product: any) => (
              <Col key={product.id} span={6}>
                <Card
                  hoverable
                  className="product-card"
                  cover={<img alt={product.title} src={product.image} className="product-image" />}
                  actions={[
                    <Button onClick={() => console.log('Edit', product.id)}>Edit</Button>,
                    <Button danger onClick={() => console.log('Delete', product.id)}>Delete</Button>
                  ]}
                >
                  <Card.Meta title={product.title} />
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <Text strong>${product.price}</Text>
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={isProductInCart(product.id)}
                    >
                      {isProductInCart(product.id) ? 'Added' : 'Add to Cart'}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Spin>
      <Pagination
        current={current}
        total={products.length}
        pageSize={pageSize}
        onChange={(page) => setCurrent(page)}
        className="pagination"
      />
      <Modal
        title="Create Product"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleCreateProduct}>
          <Form.Item name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input placeholder="Price" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Description" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
}