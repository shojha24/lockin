import SetupProcess from "@/components/setup-process"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Setup Your Session</h2>
        <SetupProcess />
      </div>
    </main>
  )
}
