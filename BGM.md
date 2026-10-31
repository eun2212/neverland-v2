# 확정 배경음악

사용자 선택: main B / captain B / wheel B / carousel A / mirror A / tea A / exit C / monochrome C.

bgm.js가 assets/bgm-*.wav를 반복 재생합니다. 시작 버튼을 누른 뒤에만 음악을 시작하며, 기존 반복 합성 반주는 끕니다. 기존 회전목마 퍼즐의 건반 효과음은 유지합니다.

공원 산책은 main B, 각 기구 입구 반경 9m 또는 내부에서는 해당 기구 음악입니다. 흑백 통로가 최우선이며 출구가 나타나는 것만으로 대치 음악을 틀지 않습니다. 실제 키퍼와 대치하는 config.confronting에서 exit C를 사용합니다. 프로필과 엔딩은 메인 테마로 돌아옵니다. 장면 전환은 약 0.9초 크로스페이드이며, 대화·지도만 열었을 때 같은 곡을 다시 시작하지 않습니다. 소리 버튼은 새 음악과 기존 효과음에 함께 적용됩니다. 탭을 숨기면 일시정지하고 돌아오면 이어집니다.

package-full-story.cjs는 음악 8개도 단일 HTML에 포함합니다. 후보 원본과 작곡·합성 명세는 design-candidates/bgm에 보존합니다. WAV는 기존 감상 시안과 동일한 합성 음원입니다.

검증: node verify-bgm.cjs, node verify-keeper-story.cjs, node verify-lost-boys.cjs.
