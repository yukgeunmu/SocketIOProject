import { addUser, getUsers } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { handelLoadData, handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { loadGameAssets } from '../init/assets.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uuidv4(); // UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id });

    handleConnection(socket, userUUID);

    // 모든 서비스 이벤트 처리
    socket.on('event', async (data) => handleEvent(io, socket, data));

    socket.on('loadData', async () => handelLoadData(io, socket));



    // 접속 해제시 이벤트 처리
    socket.on('disconnect', () => {
      handleDisconnect(socket, userUUID);
    });
  });
};

export default registerHandler;
