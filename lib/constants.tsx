import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  { id: 1, url: "/", icon: <LayoutDashboard />, label: "Dashboard" },
  { id: 2, url: "/collections", icon: <Shapes />, label: "Collections" },
  { id: 3, url: "/products", icon: <Tag />, label: "Products" },
  { id: 4, url: "/orders", icon: <ShoppingBag />, label: "Orders" },
  { id: 5, url: "/customers", icon: <UsersRound />, label: "Customers" },
];
