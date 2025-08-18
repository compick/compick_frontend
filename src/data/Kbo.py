import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import os, re, requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

# 저장 디렉토리
base_dir = os.path.dirname(os.path.abspath(__file__))
save_dir = os.path.join(base_dir, '../img/baseballTeam/kbo')
os.makedirs(save_dir, exist_ok=True)
print("📁 저장 디렉토리:", save_dir)

# 타깃 URL
urls = ["https://namu.wiki/w/KBO%20%EB%A6%AC%EA%B7%B8"]

# 정확 매칭할 KBO 10개 구단 (title 값과 동일해야 저장)
KBO_TEAMS = {
    "KIA 타이거즈",
    "삼성 라이온즈",
    "LG 트윈스",
    "두산 베어스",
    "kt wiz",
    "SSG 랜더스",
    "롯데 자이언츠",
    "한화 이글스",
    "NC 다이노스",
    "키움 히어로즈",
}

def sanitize_filename(s: str) -> str:
    return re.sub(r'[\\/*?:"<>|]', "", s)

# Selenium 설정
service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument(f"user-agent={headers['User-Agent']}")
driver = webdriver.Chrome(service=service, options=options)

collected = {}  # title -> svg_url
team_pages = {}  # title -> page_url

for url in urls:
    try:
        print(f"🔎 요청 중: {url}")
        driver.get(url)
        time.sleep(2.0)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # 표의 모든 행을 전역에서 스캔 (섹션 id 의존 X)
        for tr in soup.find_all("tr"):
            # 각 행의 첫 번째/모든 td에서 팀명 앵커 탐색
            tds = tr.find_all("td")
            if not tds:
                continue

            for td in tds:
                a = td.find("a", class_="H3uoeNgK", attrs={"title": True})
                if not a:
                    continue

                title = a.get("title", "").strip()
                if title not in KBO_TEAMS:
                    continue  # 우리가 원하는 정확 팀명만 통과

                # 팀 페이지 URL 수집
                team_page_href = a.get("href")
                if team_page_href and title not in team_pages:
                    team_pages[title] = "https://namu.wiki" + team_page_href

                # 같은 td 내부에서 실제 SVG 로고 찾기 (lazy-load 대응)
                # 나무위키 구조상 실제 로고는 class="QLKJzVbk" 인 두 번째 IMG에 있음
                imgs = td.find_all("img")
                svg_src = None
                for img in imgs:
                    # 우선 data-src, 없으면 src
                    cand = img.get("data-src") or img.get("src") or ""
                    if cand.endswith(".svg"):
                        svg_src = cand
                        break

                if not svg_src:
                    # 혹시 .svg 아닌 경우는 skip
                    continue

                # 프로토콜 보정
                if svg_src.startswith("//"):
                    svg_src = "https:" + svg_src

                if title not in collected:
                    collected[title] = svg_src
                    print(f"    -> ✅ 수집: {title} | {svg_src}")

    except Exception as e:
        print(f"[X] 크롤링 실패: {url} → {e}")

# 세로형 로고 수집
collected_vertical = {}
print("\n--- 세로형 로고 수집 시작 ---")
for title, page_url in team_pages.items():
    try:
        print(f"🔎 세로형 로고 검색 중: {title} ({page_url})")
        driver.get(page_url)
        time.sleep(2.0)

        soup = BeautifulSoup(driver.page_source, "html.parser")

        # "세로형" 텍스트를 포함하는 모든 요소를 찾음
        vertical_text_elements = soup.find_all(string=re.compile("세로형"))
        
        found = False
        for text_element in vertical_text_elements:
            # 해당 텍스트를 포함하는 가장 가까운 table row(tr)를 찾음
            tr = text_element.find_parent("tr")
            if not tr:
                continue

            imgs = tr.find_all("img")
            svg_src = None
            for img in imgs:
                cand = img.get("data-src") or img.get("src") or ""
                if cand.endswith(".svg"):
                    svg_src = cand
                    break
            
            if svg_src:
                if svg_src.startswith("//"):
                    svg_src = "https:" + svg_src
                
                if title not in collected_vertical:
                    collected_vertical[title] = svg_src
                    print(f"    -> ✅ 세로형 수집: {title} | {svg_src}")
                    found = True
                    break
        if not found:
            print(f"    -> ❌ 세로형 로고 없음: {title}")

    except Exception as e:
        print(f"[X] 세로형 로고 크롤링 실패: {title} → {e}")

driver.quit()

# 기본 로고 저장
for title, svg_url in collected.items():
    try:
        safe = sanitize_filename(title) + " 로고"
        path = os.path.join(save_dir, f"{safe}.svg")

        res = requests.get(svg_url, headers=headers, timeout=15)
        res.raise_for_status()

        # 혹시 서버가 svg를 gzip 등으로 줄 수도 있으니 그대로 저장
        with open(path, "wb") as f:
            f.write(res.content)

        print(f"[↓] 저장 완료: {title} → {path}")
    except Exception as e:
        print(f"[X] 저장 실패: {title} → {e}")

# 세로형 로고 저장
print("\n--- 세로형 로고 저장 시작 ---")
if not collected_vertical:
    print("수집된 세로형 로고가 없습니다.")
else:
    for title, svg_url in collected_vertical.items():
        try:
            safe = sanitize_filename(title) + " 로고(세로형)"
            path = os.path.join(save_dir, f"{safe}.svg")

            res = requests.get(svg_url, headers=headers, timeout=15)
            res.raise_for_status()

            with open(path, "wb") as f:
                f.write(res.content)

            print(f"[↓] 저장 완료: {title} (세로형) → {path}")
        except Exception as e:
            print(f"[X] 저장 실패: {title} (세로형) → {e}")
