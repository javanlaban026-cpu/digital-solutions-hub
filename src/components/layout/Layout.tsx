import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { JLAssistant } from "@/components/shared/JLAssistant";
import { FloatingOfferBadge } from "@/components/shared/FloatingOfferBadge";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 lg:pt-20">{children}</main>
      <Footer />
      <JLAssistant />
      <FloatingOfferBadge />
    </div>
  );
};
