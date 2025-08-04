import requests
from bs4 import BeautifulSoup

# User-Agent 헤더 설정
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# 시즌별 URL 리스트 (2019-2020 ~ 2025-2026)
urls = [
    f"https://namu.wiki/w/{year}-{year+1}%20%EB%9D%BC%EB%A6%AC%EA%B0%80%20EA%20SPORTS"
    for year in range(2019, 2026)
]

# (alt, src) 쌍 저장용 set
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

        print(f"[✓] {url} 완료")

    except Exception as e:
        print(f"[X] {url} 실패: {e}")

# 결과 출력
print("\n📝 총 구단 수:", len(club_data))
for alt, src in sorted(club_data):
    print(f"구단명: {alt}")
    print(f"이미지 URL: {src}\n")
