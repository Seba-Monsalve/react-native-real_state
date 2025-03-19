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

    return true;
  } catch (error) {
    console.error(error);

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
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getLastestProperties = async () => {
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

export const getProperties = async ({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) => {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));
    if (limit) buildQuery.push(Query.limit(limit));
    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    const res = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );
    return res.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

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
    console.log("asd");
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
