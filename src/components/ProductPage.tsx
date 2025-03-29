'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row, Input, Pagination, Spin, Button, Typography, Modal, Form, message } from 'antd';
import './Style.css';
import { addProduct, initializeCart } from '../redux/cartSlice';
import { RootState } from '../redux/store';

const { Search } = Input;
const { Text } = Typography;

interface Product {
  _id: string;
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  const defaultImage = "https://t4.ftcdn.net/jpg/02/81/42/77/360_F_281427785_gfahY8bX4VYCGo6jlfO8St38wS9cJQop.jpg";

  useEffect(() => {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      dispatch(initializeCart(JSON.parse(storedProducts)));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts));
  }, [cartProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8800/api/products');
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

  const isProductInCart = (_id: string) => {
    return cartProducts.some(p => p._id === _id);
  };

  const showCreateModal = () => {
    setIsModalVisible(true);
    setCurrentProduct(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentProduct(null);
  };

  const handleCreateOrUpdateProduct = async (values: any) => {
    try {
      if (currentProduct) {
        await axios.put(`http://localhost:8800/api/products/${currentProduct._id}`, values);
        message.success('Product updated successfully');
      } else {
        await axios.post('http://localhost:8800/api/products', values);
        message.success('Product created successfully');
      }
      fetchProducts();
      handleCancel();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:8800/api/products/${_id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  return (
    <div className="product-list">
      <Row>
        <Col span={6}>
          <Search
            placeholder="Search for products"
            onSearch={onSearch}
            className="search-bar"
          />
        </Col>
        <Col span={12}></Col>
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
              <Col key={product._id} span={6}>
                <Card
                  hoverable
                  className="product-card"
                  cover={<img alt={product.title} src={defaultImage} className="product-image" />}
                  actions={[
                    <Button onClick={() => handleEditProduct(product)}>Edit</Button>,
                    <Button danger onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  ]}
                >
                  <Card.Meta title={product.title} />
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <Text strong>${product.price}</Text>
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={isProductInCart(product._id)}
                    >
                      {isProductInCart(product._id) ? 'Added' : 'Add to Cart'}
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
        onChange={(page: number) => setCurrent(page)}
        className="pagination"
      />
      <Modal
        title={currentProduct ? 'Edit Product' : 'Create Product'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={handleCreateOrUpdateProduct}
          initialValues={currentProduct || { title: '', price: '', description: '' }}
        >
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
            {currentProduct ? 'Update' : 'Create'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}