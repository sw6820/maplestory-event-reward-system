# 메이플스토리 이벤트 보상 시스템

NestJS와 MongoDB 기반의 마이크로서비스 아키텍처로 구현된 이벤트 및 보상 관리 시스템입니다.  
운영자는 이벤트와 보상을 등록하고, 사용자는 조건을 충족하면 보상을 요청할 수 있으며, 모든 요청은 역할 기반 인증 및 감사 추적이 가능합니다.

이 시스템은 실제 게임 운영 환경에서 발생할 수 있는 반복적이고 수동적인 이벤트 보상 업무를 자동화하고, 확장성과 보안성을 고려한 구조로 설계되었습니다.

## 프로젝트 개요

- 사용자 유형에 따른 역할 기반 접근 제어 (USER, OPERATOR, AUDITOR, ADMIN)
- JWT 기반 인증/인가 구조
- 이벤트 생성, 보상 정의, 보상 요청 및 조건 검증
- 중복 요청 방지, 요청 이력 저장 및 감사 열람 기능
- NestJS 기반 MSA 구조 + Docker 환경 구성

## 서비스 구성

### 1. Auth Service (`apps/auth`)

- 역할  
  사용자 회원가입, 로그인, JWT 기반 인증/인가 처리
- 주요 API  
  - `POST /auth/register`: 회원가입
  - `POST /auth/login`: 로그인 및 JWT 발급
  - `POST /auth/refresh`: Refresh 토큰으로 Access 토큰 재발급
  - `GET /auth/profile`: 토큰 인증 기반 사용자 정보 조회
- 설계 의도  
  인증 및 권한 관리를 별도 서비스로 분리하여 보안성과 유연성을 확보하고, Refresh 토큰 기반 장기 세션 유지 구조 구현

### 2. Event Service (`apps/event`)

- 역할  
  이벤트 생성, 조회, 보상 정의, 유저 보상 요청 및 이력 관리
- 주요 API  
  - `POST /events`: 이벤트 생성 (ADMIN 권한)
  - `GET /events`: 전체 이벤트 조회 (인증 필요)
  - `POST /reward/request`: 유저 보상 요청 (조건 자동 검증)
  - `GET /reward/history`: 본인 또는 전체 요청 이력 조회 (역할별 제한)
- 설계 의도  
  이벤트/보상 도메인을 분리하여 유지보수성을 확보하고, MongoDB 기반으로 유연한 데이터 저장 및 조건 확장 가능성 확보

### 3. Gateway Service (`apps/gateway`)

- 역할  
  클라이언트의 모든 요청을 받아 인증/인가 처리 후 적절한 서비스로 라우팅
- 기능  
  - JWT 인증, 역할 검사, 입력 유효성 검증 처리
  - `/auth/*`, `/events/*` 엔드포인트 라우팅
- 설계 의도  
  클라이언트와 서비스 간 단일 진입점 제공 및 인증/인가 공통 로직 중앙 집중 처리

## 역할 기반 권한 체계

| 역할 | 설명 |
|------|------|
| USER | 조건 만족 시 보상 요청 가능 |
| OPERATOR | 이벤트 및 보상 등록/수정 가능 |
| AUDITOR | 모든 요청 이력 조회 가능 (읽기 전용) |
| ADMIN | 모든 시스템 기능 접근 가능 |

## 디렉토리 구조

maplestory-event-reward-system/
├── apps/
│ ├── auth/ # 인증 서비스
│ ├── event/ # 이벤트 및 보상 처리
│ └── gateway/ # API Gateway
├── libs/common/ # 공통 DTO, enum, interface
├── test/ # Jest + SuperTest 기반 테스트
├── docker/ # 실행 스크립트 및 설정
└── docker-compose.yml

## 실행 방법

### 사전 준비

- Node.js 18 이상
- Docker 및 Docker Compose 설치
- 포트 27017, 3000 사용 가능 여부 확인

### 환경 변수 설정

각 서비스 루트에 `.env` 파일을 생성합니다. 예시는 아래와 같습니다:

apps/auth/.env

JWT_SECRET=maple-secret

MONGODB_URI=mongodb://mongo:27017/maplestory-auth

apps/event/.env

MONGODB_URI=mongodb://mongo:27017/maplestory-events


### 테스트 실행

#### 유닛 테스트 (Jest 기반)

npm run test


#### 테스트 커버리지 확인

npm run test:cov


#### e2e 통합 테스트 (SuperTest 기반)

npm run test:e2e

#### Docker 기반 전체 통합 테스트 실행

npm run test:docker


### Docker로 전체 서비스 실행

#### docker-compose.yml 예시

version: '3.8'
services:
mongo:
image: mongo:6
container_name: maple-mongo
ports:
- 27017:27017
volumes:
- ./data/mongo:/data/db

auth:
build: ./apps/auth
environment:
- MONGODB_URI=mongodb://mongo:27017/maplestory-auth
- JWT_SECRET=maple-secret
depends_on:
- mongo

event:
build: ./apps/event
environment:
- MONGODB_URI=mongodb://mongo:27017/maplestory-events
depends_on:
- mongo

gateway:
build: ./apps/gateway
ports:
- 3000:3000
depends_on:
- auth
- event

#### 실행 명령어

docker-compose up --build


- gateway: http://localhost:3000
- auth, event: 내부 서비스 (gateway 통해 접근)
- MongoDB: localhost:27017

#### 종료 및 정리

docker-compose down -v

### 개발 서버 수동 실행

auth 서비스 개발 서버 실행
npm run start:dev auth

event 서비스 개발 서버 실행
npm run start:dev event

gateway 서비스 개발 서버 실행
npm run start:dev gateway


## 설계 의도 요약

- 인증, 이벤트, 라우팅 책임을 마이크로서비스 단위로 분리하여 확장성 확보
- JWT 기반 stateless 인증 구조 적용
- 조건 검증, 중복 방지, 요청 이력 관리 등 실무 운영 요구사항을 반영
- 테스트와 배포를 고려한 Docker 기반 구조 설계
- 기술적 구현 능력뿐만 아니라, 실무에서 발생할 수 있는 운영 문제를 시스템적으로 해결하는 구조를 고민하며 설계하였습니다.
