import requests
from bs4 import BeautifulSoup
import os
import re

# 헤더 설정
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# 저장 폴더 경로
save_dir = '../img/soccerTeam/laligaSpain'
os.makedirs(save_dir, exist_ok=True)

# 시즌별 URL 생성
urls = [
    f"https://namu.wiki/w/{year}-{year+1}%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS"
    for year in range(2019, 2026)
]

# (alt, src) 중복 제거용 set
club_data = set()

for url in urls:
    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        res.encoding = 'utf-8'
        soup = BeautifulSoup(res.text, 'html.parser')

        img_tags = soup.find_all('img', class_='IIlhLQ+O')

        for img in img_tags:
            alt = img.get('alt')
            src = img.get('src')
            if alt and src:
                club_data.add((alt.strip(), src.strip()))

        print(f"[✓] 크롤링 완료: {url}")

    except Exception as e:
        print(f"[X] 크롤링 실패: {url} → {e}")

# 이미지 저장
for alt, src in sorted(club_data):
    try:
        # 파일명 안전하게 변환 (한글 + 특수문자 제거)
        safe_name = re.sub(r'[\\/*?:"<>|]', "", alt)
        file_path = os.path.join(save_dir, f"{safe_name}.png")

        # 이미지 다운로드
        img_res = requests.get(src, headers=headers)
        img_res.raise_for_status()

        with open(file_path, 'wb') as f:
            f.write(img_res.content)

        print(f"[↓] 저장 완료: {alt} → {file_path}")

    except Exception as e:
        print(f"[X] 저장 실패: {alt} → {e}")

print(f"\n✅ 총 {len(club
