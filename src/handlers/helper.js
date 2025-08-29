import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../models/constants.js';
import handlerMappings from './handleMapping.js';
import { loadDBData } from '../init/assets.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected : ${socket.id}`);
  console.log('Current users :', getUsers());
};

export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());


  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해주고 있다.
  socket.emit('connection', { uuid: userUUID });
};

export const handleEvent = async (io, socket, data) => {

  const handler = handlerMappings[data.handlerId];

  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const  response  = await handler(data);

  // if(response.broadcast){
  //   io.emit('response', 'broadcast');
  //   return;
  // }
  socket.emit('response', response);

};

export const handelLoadData = async (io, socket) =>{
  const jsonGameData = await loadDBData();

  socket.emit('sendData', jsonGameData);

}
