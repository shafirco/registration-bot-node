export interface ChatRequest {
  name: string;
  phone: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  actions: string[];
  timestamp: string;
}

export interface ShipmentStatus {
  id: string;
  status: string;
  location: string;
  estimatedDelivery: string;
  lastUpdate: string;
}

export interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  lastOrder?: string;
}

export interface ChatLog {
  timestamp: string;
  name: string;
  phone: string;
  message: string;
  response: string;
}

