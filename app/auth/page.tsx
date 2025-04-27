import AuthForms from "@/components/auth-forms"
import Navbar from "@/components/navbar"

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Account Access</h2>
          <AuthForms />
        </div>
      </div>
    </main>
  )
}
