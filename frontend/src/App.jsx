import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// Context for authentication and cart
import { createContext } from 'react'
export const AuthContext = createContext(null)
export const CartContext = createContext(null)

// Components
const Navbar = ({ isLoggedIn, logout, cartItemCount }) => {
  return (
    <nav className="navbar" data-qa="navbar">
      <div className="navbar-brand" data-qa="navbar-brand">
        <Link to="/" data-qa="brand-link">CJ Store</Link>
      </div>
      <div className="navbar-nav" data-qa="navbar-nav">
        {isLoggedIn ? (
          <>
            <Link to="/" data-qa="products-link">Products</Link>
            <Link to="/cart" data-qa="cart-link">
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {cartItemCount > 0 && <span className="cart-badge" data-qa="cart-badge">{cartItemCount}</span>}
            </Link>
            <button onClick={logout} className="logout-btn" data-qa="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" data-qa="login-link">Login</Link>
            <Link to="/register" data-qa="register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

// Home/Products Page
const ProductsPage = ({ addToCart, isLoggedIn }) => {
  const [products, setProducts] = useState([])
  const [sortedProducts, setSortedProducts] = useState([])
  const [sortOption, setSortOption] = useState('name-asc')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        setProducts(response.data)
        setSortedProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Sort products when sortOption changes or products are updated
  useEffect(() => {
    if (products.length === 0) return;

    const sortProducts = () => {
      const productsCopy = [...products];

      switch (sortOption) {
        case 'name-asc':
          productsCopy.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          productsCopy.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          productsCopy.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          productsCopy.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }

      setSortedProducts(productsCopy);
    };

    sortProducts();
  }, [sortOption, products]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
  }

  if (loading) return <div className="loading-spinner">Loading products...</div>

  return (
    <div className="container" data-qa="products-page">
      <div className="inventory-header" data-qa="inventory-header">
        <h1>Products</h1>
        <div className="sort-container" data-qa="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            className="sort-select" 
            data-qa="product-sort"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
            <option value="price-asc">Price (low to high)</option>
            <option value="price-desc">Price (high to low)</option>
          </select>
        </div>
      </div>
      <div className="product-grid" data-qa="product-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card" data-qa={`product-card-${product.id}`}>
            <div className="product-image-container" onClick={() => handleProductClick(product.id)} data-qa="product-image-container">
              <img src={product.imageUrl} alt={product.name} data-qa="product-image" />
            </div>
            <div className="product-info" data-qa="product-info">
              <h3 onClick={() => handleProductClick(product.id)} data-qa="product-name">{product.name}</h3>
              <p className="product-desc" data-qa="product-description">{product.description.substring(0, 80)}...</p>
              <p className="price" data-qa="product-price">${product.price.toFixed(2)}</p>
              {isLoggedIn && (
                <button onClick={() => addToCart(product.id)} className="btn-primary" data-qa="add-to-cart-button">
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Product Detail Page
const ProductDetailPage = ({ addToCart, isLoggedIn }) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const productId = window.location.pathname.split('/').pop()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`)
        setProduct(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) return <div className="loading-spinner">Loading product details...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="container" data-qa="product-detail-page">
      <div className="back-button" data-qa="back-button">
        <button onClick={() => navigate(-1)} className="text-button" data-qa="back-to-products">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#3d3d3d">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to products
        </button>
      </div>
      <div className="product-detail" data-qa="product-detail">
        <div className="product-detail-image" data-qa="product-detail-image">
          <img src={product.imageUrl} alt={product.name} data-qa="product-detail-img" />
        </div>
        <div className="product-detail-info" data-qa="product-detail-info">
          <h1 data-qa="product-detail-name">{product.name}</h1>
          <p className="product-detail-desc" data-qa="product-detail-description">{product.description}</p>
          <p className="product-detail-price" data-qa="product-detail-price">${product.price.toFixed(2)}</p>
          <button onClick={() => addToCart(product.id)} className="btn-primary add-to-cart-btn" data-qa="product-detail-add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Cart Page
const CartPage = ({ cart, removeFromCart, checkout }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      await checkout()
      navigate('/checkout-success')
    } catch (error) {
      console.error('Checkout failed:', error)
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container" data-qa="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart" data-qa="empty-cart">
          <p data-qa="empty-cart-message">Your cart is empty.</p>
          <Link to="/" className="btn-primary" data-qa="continue-shopping-button">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container" data-qa="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-container" data-qa="cart-container">
        <div className="cart-items" data-qa="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item" data-qa={`cart-item-${item.id}`}>
              <div className="cart-item-image" data-qa="cart-item-image">
                <img src={item.product.imageUrl} alt={item.product.name} data-qa="cart-item-img" />
              </div>
              <div className="cart-item-details" data-qa="cart-item-details">
                <div className="cart-item-info" data-qa="cart-item-info">
                  <h3 data-qa="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-desc" data-qa="cart-item-description">{item.product.description.substring(0, 60)}...</p>
                  <p className="cart-item-price" data-qa="cart-item-price">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions" data-qa="cart-item-actions">
                  <div className="quantity-control" data-qa="quantity-control">
                    <span data-qa="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="btn-danger" data-qa="remove-button">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary" data-qa="cart-summary">
          <div className="cart-total" data-qa="cart-total">
            <h3>Cart Total</h3>
            <p className="total-amount" data-qa="total-amount">${calculateTotal().toFixed(2)}</p>
          </div>
          <button onClick={handleCheckout} className="btn-primary checkout-btn" disabled={loading} data-qa="checkout-button">
            {loading ? 'Processing...' : 'Checkout'}
          </button>
          <Link to="/" className="continue-shopping" data-qa="continue-shopping-link">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

// Checkout Success Page
const CheckoutSuccessPage = () => {
  return (
    <div className="container" data-qa="checkout-success-page">
      <div className="checkout-success" data-qa="checkout-success">
        <div className="success-icon" data-qa="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h1 data-qa="success-title">Thank You For Your Order!</h1>
        <p data-qa="success-message">Your order has been dispatched and will arrive just as fast as the pony can get there!</p>
        <Link to="/" className="btn-primary" data-qa="back-home-button">Back Home</Link>
      </div>
    </div>
  )
}

// Login Page
const LoginPage = ({ login }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.error || 'Epic sadface: Username and password do not match any user in this service')
      setLoading(false)
    }
  }

  return (
    <div className="login-container" data-qa="login-container">
      <div className="login-logo" data-qa="login-logo">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="10" fill="#E2231A"/>
          <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2>CJ Store</h2>
      </div>
      {error && <div className="error" data-qa="login-error">{error}</div>}
      <form onSubmit={handleSubmit} data-qa="login-form">
        <div className="form-group">
          <label htmlFor="email">Username</label>
          <input
            type="text"
            id="email"
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-qa="login-username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-qa="login-password"
          />
        </div>
        <button 
          type="submit" 
          className="btn-primary" 
          style={{
            width: '100%', 
            padding: '14px', 
            fontSize: '1.1em',
            marginTop: '10px',
            fontWeight: 'bold'
          }} 
          disabled={loading} 
          data-qa="login-button"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#6e6e6e'}} data-qa="login-register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

// Register Page
const RegisterPage = ({ register }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(name, email, password)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.error || 'Epic sadface: Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="login-container" data-qa="register-container">
      <div className="login-logo" data-qa="register-logo">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="10" fill="#E2231A"/>
          <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2>CJ Store</h2>
      </div>
      {error && <div className="error" data-qa="register-error">{error}</div>}
      <form onSubmit={handleSubmit} data-qa="register-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            data-qa="register-name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-qa="register-email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-qa="register-password"
          />
        </div>
        <button type="submit" className="btn-primary" style={{width: '100%'}} disabled={loading} data-qa="register-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#6e6e6e'}} data-qa="register-login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

// Main App Component
function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchCart()
    }

    setLoading(false)
  }, [])

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart')
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Login function
  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, ...userData } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    await fetchCart()
  }

  // Register function
  const register = async (name, email, password) => {
    const response = await axios.post('/api/auth/register', { name, email, password })
    const { token, ...userData } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setCart([])

    delete axios.defaults.headers.common['Authorization']

    navigate('/')
  }

  // Add to cart function
  const addToCart = async (productId) => {
    try {
      const response = await axios.post('/api/cart', { productId })
      await fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  // Remove from cart function
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/${productId}`)
      await fetchCart()
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  // Checkout function
  const checkout = async () => {
    await axios.post('/api/checkout')
    setCart([])
  }

  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, checkout }}>
        <div className="app">
          <Navbar 
            isLoggedIn={!!user} 
            logout={logout} 
            cartItemCount={cart.reduce((count, item) => count + item.quantity, 0)} 
          />

          <Routes>
            <Route path="/" element={user ? <ProductsPage addToCart={addToCart} isLoggedIn={!!user} /> : <LoginPage login={login} />} />
            <Route path="/products/:id" element={user ? <ProductDetailPage addToCart={addToCart} isLoggedIn={!!user} /> : <LoginPage login={login} />} />
            <Route path="/cart" element={user ? <CartPage cart={cart} removeFromCart={removeFromCart} checkout={checkout} /> : <LoginPage login={login} />} />
            <Route path="/checkout-success" element={user ? <CheckoutSuccessPage /> : <LoginPage login={login} />} />
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="/register" element={<RegisterPage register={register} />} />
          </Routes>
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
