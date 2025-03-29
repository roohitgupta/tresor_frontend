import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  _id: string;
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

interface CartState {
  products: Product[];
}

const initialState: CartState = {
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.products.find(p => p._id === action.payload._id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(product => product._id !== action.payload);
    },
    changeQuantity: (state, action: PayloadAction<{ _id: string; quantity: number }>) => {
      const product = state.products.find(p => p._id === action.payload._id);
      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
    initializeCart: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { addProduct, removeProduct, changeQuantity, initializeCart } = cartSlice.actions;
export default cartSlice.reducer;