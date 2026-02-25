import type { Metadata } from "next";
import ComparisonPageClient from "./ComparisonPageClient";

interface Props {
  params: Promise<{ encoded: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { encoded } = await params;
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const data = JSON.parse(atob(b64));
    return { title: `${data.user?.name} & ${data.connection?.name} — Cosmic Compatibility` };
  } catch {
    return { title: "Cosmic Compatibility" };
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { encoded } = await params;
  return <ComparisonPageClient encoded={encoded} />;
}
