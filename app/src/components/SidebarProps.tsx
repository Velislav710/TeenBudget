export interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    currentMenu: string;
    setCurrentMenu: (menu: string) => void;
  }
  