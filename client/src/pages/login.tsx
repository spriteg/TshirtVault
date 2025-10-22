import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black" data-testid="page-login">
      <div className="text-center space-y-8 max-w-md px-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white" data-testid="text-login-title">
            T-Shirt Inventory
          </h1>
          <p className="text-lg text-gray-400" data-testid="text-login-message">
            Please log in to manage your inventory
          </p>
        </div>
        
        <Button 
          onClick={handleLogin}
          size="lg"
          className="min-h-12 px-8 text-lg"
          data-testid="button-login"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Log In
        </Button>
      </div>
    </div>
  );
}
