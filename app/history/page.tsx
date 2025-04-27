import SessionHistory from "@/components/session-history"
import Navbar from "@/components/navbar"

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Session History</h2>
        <SessionHistory />
      </div>
    </main>
  )
}
