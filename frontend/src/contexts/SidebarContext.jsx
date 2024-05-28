import { createContext, useContext, useState } from "react";
const SidebarContext = createContext();
function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <SidebarContext.Provider value={{ toggleSidebar, isOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) throw new Error("Outside the scope");
  return context;
}
export { SidebarProvider, useSidebar };
