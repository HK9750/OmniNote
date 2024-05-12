import React from "react";
import Header from "@/components/landing-page/Header";

const HomeLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
};
export default HomeLayoutPage;
