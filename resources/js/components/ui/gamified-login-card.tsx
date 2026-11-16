import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiParticle {
  id: number
  x: number
  y: number
  rotate: number
  color: string
}

const colors = ["#facc15", "#22c55e", "#3b82f6", "#f472b6", "#f97316"]

export default function GamifiedLoginCard() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [particles, setParticles] = React.useState<ConfettiParticle[]>([])

  const handleLogin = () => {
    if (!email || !password) return

    const newParticles: ConfettiParticle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)
    setSuccess(true)

    setTimeout(() => setParticles([]), 1000)
  }

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: p.rotate }}
            animate={{
              x: (Math.random() - 0.5) * 150,
              y: -Math.random() * 200,
              scale: 0,
              opacity: 0,
              rotate: p.rotate + Math.random() * 360,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          {success ? "Welcome!" : "Sign In"}
        </h2>

        <div className="flex flex-col gap-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-purple-500"
            />
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleLogin}
        >
          {success ? "Logged In!" : "Login"}
        </Button>

        {!success && (
          <p className="text-center text-sm text-gray-400 mt-2">
            Don’t have an account?{" "}
            <a href="#" className="text-purple-400 hover:underline">Sign up</a>
          </p>
        )}
      </motion.div>
    </div>
  )
}
