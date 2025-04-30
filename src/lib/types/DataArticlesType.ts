type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string;
};

type User = {
  id: string;
  username: string;
  role: "User" | "Admin"; // Add other possible roles if needed
};

type ListArticlesType = {
  id: string;
  title: string;
  content: string;
  userId: string;
  categoryId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  user: User;
};

export type { ListArticlesType, Category, User };
