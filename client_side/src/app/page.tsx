'use client';
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "antd";
import SignUp from "./components/Signup";
import Login from "./components/Login";

export default function Home() {
  return (
    <Login />
  );
}
