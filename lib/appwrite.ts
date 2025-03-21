import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

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

      console.log({ newUser });
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
    console.log({ user });
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

export const getTransactions = async () => {
  try {
    const res = await databases.listDocuments(
      config.databaseId!,
      config.transactionsCollectionId!,
      [Query.orderAsc("$createdAt")]
    );
    return res.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

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
      [Query.equal("id_receiver", id)]
    );
    return res;
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
    console.log(res);
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
