export type NavItem = { href: string; label: string; count?: number };

/** Sidebar groups. Counts are prototype badges until the API supplies live numbers. */
export const ADMIN_NAV: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [{ href: "/dashboard", label: "Dashboard" }, { href: "/dashboard/reports", label: "Reports" }] },
  {
    title: "Orders",
    items: [
      { href: "/dashboard/orders", label: "Orders", count: 12 },
      { href: "/dashboard/custom-orders", label: "Custom cake orders" },
      { href: "/dashboard/design-reviews", label: "Design reviews", count: 4 },
      { href: "/dashboard/quotations", label: "Quotations" },
      { href: "/dashboard/payments", label: "Payments", count: 3 },
      { href: "/dashboard/calendar", label: "Production calendar" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/dashboard/products", label: "Products" },
      { href: "/dashboard/categories", label: "Categories" },
      { href: "/dashboard/builder-options", label: "Cake builder options" },
      { href: "/dashboard/decorations", label: "Decorations" },
      { href: "/dashboard/inventory", label: "Inventory" },
      { href: "/dashboard/promotions", label: "Promotions" },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/dashboard/customers", label: "Customers" },
      { href: "/dashboard/messages", label: "Messages", count: 2 },
      { href: "/dashboard/reviews", label: "Reviews" },
      { href: "/dashboard/settings", label: "Settings" },
    ],
  },
];
