import requests
from bs4 import BeautifulSoup
import base64
import os
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# 저장 디렉토리 설정
base_dir = os.path.dirname(os.path.abspath(__file__))
save_dir = os.path.join(base_dir, '../img/soccerTeam/laligaSpain')
os.makedirs(save_dir, exist_ok=True)
print("📁 저장 디렉토리:", save_dir)

# 크롤링할 URL 목록
urls = [
    "https://namu.wiki/w/2025-26%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",
    "https://namu.wiki/w/2024-25%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",
    "https://namu.wiki/w/2023-24%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",
    "https://namu.wiki/w/2021-22%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",
    "https://namu.wiki/w/2020-21%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",
    "https://namu.wiki/w/2019-20%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS",

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
                src = img.get('data-src') or img.get('src')  # ✅ 중요 포인트!

                if alt and "국기" in alt:
                    continue

                if src and src.startswith('//'):
                    src = 'https:' + src

                if alt and src:
                    club_data.add((alt.strip(), src.strip()))
                keywords = ['FC', 'CF', '클럽', '구단', '로고', '엠블럼']

                if alt and not any(keyword in alt for keyword in keywords):
                    continue


    except Exception as e:
        print(f"[X] 크롤링 실패: {url} → {e}")

for alt, src in sorted(club_data):
    try:
        safe_name = re.sub(r'[\\/*?:"<>|]', "", alt)

        # Base64 이미지
        if src.startswith('data:image'):
            header, b64_data = src.split(',', 1)
            ext = '.svg' if 'svg+xml' in header else '.png'
            file_path = os.path.join(save_dir, f"{safe_name}{ext}")

            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(b64_data))
            print(f"[↓] 저장 완료 (Base64): {alt} → {file_path}")
            continue

        # 일반 URL 이미지
        if src.startswith('//'):
            src = 'https:' + src

        ext = os.path.splitext(src)[-1]
        if not ext or len(ext) > 5 or '?' in ext:
            ext = '.svg' if '.svg' in src else '.png'
        file_path = os.path.join(save_dir, f"{safe_name}{ext}")

        img_res = requests.get(src, headers=headers)
        img_res.raise_for_status()

        content = img_res.content

        # SVG 내용 분석 (빈 파일 또는 <use>만 있는 경우 경고)
        if ext == '.svg' and b'<svg' in content:
            text = content.decode("utf-8", errors="ignore")
            if '<use' in text and 'xlink:href' in text:
                print(f"⚠️ SVG는 외부 <use> 참조만 포함 (렌더링 불가 가능성): {alt}")
            elif len(text.strip()) < 50:
                print(f"⚠️ SVG 내용이 거의 없음: {alt}")

        with open(file_path, 'wb') as f:
            f.write(content)

        print(f"[↓] 저장 완료: {alt} → {file_path}")

    except Exception as e:
        print(f"[X] 저장 실패: {alt} → {e}")
