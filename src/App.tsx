import "./App.css";
import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomeLayout from "./layouts/HomeLayout.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import MyPage from "./pages/MyPage.tsx";
import LpListPage from "./pages/LpListPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import LpDetailPage from "./pages/LpDetailPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedLayout } from "./layouts/ProtectedLayout.tsx";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LpListPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'lps/:lpId', element: <LpDetailPage /> },
    ],
  },
  {
    path: "/v1/auth/google/callback", 
    element: <GoogleLoginRedirectPage />,
    errorElement: <NotFoundPage />,
  }
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "my",
        element: <MyPage />,
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export const queryClient : QueryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 

export default App;