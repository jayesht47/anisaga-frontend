"use server";

import { cookies } from "next/headers";
import { Anime } from "./definitions";
import { decrypt } from "./session-management";

export const getTrendingAnimeList = async () => {
  try {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error("server url not configured!");
    const trendingAnimeListpath = "/anime/trending";
    const trendingAnimeListUrl = hostname
      ? hostname + trendingAnimeListpath
      : "";
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    const response = await fetch(trendingAnimeListUrl, {
      method: "GET",
      headers: headers,
    });
    if (response.status != 200) {
      const respObj = await response.json();
      console.error(
        `receieved status ${
          response.status
        } for getTrendingAnimeList, response json was ${JSON.stringify(
          respObj
        )}`
      );
    }

    if (response.status === 200) {
      const respObj: [Anime] = await response.json();
      return respObj;
    }
  } catch (e) {
    console.error(`Exception occurred in getTrendingAnimeList ${e}`);
  }
};

export const getAnimeBySlug = async (slug: string | undefined) => {
  try {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error("server url not configured!");
    if (slug == undefined) throw new Error("slug cannot be undefined!");
    const animeBySlugPath = "/anime/slug/";
    const trendingAnimeListUrl = hostname
      ? hostname + animeBySlugPath + slug
      : "";
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    const response = await fetch(trendingAnimeListUrl, {
      method: "GET",
      headers: headers,
    });
    if (response.status != 200) {
      const respObj = await response.json();
      console.error(
        `receieved status ${
          response.status
        } for getAnimeBySlug, response json was ${JSON.stringify(respObj)}`
      );
    }

    if (response.status === 200) {
      const respObj: Anime = await response.json();
      return respObj;
    }
  } catch (e) {
    console.error(`Exception occurred in getAnimeBySlug ${e}`);
  }
};

export const checkIfLiked = async (slug: string | undefined) => {
  try {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error("server url not configured!");
    if (slug == undefined) throw new Error("slug cannot be undefined!");
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userName: string = session?.userName as string;
    const token: string = session?.token as string;
    if (!userName) throw new Error("User session not valid!");
    let animeIsLikedPath = `/users/user/${userName}/like/anime/contains?`;
    const searchParams = new URLSearchParams({
      slug,
    });
    animeIsLikedPath = animeIsLikedPath + searchParams;
    const animeIsLikedUrl = hostname ? hostname + animeIsLikedPath : "";
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(animeIsLikedUrl, {
      method: "GET",
      headers: headers,
    });
    if (response.status != 200) {
      const respObj = await response.json();
      console.error(
        `receieved status ${
          response.status
        } for checkIfLiked, response json was ${JSON.stringify(respObj)}`
      );
    }

    if (response.status === 200) {
      const respObj = await response.json();
      return respObj.isLiked;
    }
  } catch (e) {
    console.error(`Exception occurred in getAnimeBySlug ${e}`);
  }
};

export const addToLikes = async (slug: string | undefined) => {
  try {
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error("server url not configured!");
    if (slug == undefined) throw new Error("slug cannot be undefined!");
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userName: string = session?.userName as string;
    const token: string = session?.token as string;
    if (!userName) throw new Error("User session not valid!");
    let addToLikesPath = `/users/user/${userName}/like/anime/add?`;
    const searchParams = new URLSearchParams({
      slug,
    });
    addToLikesPath = addToLikesPath + searchParams;
    const addToLikesUrl = hostname ? hostname + addToLikesPath : "";
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(addToLikesUrl, {
      method: "POST",
      headers: headers,
    });
    if (response.status != 200) {
      console.error(`receieved status ${response.status} `);
    }

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(`Exception occurred in addToLikes ${e}`);
    return false;
  }
};

export const removeFromLikes = async (slug: string | undefined) => {
  try {
    console.log(`removeFromLikes called!`);
    const hostname: string | undefined = process.env.SERVER_URL;
    if (hostname == undefined) throw new Error("server url not configured!");
    if (slug == undefined) throw new Error("slug cannot be undefined!");
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userName: string = session?.userName as string;
    const token: string = session?.token as string;
    if (!userName) throw new Error("User session not valid!");
    let removeFromLikesPath = `/users/user/${userName}/like/anime/remove?`;
    const searchParams = new URLSearchParams({
      slug,
    });
    removeFromLikesPath = removeFromLikesPath + searchParams;
    const removeFromLikesUrl = hostname ? hostname + removeFromLikesPath : "";
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(removeFromLikesUrl, {
      method: "POST",
      headers: headers,
    });
    if (response.status != 200) {
      const respObj = await response.json();
      console.error(
        `receieved status ${
          response.status
        } for addToLikes, response json was ${JSON.stringify(respObj)}`
      );
    }

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (e) {
    console.error(`Exception occurred in addToLikes ${e}`);
    return false;
  }
};

export const getLikedAnimes = async () => {
  try {
    const hostName: string | undefined = process.env.SERVER_URL;
    if (hostName == undefined) throw new Error("server url not configured!");
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    const userName: string = session?.userName as string;
    if (!userName) throw new Error("User session not valid!");
    const token: string = session?.token as string;
    const getLikesPath = `/users/user/${userName}/like/anime/list`;
    const getLikesUrl = hostName + getLikesPath;
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${token}`);
    const response = await fetch(getLikesUrl, {
      headers,
    });
    if (response.ok) {
      const respObj: [Anime] = await response.json();
      return respObj;
    }
  } catch (e) {
    console.error(`Exception occurred in getLikes ${e}`);
  }
};
