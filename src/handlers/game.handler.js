import { prisma } from '../utils/prisma/index.js';

export const createPlayer = async (data) => {
  const {characterInfoId, levelInfoId, nickName} = data;


  const isNickName = await prisma.player.findUnique({
    where: { nickName },
  });

  if(isNickName){
    const response = '이미 존재하는 닉네임입니다.';
    return response;
  }

  const player = await prisma.player.create({
    data:{
        characterInfoId,
        levelInfoId,
        nickName,
    }
  });

  return JSON.stringify(player, null, 2);
};
