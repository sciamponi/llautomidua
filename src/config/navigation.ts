import { getProducts } from "@/lib/products.functions";

export const PUBLIC_NAV = {
  saas: {
    label: "SaaS",
    color: "#1E8CFF",
    // Products will be fetched dynamically in the component
  },
  services: {
    label: "Serviços",
    color: "#4CDFF2",
    links: [
      { name: "Sites Profissionais", href: "/sites" },
      { name: "Media Indoor", href: "/media-indoor" },
      { name: "Diagnóstico", href: "/diagnostico", highlight: true },
    ]
  },
  company: [
    { name: "Sites", href: "/sites" },
    { name: "Media Indoor", href: "/media-indoor" },
    { name: "Parceiros", href: "/parceiros" },
    { name: "Área de Membros", href: "/membros" },
  ]
};
