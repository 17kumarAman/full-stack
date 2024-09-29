import { createWebHistory, createRouter } from 'vue-router';
import Cart from './page/Cart.vue'
import Products from './components/products.vue';
import Product from './page/product.vue'; 
import Register from './page/register.vue';
import Login from './page/login.vue'; // Import the Login component
import Test from './page/test.vue';

const routes = [
  { name: 'Test', path: '/', component: Test },
  { name: 'Cart', path: '/cart', component: Cart },

  { name: 'Products', path: '/products', component: Products },

  { name: 'Product', path: '/product/:id', component: Product },
  { name: 'Register', path: '/register', component: Register },
  { name: 'Login', path: '/login', component: Login }, // Add the login route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
