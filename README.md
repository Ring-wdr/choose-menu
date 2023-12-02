# 메뉴 고르기 앱

## 구현 고도화 단계

1. data i/o가 우선인 프로토타입 개발

- 사용 예상 기술
  - FE: next.js
  - BE: x (using supabase)
  - DB: x (using supabase)

2. ui/ux를 개선한 클라이언트 단 고도화 과정

- 사용 기술 미정

3. BE 및 DB 프레임워크로 변경

- 사용 예상 기술
  - BD: spring boot

## 기능

1. 초기 진입 페이지

- 입장한 현재 사용자를 지정하는 페이지
  - 로그인 대신 localstorage를 이용한 사용자 정보 캐싱

2. 메뉴 선택 페이지

- 크롤링을 통한 카페 메뉴 가져오기
  - 서버 사이드를 이용한 메뉴 크롤링
    - 과도 요청을 방지해서 모든 메뉴명을 분류별로 가져올 것
    - 음료 내부의 모든 분류들의 주소를 검색
    - 다음페이지로 가는 버튼이 없어질때까지 순차적 메뉴 탐색
  - 관리자 페이지 개발 후 이동 예정
- 메뉴 선택 목록

3. 메뉴 선택 완료 페이지

- 메뉴 선택 이후 넘어가는 페이지
- 뒤로가기를 통해 선택한 메뉴 수정 가능

4. 관리자 페이지

- 게시판 이용자가 선택한 메뉴를 볼 수 있는 페이지
- 메뉴 조회 기능 추가 후 크롤링 기능 옮길 예정
