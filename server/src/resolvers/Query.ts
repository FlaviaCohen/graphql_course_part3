import { Context } from "..";

export const Query = {
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return null;
    }

    return await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  // It's not necessary to be authenticated to query for a profile
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma, userInfo }: Context
  ) => {
    const isMyProfile = Number(userId) === userInfo?.userId;

    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!profile) return null;

    return {
      ...profile,
      isMyProfile,
    };
  },

  posts: async (_: any, __: any, { prisma }: Context) => {
    // if we want all the posts there's no need to pass any parameters to findMany method
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" } /* { title: "asc" } */],
    });

    return posts;
  },
};
