import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Transaction } from "@/app/interfaces/user.interface";

export const config = {
  platform: "com.imaginaryInc.real-state",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,

  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTIONS_ID,
  transactionsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTIONS_ID,
  createdUserCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_CREATED_USERS_COLLECTIONS_ID,
  organizationsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ORGANIZATIONS_COLLECTIONS_ID,
  organizationsRequestCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ORGANIZATIONS_REQUEST_COLLECTIONS_ID,
};

export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");
    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");
    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    const { $id, email, name } = await account.get();

    const userExists = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("$id", $id)]
    );
    if (userExists.total == 0) {
      const newUser = await databases.createDocument(
        config.databaseId!,
        config.usersCollectionId!,
        $id,
        {
          email,
          name,
          avatar: avatar.getInitials(name),
          isActive: true,
        }
      );
    }

    return true;
  } catch (error) {
    console.error("error en login", error);

    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();

    const user = await databases.getDocument(
      config.databaseId!,
      config.usersCollectionId!,
      result.$id
    );
    if (user) {
      const userAvatar = avatar.getInitials(result.name);
      return {
        ...user,
        avatar: user.avatar || userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.log("error en getCurrentUser", error);
    return null;
  }
}

// export const getTransactions = async () => {
//   try {
//     const res = await databases.listDocuments(
//       config.databaseId!,
//       config.transactionsCollectionId!,
//       [Query.orderDesc("$createdAt")]
//     );
//     return res.documents;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

// export const getProperties = async ({
//   filter,
//   query,
//   limit,
// }: {
//   filter: string;
//   query: string;
//   limit?: number;
// }) => {
//   try {
//     const buildQuery = [Query.orderDesc("$createdAt")];

//     if (filter && filter !== "All")
//       buildQuery.push(Query.equal("type", filter));
//     if (limit) buildQuery.push(Query.limit(limit));
//     if (query)
//       buildQuery.push(
//         Query.or([
//           Query.search("name", query),
//           Query.search("address", query),
//           Query.search("type", query),
//         ])
//       );

//     const res = await databases.listDocuments(
//       config.databaseId!,
//       config.propertiesCollectionId!,
//       buildQuery
//     );
//     return res.documents;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

export const getTransactionById = async ({ id }: { id: string }) => {
  try {
    const res = await databases.listDocuments(
      config.databaseId!,
      config.transactionsCollectionId!,
      [Query.equal("creditor", id)]
    );
    return res.documents;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUsers = async () => {
  try {
    const res = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );
    return res.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCreatedUsers = async ({ id }: { id: string }) => {
  try {
    const res = await databases.listDocuments(
      config.databaseId!,
      config.createdUserCollectionId!,
      [Query.equal("created_by", id)]
    );
    return res.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUserById = async ({ id }: { id: string }) => {
  try {
    const res = await databases.getDocument(
      config.databaseId!,
      config.createdUserCollectionId!,
      id
    );
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createUser = async ({
  name,
  created_by,
}: {
  name: string;
  created_by: string;
}): Promise<any> => {
  try {
    const user = await databases.createDocument(
      config.databaseId!,
      config.createdUserCollectionId!,
      ID.unique(),
      {
        name,
        created_by,
      }
    );
    return user;
  } catch (error) {
    console.log("error en createUser", error);
    return false;
  }
};

export const createTransaction = async ({
  monto,
  motivo,
  createdUsers,
  creditor,
}: Transaction) => {
  try {
    const transaction = await databases.createDocument(
      config.databaseId!,
      config.transactionsCollectionId!,
      ID.unique(),
      {
        monto,
        motivo,
        createdUsers,
        creditor,
      }
    );
    return transaction;
  } catch (error) {
    console.log("error en createTransaction", error);
    return false;
  }
};

export const updateTransaction = async ({
  id,
  isAlreadyPaid,
}: {
  id: string;
  isAlreadyPaid: boolean;
}) => {
  try {
    const transaction = await databases.updateDocument(
      config.databaseId!,
      config.transactionsCollectionId!,
      id,
      { isAlreadyPaid }
    );
    return transaction;
  } catch (error) {
    console.log("error en updateTransaction", error);
    return false;
  }
};

export const deleteTransaction = async ({ id }: { id: string }) => {
  try {
    const transaction = await databases.deleteDocument(
      config.databaseId!,
      config.transactionsCollectionId!,
      id
    );
    return transaction;
  } catch (error) {
    console.log("error en deleteTransaction", error);
    return false;
  }
};

export const updateDebtStatus = async ({
  id,
  noDebt,
}: {
  id: string;
  noDebt: boolean | null;
}) => {
  try {
    const transaction = await databases.updateDocument(
      config.databaseId!,
      config.createdUserCollectionId!,
      id,
      { noDebt }
    );
    return transaction;
  } catch (error) {
    console.log("error en updateDebtStatus", error);
    return false;
  }
};

// ORRGANIZATIONS

export const getOrganizations = async () => {
  try {
    const organizations = await databases.listDocuments(
      config.databaseId!,
      config.organizationsCollectionId!,
      [Query.orderAsc("$createdAt")]
    );
    return organizations;
  } catch (error) {
    console.log("error en getOrganizations", error);
    return false;
  }
};

export const getOrganizationById = async ({ id }: any) => {
  try {
    const organization = await databases.getDocument(
      config.databaseId!,
      config.organizationsCollectionId!,
      id
    );
    return organization;
  } catch (error) {
    console.log("error en getOrganizationById", error);
    return false;
  }
};

export const getOrganizationRequestById = async ({ user_id, org_id }: any) => {
  try {
    const requests = await databases.listDocuments(
      config.databaseId!,
      config.organizationsRequestCollectionId!,
      [Query.equal("user", user_id), Query.equal("organization", org_id)]
    );
    return requests;
  } catch (error) {
    console.log("error en getOrganizationById", error);
    return false;
  }
};

export const createOrganizationRequest = async ({ user_id, org_id }: any) => {
  try {
    const request = await databases.createDocument(
      config.databaseId!,
      config.organizationsRequestCollectionId!,
      ID.unique(),
      {
        user: user_id,
        organization: org_id,
      }
    );
    return true;
  } catch (error) {
    console.log("error en getOrganizationRequestById", error);
    return false;
  }
};

export const updateOrganizationConfig = async ({ org_id, options }: any) => {
  try {
    console.log({options});
    console.log(org_id);
    const request = await databases.updateDocument(
      config.databaseId!,
      config.organizationsCollectionId!,
      org_id,
      {
        showMembers: options.showMembers,
        showTransactions: options.showTransactions,
        showSummary: options.showSummary,
      }
    );
    return true;
  } catch (error) {
    console.log("error en updateOrganizationConfig", error);
    return false;
  }
};

