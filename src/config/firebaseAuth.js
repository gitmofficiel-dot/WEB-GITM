import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
export { auth } from "./firebase";

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
