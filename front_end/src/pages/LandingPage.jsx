import { useState,useEffect } from "react";
import AuthButton from "./LoginButton";
import TomTomMap from "@/components/TomTomMap";
import { motion } from "framer-motion";
import { Search, Hospital, UserCog, Stethoscope } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const LandingPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const slowVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1, // Increased duration
        ease: "easeOut" // Smoother easing
      }
    }
  };

  const loginadmin = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    const email = user.email;

    try {
      const response = await fetch(`${url}/api/admin/check/${email}`);
      const data = await response.json();

      if (data.exists) {
        navigate("/admin-dashboard", { state: { email } });
      } else {
        await fetch(`${url}/api/admin/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        navigate("/admin-dashboard", { state: { email } });
      }
    } catch (error) {
      showToast();
    }
  };

  const logindoctor = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    navigate("/doctor-dashboard");
  };

  useEffect(() => {
    let timer;
    if (toast.visible) {
      timer = setTimeout(() => {
        setToast({ ...toast, visible: false });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (message, type = 'error') => {
    setToast({ 
      message: message || 'An  server error occurred', 
      type, 
      visible: true 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toast Notification */}
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-28 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg min-w-64 max-w-md text-center ${
            toast.type === 'error' 
              ? 'bg-destructive text-destructive-foreground' 
              : 'bg-green-500 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast({ ...toast, visible: false })}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

   {/* Navbar */}
   <nav className="border-b border-border/40 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center cursor-pointer"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary"
          >
            Find and Go
          </motion.h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={loginadmin} className="flex items-center gap-2">
              <UserCog className="w-4 h-4" /> Admin Login
            </Button>
            <Button variant="outline" onClick={logindoctor} className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" /> Doctor Login
            </Button>
            <AuthButton /> {/* Adding AuthButton back */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        variants={slowVariants}
        initial="hidden"
        animate="visible"
        className=" mt-24  flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 "
      >
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto mt-0 text-center">
          <motion.h1 
            variants={slowVariants}
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Your Health, Your Time - No More Waiting
          </motion.h1>
          <motion.p 
            variants={slowVariants}
            className="text-lg md:text-xl  text-muted-foreground max-w-2xl mx-auto"
          >
            Say goodbye to long waiting times – know your doctor's availability in advance.
          </motion.p>
        </div>
      </motion.div>

      {/* Map Section */}
      <div className="container mx-auto ">
        <TomTomMap 
         selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation} 
        />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Why Choose HealthLocator?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Hospital className="w-6 h-6" />,
              title: "Verified Providers",
              description: "All healthcare providers are thoroughly verified for your safety and peace of mind",
            },
            {
              icon: <Search className="w-6 h-6" />,
              title: "Smart Search",
              description: "Find the perfect healthcare provider with our intelligent search system",
            },
            {
              icon: <Stethoscope className="w-6 h-6" />,
              title: "Expert Care",
              description: "Connect with experienced healthcare professionals you can trust",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card hover:bg-card/90 transition-all duration-300 hover:shadow-lg border-primary/20">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-secondary-foreground">
              Connect with Us
            </h3>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://github.com/kiranraj2004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-2"
              >
                GitHub Profile
              </a>
              <a 
                href="mailto:kiranrajb5882@gmail.com"
                className="text-primary hover:text-primary/80 flex items-center gap-2"
              >
                Email
              </a>
            </div>
          </div>
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Find and Go.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
