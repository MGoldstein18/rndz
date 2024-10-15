"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import Hero from "./components/Hero";
import Features from "./components/Features";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
