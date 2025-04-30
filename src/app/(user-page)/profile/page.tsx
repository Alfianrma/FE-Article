"use client";
import React from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

function UserProfilePage() {
  const user = useUser();
  const router = useRouter();
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="text-black text-xl font-semibold">User Profile</div>
      <picture className="rounded-full w-20 h-20 flex justify-center items-center overflow-hidden mt-10">
        <img src="/image/default_user.png" alt="Profile" />
      </picture>
      <div className="flex flex-row  mt-4 ">
        <div className="bg-gray-100 flex flex-row items-center justify-between pl-4 py-2 w-32 rounded-l-lg border-y border-gray-200 border-l">
          <div className="text-black font-semibold text-lg">Username</div>
          <div className="text-black font-semibold text-lg">:</div>
        </div>
        <div className="py-2 bg-gray-100 w-60 rounded-r-lg  border-y border-gray-200 border-r mx-auto text-black font-medium text-lg text-center">
          {user?.username}
        </div>
      </div>
      <div className="flex flex-row  mt-2 ">
        <div className="bg-gray-100 flex flex-row items-center justify-between pl-4 py-2 w-32 rounded-l-lg border-y border-gray-200 border-l">
          <div className="text-black font-semibold text-lg">Role</div>
          <div className="text-black font-semibold text-lg">:</div>
        </div>
        <div className="py-2 bg-gray-100 w-60 rounded-r-lg  border-y border-gray-200 border-r mx-auto text-black font-medium text-lg text-center">
          {user?.role}
        </div>
      </div>
      <button
        className="bg-primaryBlue text-white text-sm w-[360px]  px-4 py-2 rounded-lg mt-10 hover:bg-primaryBlue/80 transition duration-300 ease-in-out hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        {" "}
        Back To Home
      </button>
    </div>
  );
}

export default UserProfilePage;
