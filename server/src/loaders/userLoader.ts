import Dataloader from "dataloader";
import { User } from ".prisma/client";
import { prisma } from "..";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchUsers: BatchUser = async (ids) => {
  // This will return an array of Users but not necessarilly in the same order the ids array was provided.
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const userMap: { [key: string]: User } = {};

  users.forEach((user) => (userMap[user.id] = user));

  return ids.map((id) => userMap[id]);
};

//@ts-ignore This makes typescript ignore this particular error
export const userLoader = new Dataloader<number, User>(batchUsers);
