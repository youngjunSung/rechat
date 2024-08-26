import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      // 프론트 서버와 백엔드 서버의 도메인이 다를 경우에도 백엔드에서 생성한 쿠키를 프론트로 주고 받게 할 수 있는 옵션
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
