import { Suspense } from "react"
import { RouterProvider } from "react-router"
import { router } from "./routes"

function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
      <p className="text-[#B5222A] text-lg italic" style={{ fontFamily: "'Caveat', cursive" }}>
        carregando... ✦
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
