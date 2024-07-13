# 앰블 클론 코딩

<img width="1344" alt="스크린샷 2024-06-24 오후 10 29 33" src="https://github.com/mvldevtest/mvldev-assignment-9bdb7ad2-frontend-ESMOON/assets/82797463/50ff0220-1255-459e-87c7-1c35590b6ea7"></img>

### 라이브러리

- Recoil
- date-fns
- styled-components
- npm
- MUI toast, modal

### 요구사항

- 총 6번의 기회, 5글자 입력하기
- 회색 - 정답에 없는 글자
- 노란색 - 정답에는 있지만 위치가 틀린 글자
- 녹색 - 정답에 있는 글자이면서 위치까지 정확하게 맞춘 글자
- 정답 또는 실패일 경우 공유 모달, 공유하기, 닫기, 다시하기 버튼
- 공유하기 : 사용자의 게임 현황에 대한 클리보드 복사
- 닫기 : 모달 닫기
- 다시하기 : 모든 상태 reset
- 단어가 단어 목록에 없거나 5글자 미만 입력 시 toast

### 프로젝트 구성

```
mvldev-assignment-9bdb7ad2-frontend-ESMOON
└─ src
   ├─ App.css
   ├─ App.js
   ├─ App.test.js
   ├─ Pages
   │  └─ Main.jsx
   ├─ atoms
   │  └─ index.js
   ├─ components
   │  └─ Keyboard
   │     ├─ component.jsx
   │     └─ index.js
   ├─ index.css
   ├─ index.js
   ├─ logo.svg
   ├─ reportWebVitals.js
   ├─ setupTests.js
   └─ system
      ├─ date.js
      └─ words.json

```

### 느낀점

기능을 추가하면서 state가 늘어나 state를 줄일 수 있는 방법을 고민하게 되었습니다.
그러다 useReducer를 사용하기로 결정했습니다. 초기상태, 진행상태, 토스트 상태, 모달 상태, 키보드의 업데이트 상태의 상황별로 type을 분리했습니다.

프로젝트의 규모가 크지 않아 recoil의 atom이나 react-hook-form 같은 라이브러리를 활용하기보단 react의 순수 hook을 활용해서 구현해보고 싶었습니다.

정답이 되는 state도 react의 hook을 활용해도 되지 않나 라는 생각을 했습니다. 하지만 어찌보면 게임이 끝날때까지 변하면 안되는 전역변수의 개념이 되지 않을까? 라는 생각에 분리해서 가져가는게 맞다는 판단이 들었습니다.

### 아쉬운 점

useReducer로 많았던 상태들을 줄였지만 게임에 대한 상태들과 toast, modal의 상태는 분리했으면 더 좋았을 것 같다는 생각이 들었습니다.
컬러가 몇개 안되서 정의하지 않고 시작을 했는데, styled-components를 활용해서 컬러 theme을 정의했다면 더 좋았을 것 같다.
