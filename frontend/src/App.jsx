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
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Demo Store</Link>
      </div>
      <div className="navbar-nav">
        <Link to="/">Products</Link>
        {isLoggedIn ? (
          <>
            <Link to="/cart">Cart ({cartItemCount})</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

// Home/Products Page
const ProductsPage = ({ addToCart, isLoggedIn }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p>{product.description.substring(0, 100)}...</p>
            <button onClick={() => handleProductClick(product.id)}>View Details</button>
            {isLoggedIn && (
              <button onClick={() => addToCart(product.id)} className="btn-primary">
                Add to Cart
              </button>
            )}
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

  if (loading) return <div>Loading product details...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>Back to Products</button>
      <div className="product-detail">
        <img src={product.imageUrl} alt={product.name} />
        <h1>{product.name}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p>{product.description}</p>
        {isLoggedIn && (
          <button onClick={() => addToCart(product.id)} className="btn-primary">
            Add to Cart
          </button>
        )}
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
      <div className="container">
        <h1>Your Cart</h1>
        <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.product.imageUrl} alt={item.product.name} />
          <div className="cart-item-details">
            <h3>{item.product.name}</h3>
            <p>${item.product.price.toFixed(2)} x {item.quantity}</p>
            <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeFromCart(item.product.id)} className="btn-danger">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        <button onClick={handleCheckout} className="btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  )
}

// Checkout Success Page
const CheckoutSuccessPage = () => {
  return (
    <div className="container">
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your order. Your order has been placed successfully.</p>
      <Link to="/">Continue Shopping</Link>
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
      setError(error.response?.data?.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
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
      setError(error.response?.data?.error || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
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
            <Route path="/" element={<ProductsPage addToCart={addToCart} isLoggedIn={!!user} />} />
            <Route path="/products/:id" element={<ProductDetailPage addToCart={addToCart} isLoggedIn={!!user} />} />
            <Route path="/cart" element={user ? <CartPage cart={cart} removeFromCart={removeFromCart} checkout={checkout} /> : <LoginPage login={login} />} />
            <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="/register" element={<RegisterPage register={register} />} />
          </Routes>
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  )
}

export default App