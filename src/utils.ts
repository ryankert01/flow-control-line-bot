async function add_user(id: string, prisma: any) {
    const lineUserId = id;
  
    // Returns an object or null
    var getUser: object | null = await prisma.user.findUnique({
      where: {
        lineId: lineUserId,
      },
    });
    if (!getUser) {
      const user = await prisma.user.create({
        data: {
          lineId: lineUserId,
        },
      });
      console.log(user);
    } else {
      console.log('User already exists');
      console.log(getUser)
    }

    getUser = await prisma.user.findUnique({
        where: {
          lineId: lineUserId,
        },
    });
    
    return getUser
}

export { add_user }