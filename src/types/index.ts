export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: string | User;
  status: 'open' | 'assigned';
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  _id: string;
  gigId: string | Gig;
  freelancerId: string | User;
  message: string;
  price: number;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface GigsState {
  gigs: Gig[];
  currentGig: Gig | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

export interface BidsState {
  bids: Record<string, Bid[]>; // Keyed by gigId
  isLoading: boolean;
  error: string | null;
}
