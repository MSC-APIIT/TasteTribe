"use client";
import { useParams } from "next/navigation";
import StallProfileContent from "./StallProfileContent";

export default function StallProfilePage() {
  const { stallId } = useParams();

  return <StallProfileContent stallId={stallId as string} />;
}
