'use client';

import React from 'react';
import Link from 'next/link';
import { Layout, Badge } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from 'react-icons/fa'
import './Style.css';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

const Navbar = () => {
  const products = useSelector((state: RootState) => state.cart.products);
  const totalItems = products.reduce((total, product) => total + product.quantity, 0);
  const router = useRouter();


  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };


  return (
    <Header className="navbar">
      <div className="logo">LOGO</div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/product-list">Products</Link>
        <Link href="/options">Options</Link>
      </div>
      <div className="nav-icons">
        <Link href="/cart">
          <div className="icon-wrapper">
            <Badge count={totalItems} offset={[10, 0]} size="small">
              <FaShoppingCart size={24} />
            </Badge>
          </div>
        </Link>
        <div className="icon-wrapper" onClick={handleLogout}>
          <FaSignOutAlt size={24} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </Header>
  );
};

export default Navbar;