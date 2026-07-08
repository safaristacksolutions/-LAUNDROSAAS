import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { setupInterceptors } from "../api/interceptors";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return <RouterProvider router={router} />;
}
