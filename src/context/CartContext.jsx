import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'portfolio_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Cart is a "saved projects" list for visitors — it bookmarks portfolio
 * projects (persisted in localStorage), it does not process payments.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      /* ignore quota errors */
    }
  }, [items])

  const addToCart = (project) => {
    if (!project?.id) return false
    let added = false
    setItems((current) => {
      if (current.some((item) => item.id === project.id)) return current
      added = true
      return [
        ...current,
        {
          id: project.id,
          name: project.name,
          image: project.image,
          category: project.category,
          live: project.live,
          qty: 1,
        },
      ]
    })
    return added
  }

  const removeFromCart = (id) =>
    setItems((current) => current.filter((item) => item.id !== id))

  const increaseQty = (id) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, qty: Math.min(item.qty + 1, 99) } : item))
    )

  const decreaseQty = (id) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, qty: Math.max(item.qty - 1, 1) } : item))
    )

  const clearCart = () => setItems([])

  const isInCart = (id) => items.some((item) => item.id === id)

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
      isInCart,
      count: items.reduce((sum, item) => sum + (item.qty || 1), 0),
    }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
