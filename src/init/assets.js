import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../utils/prisma/index.js';

let gameAssets = {};

export const getGameAssets = () => {
  return gameAssets;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

const readFileAsync = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, fileName), 'utf-8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [CharacterInfo, Item, LevelInfo, MonsterInfo, Stage, MonsterOnStage, Monster] = await Promise.all([
      readFileAsync('CharacterInfo.json'),
      readFileAsync('Item.json'),
      readFileAsync('LevelInfo.json'),
      readFileAsync('MonsterInfo.json'),
      readFileAsync('Stage.json'),
      readFileAsync('MonsterOnStage.json'),
      readFileAsync('Monster.json'),
    ]);

    gameAssets = { CharacterInfo, Item, LevelInfo, MonsterInfo, Stage, MonsterOnStage, Monster };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const sendGameAssetsFromDB = async () => {
  try {
    const { CharacterInfo, Item, LevelInfo, MonsterInfo, Stage, MonsterOnStage, Monster } = gameAssets;

    if (!CharacterInfo || !Item || !LevelInfo || !MonsterInfo || !Stage || !MonsterOnStage || !Monster) {
      throw new Error('Game assets not loaded. Please call loadGameAssets first.');
    }

    const characterInfoDatas = CharacterInfo.data;
    const itemDatas = Item.data;
    const levelInfoDatas = LevelInfo.data;
    const monsterInfoDatas = MonsterInfo.data;
    const stageDatas = Stage.data;
    const monsterOnStage = MonsterOnStage.data;
    const monsterDatas = Monster.data;

    await prisma.$transaction(async (tx) => {
      //delete data
      const deleteCharacterInfo = tx.characterInfo.deleteMany({});
      const deleteItem = tx.item.deleteMany({});
      const deleteLevel = tx.levelInfo.deleteMany({});
      const deleteMonsterInfo = tx.monsterInfo.deleteMany({});
      const deleteStage = tx.stage.deleteMany({});
 

      await prisma.$transaction([
        deleteCharacterInfo,
        deleteItem,
        deleteLevel,
        deleteMonsterInfo,
        deleteStage,
      ]);

      await tx.monster.deleteMany({});
      await tx.monsterOnStage.deleteMany({});

      // Create new data
      const createCharacterInfo = tx.characterInfo.createMany({ data: characterInfoDatas});
      const createItem = tx.item.createMany({ data: itemDatas });
      const createLevel = tx.levelInfo.createMany({ data: levelInfoDatas });
      const createMonsterInfo = tx.monsterInfo.createMany({ data: monsterInfoDatas });
      const createStage = tx.stage.createMany({ data: stageDatas });


      await prisma.$transaction([
        createCharacterInfo,
        createItem,
        createLevel,
        createMonsterInfo,
        createStage,
      ]);

      await tx.monster.createMany({data: monsterDatas});
      await tx.monsterOnStage.createMany({ data: monsterOnStage });

    });

    console.log('Game assets have been successfully sent to the database.');
  } catch (error) {
    console.error('Failed to send game assets to DB:', error);
    throw error;
  }
};
