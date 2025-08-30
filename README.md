# Socket.IO 기반 실시간 게임 서버

Node.js, Express, Socket.IO를 사용하여 구축된 실시간 게임 서버 프로젝트입니다. Prisma를 통해 MySQL 데이터베이스를 관리하며, Google Sheets에서 게임 데이터를 동기화합니다.

## ✨ 주요 기능

- **플레이어 관리:** 신규 플레이어 생성 및 데이터 관리
- **점수 시스템:** 플레이어 점수 저장 및 관리
- **인벤토리:** 플레이어 아이템 인벤토리 조회
- **실시간 통신:** Socket.IO를 사용한 클라이언트-서버 간 실시간 상호작용

## 🛠️ 기술 스택

- **백엔드:** Node.js, Express.js
- **실시간 통신:** Socket.IO
- **데이터베이스:** MySQL with Prisma ORM
- **데이터 동기화:** Google Sheets API

## 💾 데이터 관리

이 프로젝트는 Google Sheets를 원본으로 하여 게임 데이터를 관리합니다.

- **`googleSheet.js`**: Google Sheets API를 통해 시트 데이터를 가져와 프로젝트의 `/assets` 디렉토리에 JSON 파일로 저장하는 스크립트입니다.
- **`src/dataUpdate.js`**: 전체 데이터 동기화 파이프라인을 실행하는 스크립트입니다. 아래의 순서로 동작합니다.
    1.  Google Sheet 데이터 조회 (`googleSheet.js` 실행)
    2.  로컬 JSON 파일 (`/assets`) 생성
    3.  JSON 데이터를 읽어 게임 데이터베이스(MySQL)에 최신 정보로 업데이트

## 🚀 시작하기

### 1. 사전 요구사항

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [MySQL](https://www.mysql.com/)
- 게임 데이터가 포함된 Google Sheet

### 2. 설치

저장소를 복제하고 의존성을 설치합니다.

```bash
git clone <repository-url>
cd SocketIOProject
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가합니다.

```env
# 데이터베이스 연결 문자열
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Google Sheets API 정보
SHEET_ID="YOUR_GOOGLE_SHEET_ID"
API_KEY="YOUR_GOOGLE_API_KEY"
```

### 4. 데이터베이스 및 게임 데이터 동기화

아래 명령어를 실행하여 Prisma 스키마를 데이터베이스에 적용하고, Google Sheet의 데이터를 가져와 데이터베이스까지 한번에 동기화합니다.

```bash
node src/dataUpdate.js
```

### 5. 서버 실행

애플리케이션 서버를 시작합니다.

```bash
node src/app.js
```

서버는 `http://localhost:3000`에서 실행됩니다.

게음 깃허브 주소입니다.
https://github.com/yukgeunmu/2DActionGame.git
