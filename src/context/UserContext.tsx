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

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const getUserData = useCallback(async () => {
    const token = getCookie("token");

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

      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.error || "Failed to fetch user data",
      });
      router.replace("/user-auth/signin");
    }
  }, [router]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
