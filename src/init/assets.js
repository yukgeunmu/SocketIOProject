import fs from 'fs';
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { fetchAndSaveAllSheets } from '../../googleSheet.js';


let gameAssets = {};

export const getGameAssets = () => {
    return gameAssets;
};

// import.meta.url은 현재 모듈의 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const  __filename = fileURLToPath(import.meta.url);
// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../assets');

const readFileAsync = (fileName) =>{
    return new Promise((resolve, reject) =>{
        fs.readFile(path.join(basePath, fileName), 'utf-8', (err, data) => {
            if(err){
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
};

export const loadGameAssets = async () => {
    try{

        await fetchAndSaveAllSheets();

        const [CharacterInfo, Item, LevelInfo, MonsterInfo, Stage] = await Promise.all([
            readFileAsync('CharacterInfo.json'),
            readFileAsync('Item.json'),
            readFileAsync('LevelInfo.json'),
            readFileAsync('MonsterInfo'),
            readFileAsync('Stage'),
        ]);

        gameAssets = { CharacterInfo, Item, LevelInfo, MonsterInfo, Stage};
        return gameAssets;
    }catch(err){
        throw new Error('Failed to load game assets: ' + err.message);
    };
    
};


