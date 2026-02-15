import { useAuthStore } from "@/entities/auth/model/store";
import { router } from "@/routes/routes";
import supabase from "@/shared/supabase";
import { useEffect } from "react";
import { RouterProvider } from "react-router";

export const AppInit: React.FC = () => {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <RouterProvider router={router} />;
};
