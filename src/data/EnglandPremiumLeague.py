import requests
from bs4 import BeautifulSoup
import base64
import os
import re

# ✅ 요청 헤더 설정
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# ✅ 저장 디렉토리 설정
base_dir = os.path.dirname(os.path.abspath(__file__))
save_dir = os.path.join(base_dir, '../img/soccerTeam/epl')
os.makedirs(save_dir, exist_ok=True)
print("📁 저장 디렉토리:", save_dir)

# ✅ 크롤링 대상 URL 목록 (19-20 ~ 24-25 시즌 EPL 문서)
urls = [
    "https://namu.wiki/w/2024-25%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
    "https://namu.wiki/w/2023-24%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
    "https://namu.wiki/w/2022-23%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
    "https://namu.wiki/w/2021-22%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
    "https://namu.wiki/w/2020-21%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
    "https://namu.wiki/w/2019-20%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%96%B4%20%EB%A6%AC%EA%B7%B8",
]

# ✅ 포함 및 제외 키워드 필터
include_keywords = ['FC', 'CF', '클럽', '구단', '로고', '엠블럼']
exclude_keywords = ['국기', '트로피', '라리가', '리그', '심볼', '우승', '배경']

# ✅ 괄호 제거 및 이름 정제 함수
def clean_name(name):
    return re.sub(r"\s*\(.*?\)", "", name).strip()

# ✅ 중복 제거용 딕셔너리 (정제된 이름 기준)
club_data = dict()

# ✅ 크롤링 시작
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
                src = img.get('data-src') or img.get('src')

                if not alt or not src:
                    continue
                if any(word in alt for word in exclude_keywords):
                    continue
                if not any(word in alt for word in include_keywords):
                    continue

                clean_alt = clean_name(alt)
                if clean_alt in club_data:
                    continue  # 중복 제거

                if src.startswith('//'):
                    src = 'https:' + src

                club_data[clean_alt] = (alt.strip(), src.strip())

    except Exception as e:
        print(f"[X] 크롤링 실패: {url} → {e}")

# ✅ 로고 저장 처리
for clean_alt, (alt, src) in sorted(club_data.items()):
    try:
        safe_name = re.sub(r'[\\/*?:"<>|]', "", clean_alt)

        # Base64 이미지 처리
        if src.startswith('data:image'):
            header, b64_data = src.split(',', 1)
            ext = '.svg' if 'svg+xml' in header else '.png'
            file_path = os.path.join(save_dir, f"{safe_name}{ext}")
            with open(file_path, 'wb') as f:
                f.write(base64.b64decode(b64_data))
            print(f"[↓] 저장 완료 (Base64): {alt} → {file_path}")
            continue

        # 외부 링크 이미지 처리
        ext = os.path.splitext(src)[-1]
        if not ext or len(ext) > 5 or '?' in ext:
            ext = '.svg' if '.svg' in src else '.png'

        file_path = os.path.join(save_dir, f"{safe_name}{ext}")
        img_res = requests.get(src, headers=headers)
        img_res.raise_for_status()
        content = img_res.content

        # SVG 유효성 검사
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
