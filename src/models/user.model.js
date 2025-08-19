const users = [];

// 유저는 객체 형태로 저장
export const addUser = (user) => {
    users.push(user);
};

// 배열에서 유저 삭제
export const removeUser = (socketId) =>{
    const index = users.findIndex((user) => user.socketId === socketId);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// 전체 유저 조회
export const getUsers = () => {
    return users;
};


