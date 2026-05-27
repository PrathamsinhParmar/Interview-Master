import "./style.scss"
import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"

import React from 'react'

const App = () => {
  return (
   <RouterProvider router={ router } />
  )
}

export default App
