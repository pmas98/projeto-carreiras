import type { Metadata } from "next";
import { DefiningProduct } from "@/components/po/DefiningProduct";

export const metadata: Metadata = {
  title: "Definindo o Produto · Product Owner",
};

export default function DefiningProductPage() {
  return <DefiningProduct />;
}
