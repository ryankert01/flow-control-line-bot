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

async function updateUser(lineId: string, preferredPlace: number, prisma: any): Promise<void> {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        lineId: lineId,
      },
      data: {
        prefered_place: preferredPlace,
      },
    });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateUser2(lineId: string, evacuationPlace: number, prisma: any): Promise<void> {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        lineId: lineId,
      },
      data: {
        chose_place: evacuationPlace,
      },
    });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// updateTrafic
async function updateTraffic(id: number, chosen_Users_number: number, prisma: any): Promise<void> {
  try {
    const updatedTraffic = await prisma.traffic.update({
      where: {
        id: id,
      },
      data: {
        chosen_Users_number: chosen_Users_number,
      },
    });
    console.log('Traffic updated:', updatedTraffic);
  } catch (error) {
    console.error('Error updating traffic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// updatePlace
async function updatePlace(id: number, chosen_Users_number: number, prisma: any): Promise<void> {
  try {
    const updatedPlace = await prisma.places.update({
      where: {
        id: id,
      },
      data: {
        chosen_Users_number: chosen_Users_number,
      },
    });
    console.log('Place updated:', updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
  } finally {
    await prisma.$disconnect();
  }
}


// pull all Places from database and convert them as json
async function getPlaces(prisma: any) {
  const places = await prisma.Places.findMany();
  return places;
}

// pull all Traffic from database and convert them as json
async function getTraffic(prisma: any) {
  const traffic = await prisma.Traffic.findMany();
  return traffic;
}


export { add_user, updateUser, updateUser2, getPlaces, getTraffic, updateTraffic, updatePlace }