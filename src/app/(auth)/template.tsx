import React from "react";
interface TemplateProps {
  children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return <div className="p-4 h-screen flex justify-center">{children}</div>;
};

export default Template;
