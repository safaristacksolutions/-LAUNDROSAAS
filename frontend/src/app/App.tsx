import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { setupInterceptors } from "../api/interceptors";
import { useEffect } from "react";
import { AppProviders } from "./providers";

export default function App() {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
