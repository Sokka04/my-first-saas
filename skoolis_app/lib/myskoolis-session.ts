export type MyskoolisSession = {
  identifier: string;
  mode: "email" | "phone";
  loggedInAt: string;
};

const SESSION_KEY = "skoolis-myskoolis-session";
const COMMENTS_KEY = "skoolis-public-comments";

export type PublicComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export function getMyskoolisSession(): MyskoolisSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MyskoolisSession;
  } catch {
    return null;
  }
}

export function setMyskoolisSession(session: MyskoolisSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearMyskoolisSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getPublicComments(): PublicComment[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(COMMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PublicComment[];
  } catch {
    return [];
  }
}

export function addPublicComment(comment: PublicComment) {
  const comments = getPublicComments();
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify([comment, ...comments]));
}
