import { prisma } from '../utils/prisma/index.js';

export const createPlayer = async (data) => {
  const { characterInfoId, levelInfoId, nickName } = data;

  const isNickName = await prisma.player.findUnique({
    where: { nickName },
  });

  if (isNickName) {
    const response = '이미 존재하는 닉네임입니다.';
    return response;
  }

  const player = await prisma.player.create({
    data: {
      characterInfoId,
      levelInfoId,
      nickName,
    },
  });

  return JSON.stringify(player, null, 2);
};

export const saveScorePlayer = async (data) => {
  const { id, exp, score } = data;

  await prisma.player.update({
    where: { id },
    data: {
      exp,
      score,
    },
  });

  const getPlayers = await prisma.player.findMany({
    orderBy: {
      score: 'desc',
    },
    take: 10,
  });

  const result = { players: getPlayers };

  return JSON.stringify(result, null, 2);
};


export const getItemInventory = async (data) =>{
  const{ playerId, itemId } = data;

  const saveInventory = await prisma.inventory.create({
    data: {
      playerId,
      itemId,
    }
  });


  const item = await prisma.item.findUnique({
    where:{ id: itemId }
  });

  return JSON.stringify(item, null, 2);

}