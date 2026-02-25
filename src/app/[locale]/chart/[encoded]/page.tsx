import type { Metadata } from "next";
import ChartPageClient from "./ChartPageClient";

interface Props {
  params: Promise<{ encoded: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encoded } = await params;
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const data = JSON.parse(atob(b64));
    return { title: `${data.name}'s Cosmic Chart` };
  } catch {
    return { title: "Cosmic Chart" };
  }
}

export default async function ChartPage({ params }: Props) {
  const { encoded } = await params;
  return <ChartPageClient encoded={encoded} />;
}
