# 네버랜드 v2 · 키퍼의 놀이공원

직접 걷고 다섯 놀이기구 안을 탐험·조작하는 3D 미스터리 게임입니다. 약한 로맨스와 함께, 주인공을 위험에 빠뜨리면서 구해 주는 키퍼의 집착을 다룹니다.

플레이: https://neverland-v2-park.cometibex2.chatgpt.site/

## 다른 컴퓨터에서 실행

Git과 Node.js를 설치한 뒤 실행합니다. npm 설치와 API 키는 필요 없습니다.

```sh
git clone https://github.com/eun2212/neverland-v2.git
cd neverland-v2
node server.cjs
```

브라우저에서 http://127.0.0.1:8773/ 을 여세요. Windows에서는 START.cmd도 사용할 수 있습니다. 종료는 서버 터미널의 Ctrl+C입니다. Three.js와 게임 자산이 포함되어 있어 로컬 실행에는 인터넷이 필요 없습니다. WebGL 지원 데스크톱 브라우저를 권장합니다.

포트가 사용 중이면 PowerShell에서 `$env:PORT='8780'; node server.cjs`로 실행하고 8780 주소를 여세요. macOS/Linux는 `PORT=8780 node server.cjs`입니다.

`play-full-story.html`은 최신 코드·이미지를 포함한 오프라인 단일 파일입니다. 로컬 서버 실행을 권장합니다. 진행 자동 저장은 없으며 엔딩 기록만 해당 브라우저에 남습니다. 클론해도 플레이 기록이 이동하지는 않습니다.

## 현재 게임

- 검은 별 하늘과 레드·골드·그린 무대형 공원. 정문은 앞, 캡틴 훅은 중앙, 네 기구는 주변.
- 현위치 지도, 기구별 내부 공간, 좌석 탑승·조작·실제 탑승 시점.
- 첫 사고 전 단계별 안내·반복 질문·준비 확인.
- 첫 사고 뒤 앞으로만 걷는 흑백 인형 무덤. 복귀하면 키퍼가 꿈이었다고 부정.
- 정상 탑승마다 체크 글리치와 가면의 별에서 시작하는 단일 영역 레드 잠식. 출구에서는 공원 전체가 체크무늬, 키퍼는 완전한 단색 빨강.
- 위험을 숨기고 구해 주는 다섯 기구 사건, 신뢰·불신·경계 선택, 증거, 출구의 악역 고백.
- 일반 대화 답변 두 번 완료 뒤 강제 탑승. 초반 튜토리얼 질문은 제외.
- 성향별 18개 응답, 퍼레이드·주사위, 다섯 퍼즐과 성별별 그림을 가진 다섯 엔딩.

## 수정과 검증

```sh
node verify-keeper-story.cjs
node package-full-story.cjs
```

현재 총 494개 검증입니다. 패키징은 단일 파일을 다시 만들고 저장소 옆 outputs 폴더에도 사본을 만듭니다.

**다른 컴퓨터에서 이어 작업하기 전에 [HANDOFF.md](HANDOFF.md)를 읽으세요.**

상세 문서: [키퍼 이야기](KEEPER-STORY.md), [흑백 세계](FRACTURE-REALM.md), [붉은 잠식](KEEPER-CORRUPTION.md), [강제 탑승](FORCED-BOARDING.md), [기구 내부](RIDE-INTERIORS.md).

디자인 후보·프롬프트·검증 화면은 design-candidates에 보관합니다. original-2d는 초기 이야기 참고용입니다. 최신 진입점은 루트 index.html입니다.

게임 내용과 그림의 권리는 원작자에게 있습니다. 플레이 링크 공유는 가능합니다. 저장소 공개가 무단 수정·복제·재배포에 대한 별도 허락을 뜻하지는 않습니다.
