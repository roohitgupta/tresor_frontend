'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import CartPage from '../../components/Cart';
import withAuth from '@/withAuth';

const Cart = () => {
  return (
    <div>
      <Navbar />
      <CartPage />
    </div>
  );
};

export default withAuth(Cart);