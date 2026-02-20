import http from 'k6/http';
import { check, sleep } from 'k6';

// ===== JWT 토큰 =====
const TOKEN = __ENV.TOKEN;

const image = open('../../uploads/bookCover.jpeg', 'b');

export const options = {
  vus: 100, // 동시 사용자
  duration: '30s', // 테스트 시간
};

export default function () {
  const data = {
    file: http.file(image, 'test-bookCover.jpeg', 'image/jpeg'),
    title: '나의 첫번째 창작물',
    description: '이 작품은 AI가 분석한 안전한 이미지입니다.',
    price: '50000',
  };

  const res = http.post('http://localhost:3000/api/works/upload', data, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  // console.log(`STATUS: ${res.status}`);
  // console.log(`BODY: ${res.body}`);
  // console.log('TOKEN:', TOKEN);

  check(res, {
    'status is 201 or 200': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
