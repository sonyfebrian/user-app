import {IPost} from "@/types"
import axios from "axios";



const BASE_URL = "https://jsonplaceholder.typicode.com";

export const getPosts = async (): Promise<IPost[]> => {
  const response = await fetch(`${BASE_URL}/posts`);
  return response.json();
};

export const fetchPosts = async () => {
    const { data } = await axios.get<IPost[]>(`${BASE_URL}/posts`);
    return data;
};

export const getPost = async (id: number): Promise<IPost> => {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  return response.json();
};

export const createPost = async (post: IPost) => {
  // const response = await fetch(`${BASE_URL}/posts`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(post),
  // });
  const response = await axios.post(`${BASE_URL}/posts`, post);
 
  return response;
};

export const updatePost = async (id: number, post: IPost): Promise<IPost> => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  return response.json();
};

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });
};
