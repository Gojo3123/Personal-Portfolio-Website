import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react'
import Container from '../components/Container.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Button from '../components/Button.jsx'
import EmptyState from '../components/EmptyState.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import { useCart } from '../context/CartContext.jsx'
import { useConfirm } from '../context/ConfirmContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Cart() {
  usePageTitle('Saved Projects', 'Your saved portfolio projects (bookmark list).')
  const { items, removeFromCart, increaseQty, decreaseQty, clearCart, count } = useCart()
  const confirm = useConfirm()
  const toast = useToast()

  const handleClear = async () => {
    const ok = await confirm({
      title: 'Clear saved projects?',
      message: 'All items will be removed from your cart. This cannot be undone.',
      confirmText: 'Clear cart',
    })
    if (!ok) return
    clearCart()
    toast.success('Cart cleared')
  }

  const handleRemove = async (item) => {
    const ok = await confirm({
      title: `Remove ${item.name}?`,
      message: 'This project will be removed from your saved list.',
      confirmText: 'Remove',
    })
    if (!ok) return
    removeFromCart(item.id)
    toast.info('Project removed from cart')
  }

  return (
    <main className="pb-20">
      <section className="pt-14">
        <Container>
          <SectionHeading
            eyebrow="Your Cart"
            title="Saved projects"
            subtitle="This cart bookmarks portfolio projects you like — it persists in your browser even after refreshing. It is not a checkout."
          />

          {items.length === 0 ? (
            <div className="mx-auto max-w-2xl">
              <EmptyState
                icon={ShoppingCart}
                title="Your cart is empty"
                description="Explore the projects page and tap the cart icon on any project to save it here."
                actionLabel="Browse projects"
                actionTo="/projects"
              />
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{count}</span>{' '}
                  item{count > 1 ? 's' : ''} saved
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" /> Clear cart
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center animate-fade-up"
                  >
                    <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-purple-950 sm:h-20 sm:w-28">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookmarkCheck className="h-7 w-7 text-purple-400" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                        {item.category || 'Project'}
                      </p>
                      {item.live && (
                        <a
                          href={item.live}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-purple-500 hover:underline"
                        >
                          Live demo <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Quantity control */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item.id)}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-300"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900 dark:text-white">
                        {item.qty || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQty(item.id)}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-purple-400 hover:text-purple-600 dark:border-white/10 dark:text-slate-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      aria-label={`Remove ${item.name}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {count} project{count > 1 ? 's' : ''} saved
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Saved locally in your browser — no payment involved.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button to="/projects" variant="secondary" icon={ArrowRight}>
                    Keep exploring
                  </Button>
                  <Button to="/contact">Discuss a project</Button>
                </div>
              </div>
            </>
          )}
        </Container>
      </section>
    </main>
  )
}
