'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeProduct, changeQuantity, initializeCart } from '../redux/cartSlice';
import { Card, Row, Col, Button, Typography } from 'antd';
import './Style.css';

const { Title, Text } = Typography;

export default function CartPage() {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      dispatch(initializeCart(JSON.parse(storedProducts)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(products));
  }, [products]);

  const handleRemove = (id: number) => {
    dispatch(removeProduct(id));
  };

  const handleChangeQuantity = (id: number, increment: boolean) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const newQuantity = increment ? product.quantity + 1 : Math.max(1, product.quantity - 1);
      dispatch(changeQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className="cart-page">
      <Title level={2}>Your Cart</Title>
      {products.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        products.map((product) => (
          <Card key={product.id} className="cart-item">
            <Row align="middle">
              <Col span={4}>
                <img src={product.image} alt={product.title} className="cart-image" />
              </Col>
              <Col span={14}>
                <Title level={4}>{product.title}</Title>
                <Text>{product.description}</Text>
              </Col>
              <Col span={6} className="cart-actions">
                <div className="quantity-controls">
                  <Button onClick={() => handleChangeQuantity(product.id, false)}>-</Button>
                  <Text className="quantity">{product.quantity}</Text>
                  <Button onClick={() => handleChangeQuantity(product.id, true)}>+</Button>
                </div>
                <Text strong>Price: ${(product.price * product.quantity).toFixed(2)}</Text>
                <Button type="primary" danger onClick={() => handleRemove(product.id)}>
                  Remove
                </Button>
              </Col>
            </Row>
          </Card>
        ))
      )}
    </div>
  );
}