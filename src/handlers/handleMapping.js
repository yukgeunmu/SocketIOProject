import { createPlayer, saveScorePlayer, getItemInventory } from "./game.handler.js";

const hanlerMappings = {
    1: createPlayer,
    2: saveScorePlayer,
    3: getItemInventory,
    // 11: moveStageHandler,
}

export default hanlerMappings;