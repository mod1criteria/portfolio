20250611 

포트폴리오 프로젝트 시작
제목 : 노트 프로그램

방향성 
다양한 종류의 기록(일정, 일기, 가계부, 업무, 예약 등)
편하고 다양한 방식(음성, 타이핑, 필기 등)
인터넷이 되는 어디에서나(핸드폰, 워치, PC) 작성하고 확인
모든 사람에게 간단하게 원하는 범위까지만 공유 할 수 있도록 함

목표 1
카카오톡을 긁어다 ai툴에다 입력하면 해당 ai툴이 내 서버의 api를 호출 해 자동으로 일정을 기록한다.

소목표 1
* api 서버 프레임워크 선정
* 일정 기입 api 생성
* api로 받은 일정을 json 파일로 기록

## Development Setup
NestJS server located in ./server

## Frontend (React)
`./client` 폴더에는 TypeScript 기반의 React SPA가 들어 있습니다. 빌드 후 생성된 정적 파일을 아무 정적 서버에서나 제공할 수 있습니다.

### 실행 예시
```bash
# 루트 폴더에서 간단한 http 서버 실행
npx http-server -p 3000
```
이후 브라우저에서 `http://localhost:3000/client/` 경로를 열면 로그인 화면이 나타납니다.
