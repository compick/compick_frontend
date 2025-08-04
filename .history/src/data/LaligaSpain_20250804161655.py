import requests
from bs4 import BeautifulSoup
import os
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# 현재 스크립트 기준으로 절대경로 설정
base_dir = os.path.dirname(os.path.abspath(__file__))
save_dir = os.path.join(base_dir, '../img/soccerTeam/laligaSpain')
save_dir = os.path.abspath(save_dir)  # 정규화
os.makedirs(save_dir, exist_ok=True)

print("📁 저장 디렉토리:", save_dir)

# 정확한 URL 생성
urls = [
    f"https://namu.wiki/w/{year}-{str(year+1)[-2:]}%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS"
    for year in range(2019, 2026)
]

club_data = set()

for url in urls:
    try:
        print(f"🔎 요청 중: {url}")
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        res.encoding = 'utf-8'
        soup = BeautifulSoup(res.text, 'html.parser')

        span_tags = soup.find_all('span', class_='no5JPXQH')

        for span in span_tags:
        img = span.find('img', class_='IIlhLQ+O')
        if img:
            alt = img.get('alt')
            src = img.get('src')

            # ✅ src가 //로 시작하면 https: 붙이기
            if src and src.startswith('//'):
                src = 'https:' + src

            if alt and src:
                club_data.add((alt.strip(), src.strip()))

    except Exception as e:
        print(f"[X] 크롤링 실패: {url} → {e}")

for alt, src in sorted(club_data):
    try:
        safe_name = re.sub(r'[\\/*?:"<>|]', "", alt)

        # ✅ 확장자 판별 (.svg / .png)
        ext = os.path.splitext(src)[-1]
        if not ext or len(ext) > 5:
            ext = '.png'  # fallback

        file_path = os.path.join(save_dir, f"{safe_name}{ext}")

        # 이미지 다운로드
        img_res = requests.get(src, headers=headers)
        img_res.raise_for_status()

        with open(file_path, 'wb') as f:
            f.write(img_res.content)

        print(f"[↓] 저장 완료: {alt} → {file_path}")

    except Exception as e:
        print(f"[X] 저장 실패: {alt} → {e}")