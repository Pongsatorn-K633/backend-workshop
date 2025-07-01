import { serve } from '@hono/node-server'
import { Hono } from 'hono'

type Status = 'active' | 'inactive' | 'pending'

interface Product {
  id: number
  name: string
  price: number
  quantity: number
  status: Status
  description?: string
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 100, quantity: 10, status: 'active' },
  { id: 2, name: 'Product 2', price: 200, quantity: 20, status: 'inactive' },
  { id: 3, name: 'Product 3', price: 300, quantity: 30, status: 'active' },
  { id: 4, name: 'Product 4', price: 400, quantity: 40, status: 'pending', description: 'Minecraft Pickaxe' }
]

const app = new Hono()

app.get('/products', (c) => {
  return c.json({ data: products })
})

app.post('/products', async (c) => {
  const product = await c.req.json() as Product
  products.push({ ...product, id: products.length + 1 })
  return c.json({ message: 'Product created' }, 201)
})

app.get('/products/:id', (c) => {
  const id = Number(c.req.param('id'))
  const product = products.find((p) => p.id === id)
  if (!product) {
    return c.json({ message: 'Product not found' }, 404)
  }
  return c.json({ data: product })
})

app.put('/products/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const product = await c.req.json() as Product
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) {
    return c.json({ message: 'Product not found' }, 404)
  }
  products[index] = { ...product, id: products[index].id }
  return c.json({ message: 'Product updated' })
})

app.patch('/products/:id/status', async (c) => {
  const id = Number(c.req.param('id'))
  const product = await c.req.json() as { status: Status }
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) {
    return c.json({ message: 'Product not found' }, 404)
  }
  products[index] = { ...products[index], status: product.status }
  return c.json({ message: 'Product status updated' })
})

app.patch('/products/:id/quantity', async (c) => {
  const id = Number(c.req.param('id'))
  const product = await c.req.json() as { quantity: number }
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) {
    return c.json({ message: 'Product not found' }, 404)
  }
  products[index] = { ...products[index], quantity: product.quantity }
  return c.json({ message: 'Product quantity updated' })
})

app.delete('/products/:id', (c) => {
  const id = Number(c.req.param('id'))
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) {
    return c.json({ message: 'Product not found' }, 404)
  }
  products.splice(index, 1)
  return c.json({ message: 'Product deleted' })
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
