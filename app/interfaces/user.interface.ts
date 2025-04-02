export interface MemberOf {
  name: string;
  description: string;
  image: null;
  isTransparent: boolean;
  $id: string;
  created_by: User;
  transactions: any[];
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  isActive: boolean;
  $id: string;
  memberOf?: MemberOf[];
  createdUsers?: CreatedUser[];
}

export interface Transaction {
  motivo: string;
  monto: number;
  isAlreadyPaid: boolean | null;
  $id: string;
  createdUsers?: CreatedUser | string;
  organizations?: null;
  creditor: string;
}

export interface CreatedUser {
  name: string;
  noDebt: boolean;
  $id: string;
  transactions?: Transaction[];
}

export interface Organization {
  $id: string;
  created_by: User;
  description: string;
  image: null;
  isTransparent: boolean;
  name: string;
  transactions: Transaction[];
  members: User[];
  admins: User[];
}
