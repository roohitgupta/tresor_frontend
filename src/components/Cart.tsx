'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { removeProduct, changeQuantity, initializeCart } from '../redux/cartSlice';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Button from 'antd/es/button';
import Typography from 'antd/es/typography';
import './Style.css';

const { Title, Text } = Typography;

export default function CartPage() {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  const defaultImage = "https://t4.ftcdn.net/jpg/02/81/42/77/360_F_281427785_gfahY8bX4VYCGo6jlfO8St38wS9cJQop.jpg";


  useEffect(() => {
    const storedProducts = localStorage.getItem('cart');
    if (storedProducts) {
      dispatch(initializeCart(JSON.parse(storedProducts)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(products));
  }, [products]);

  const handleRemove = (_id: string) => {
    dispatch(removeProduct(_id));
  };

  const handleChangeQuantity = (_id: string, increment: boolean) => {
    const product = products.find(p => p._id === _id);
    if (product) {
      const newQuantity = increment ? product.quantity + 1 : Math.max(1, product.quantity - 1);
      dispatch(changeQuantity({ _id, quantity: newQuantity }));
    }
  };

  return (
    <div className="cart-page">
      <Title level={2}>Your Cart</Title>
      {products.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        products.map((product) => (
          <Card key={product._id} className="cart-item">
            <Row align="middle">
              <Col span={4}>
                <img src={defaultImage} alt={product.title} className="cart-image" />
              </Col>
              <Col span={14}>
                <Title level={4}>{product.title}</Title>
                <Text>{product.description}</Text>
              </Col>
              <Col span={6} className="cart-actions">
                <div className="quantity-controls">
                  <Button onClick={() => handleChangeQuantity(product._id, false)}>-</Button>
                  <Text className="quantity">{product.quantity}</Text>
                  <Button onClick={() => handleChangeQuantity(product._id, true)}>+</Button>
                </div>
                <Text strong>Price: ${(product.price * product.quantity).toFixed(2)}</Text>
                <Button type="primary" danger onClick={() => handleRemove(product._id)}>
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