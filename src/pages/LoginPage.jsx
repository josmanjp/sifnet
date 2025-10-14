import Login from "../components/Login";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
export default function LoginPage() {
  const navigate = useNavigate();
  
  const handleLogin = async ({ email, password }) => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token); // Guarda el token
    } catch (err) {
      toast.error("Credenciales inválidas");
    }
  };

  return <Login onLogin={handleLogin} />;
}
