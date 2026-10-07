import { type Order } from "../types/Order";

export const MOCK_ORDERS: Order[] = [
  {
    id: "PED-10928",
    userId: "user-1",
    status: "IN_PROCESS",
    statusLabel: "Em Processo",
    createdAt: "2026-04-05T14:30:00",
    estimatedDelivery: "12 de Abril, 2026",
    total: 389.80,
    paymentMethod: "Cartão de Crédito (via Pix / MercadoPago)",
    shippingMethod: "Entrega expressa (Sedex)",
    address: {
      recipientName: "Fernando Martins",
      street: "Rua Sete de Setembro",
      number: "1500",
      complement: "Apto 402",
      city: "Blumenau",
      state: "SC",
      zipCode: "89010-202"
    },
    items: [
      {
        id: "item-1",
        product: {
          id: "prod-101",
          name: "Teclado Mecânico RGB Hot-Swappable Switch Red",
          price: 289.90,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60"
        } as Order["items"][number]["product"],
        quantity: 1,
        price: 289.90
      },
      {
        id: "item-2",
        product: {
          id: "prod-102",
          name: "Mousepad Extra Grande 900x400mm Speed",
          price: 99.90,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60"
        } as Order["items"][number]["product"],
        quantity: 1,
        price: 99.90
      }
    ]
  },
  {
    id: "PED-10812",
    userId: "user-1",
    status: "FINISHED",
    statusLabel: "Concluído",
    createdAt: "2026-03-20T10:15:00",
    total: 149.90,
    paymentMethod: "Pix",
    shippingMethod: "Entrega Padrão",
    address: {
      recipientName: "Fernando Martins",
      street: "Rua Sete de Setembro",
      number: "1500",
      complement: "Apto 402",
      city: "Blumenau",
      state: "SC",
      zipCode: "89010-202"
    },
    items: [
      {
        id: "item-3",
        product: {
          id: "prod-103",
          name: "Fone de Ouvido Gamer 7.1 Surround",
          price: 149.90,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
        } as Order["items"][number]["product"],
        quantity: 1,
        price: 149.90
      }
    ]
  },
  {
    id: "PED-10740",
    userId: "user-1",
    status: "CANCELED",
    statusLabel: "Cancelado",
    createdAt: "2026-02-11T09:00:00",
    total: 89.00,
    paymentMethod: "Boleto Bancário",
    shippingMethod: "Entrega Padrão",
    address: {
      recipientName: "Fernando Martins",
      street: "Rua Sete de Setembro",
      number: "1500",
      city: "Blumenau",
      state: "SC",
      zipCode: "89010-202"
    },
    items: [
      {
        id: "item-4",
        product: {
          id: "prod-104",
          name: "Suporte Articulado para Monitor 17\" a 32\"",
          price: 89.00,
          image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60"
        } as Order["items"][number]["product"],
        quantity: 1,
        price: 89.00
      }
    ]
  }
];