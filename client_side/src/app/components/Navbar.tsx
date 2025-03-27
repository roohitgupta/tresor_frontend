'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from 'antd';
import './Style.css';

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header className="navbar">
      <div className="logo">LOGO</div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/product-list">Products</Link>
        <Link href="/options">Options</Link>
      </div>
      <div className="nav-icons">
        <span className="icon">🛒</span>
        <span className="icon">🔓</span>
      </div>
    </Header>
  );
};

export default Navbar;