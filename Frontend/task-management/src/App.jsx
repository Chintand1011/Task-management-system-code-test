import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<Dashboard/>} />
            {/* other protected routes */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;