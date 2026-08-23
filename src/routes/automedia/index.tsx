import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/automatiza/Header'
import { ProductSalesTemplate } from '@/components/automatiza/products/ProductSalesTemplate'

export const Route = createFileRoute('/automedia/')({
  component: () => (
    <div className="min-h-screen bg-[#071A2F] font-inter text-[#DCE3EA]">
      <Header />
      <main className="pt-20 text-center py-20">
         <h1 className="text-4xl font-bold text-white mb-8">Redirecionando...</h1>
         <p>Esta solução agora se chama <strong>Media Indoor</strong>.</p>
         <a href="/media-indoor" className="mt-8 inline-block bg-[#1E8CFF] text-white px-8 py-4 rounded-xl font-bold">Acessar Media Indoor</a>
      </main>
    </div>
  )
})
