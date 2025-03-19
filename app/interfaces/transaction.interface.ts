import { User } from "./user.interface";

export interface Transaction {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: any[];
  $updatedAt: Date;
  id_payer: string;
  id_receiver: string;
  isAlreadyPaid: null;
  item: string;
  monto: number;
  paid_by: User;
}
