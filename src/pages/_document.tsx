import { Html, Head, Main, NextScript } from "next/document";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased dark:bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
