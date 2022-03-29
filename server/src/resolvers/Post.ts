import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: Context) => {
    // This will store the ids and data of Users that had been queried and will return them avoiding to make another call to the DB everytime a user is needed. 
    return userLoader.load(parent.authorId);
  },
};
