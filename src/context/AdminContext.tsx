"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type User = {
  id: string;
  username: string;
  role: string;
};

const AdminUserContext = createContext<User | null>(null);

export function AdminUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    const token = getCookie("token");

    //  Redirect if no token
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You are not logged in!",
      });
      router.replace("/user-auth/signin");
      return;
    }

    try {
      const response = await axios.get(
        "https://test-fe.mysellerpintar.com/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      console.log("userData", userData);

      // Redirect if role not admin
      if (userData.role !== "Admin") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You are not authorized to access this page!",
        });
        router.replace("/admin-auth/signin");
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch admin user:", error);
      router.replace("/admin-auth/signin");
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <AdminUserContext.Provider value={user}>
      {children}
    </AdminUserContext.Provider>
  );
}

export function useAdminUser() {
  return useContext(AdminUserContext);
}
