import { loadGameAssets, updateAllGameAssets } from '../init/assets.js';
import { fetchAndSaveAllSheets } from '../../googleSheet.js';

export const updateHandler = async () => {
  try {

    await fetchAndSaveAllSheets(); // 구글 시트 -> json

    const assets = await loadGameAssets(); // json -> JS Data

    await updateAllGameAssets(); // JS Data -> DB Data

    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }

};
