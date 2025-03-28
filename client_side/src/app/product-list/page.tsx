'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import dynamic from 'next/dynamic';
import withAuth from '@/withAuth';

const ProductPage = dynamic(() => import('../../components/ProductPage'), {
  ssr: false
});

const ProductListPage = () => {
  return (
    <div>
      <Navbar />
      <ProductPage />
    </div>
  );
};

export default withAuth(ProductListPage);