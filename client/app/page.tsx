"use client";
import { useGlobalContext } from "@/context/globalContext";
import Link from "next/link";
import Header from "@/components/Header";


export default function Home() {
  const {isAuthenticated} = useGlobalContext(); 

  console.log(isAuthenticated);
  return (
    <main>
      <Header />
    </main>
  );
}
