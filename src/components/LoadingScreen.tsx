import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "./auth/authContexts";
import loaderImage from "../assets/images/devlingo-loader.png";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    let fadeTimer: number | undefined;
    const visibleTimer = window.setTimeout(() => {
      setIsFading(true);
      fadeTimer = window.setTimeout(() => {
        setIsVisible(false);

        if (!authLoading) {
          if (!isAuthenticated && !['/signin', '/signup'].includes(location.pathname)) {
            navigate({ to: '/signin', replace: true });
          }

          if (isAuthenticated && location.pathname === '/signin') {
            navigate({ to: '/', replace: true });
          }
        }
      }, 700);
    }, 2000);

    return () => {
      window.clearTimeout(visibleTimer);
      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer);
      }
    };
  }, [navigate, authLoading, isAuthenticated, location.pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-purple-950/95 transition-opacity duration-700 ${isFading ? "opacity-0" : "opacity-100"} pointer-events-auto`}
    >
      <div className="relative flex flex-col items-center gap-6 rounded-[2rem] bg-white/10 border border-white/20 px-8 py-10 shadow-2xl backdrop-blur-xl">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-xl">
          <img
            src={loaderImage}
            alt="Devlingo loader"
            className="h-20 w-20 object-contain animate-float"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white">Devlingo</h1>
          <p className="mt-2 text-sm text-white/75">Carregando o aplicativo... aguarde um momento.</p>
        </div>
      </div>
    </div>
  );
}

