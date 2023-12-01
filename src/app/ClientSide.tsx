"use client";
import { useState } from "react";
import Link from "next/link";
import Button from "@/component/Button";

export default function ClientSide() {
  const [userName, setUserName] = useState("");

  return (
    <>
      <input type="text" onChange={(e) => setUserName(e.currentTarget.value)} />
      <Link
        href={{
          pathname: "/menu",
          query: { userName },
        }}
      >
        <Button fullWidth>선택</Button>
      </Link>
    </>
  );
}
