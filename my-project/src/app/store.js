import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import authReducer from '../store/authSlice'
import cartReducer from '../store/cartSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart:cartReducer

  }
})