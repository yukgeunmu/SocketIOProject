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
    const [CharacterInfo, Item, LevelInfo, MonsterInfo, Stage, MonsterOnStage, Monster] =
      await Promise.all([
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


const tableMap = {
  CharacterInfo: prisma.characterInfo,
  MonsterInfo: prisma.monsterInfo,
  Item: prisma.item,
  Stage: prisma.stage,
  LevelInfo: prisma.levelInfo,
  Monster: prisma.monster,
  MonsterOnStage: prisma.monsterOnStage,
};

async function upsertTable(tableName, data) {
  const model = tableMap[tableName];
  if (!model) throw new Error(`${tableName} 매핑된 모델 없음`);

  return data.map((row) => {
    const where =
      tableName === 'MonsterOnStage'
        ? { monsterId_stageId: { monsterId: row.monsterId, stageId: row.stageId } }
        : { id: row.id };

    return model.upsert({
      where,
      update: { ...row },
      create: { ...row },
    });
  });
}

export async function updateAllGameAssets() {
  const queries = [];

  for (const [tableName, rows] of Object.entries(gameAssets)) {
    if (!rows || rows.length === 0) continue;
    queries.push(...(await upsertTable(tableName, rows.data)));
  }

  await prisma.$transaction(queries);
  console.log('모든 정적 테이블 업데이트 완료');
}

