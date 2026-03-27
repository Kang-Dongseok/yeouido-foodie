import json
import os

new_restaurants = [
  {
    "name": "별미볶음점",
    "categories": ["한식", "고기"],
    "menus": [
      { "name": "오삼직화", "price": 18000 },
      { "name": "제육직화", "price": 16000 },
      { "name": "낙지직화", "price": 20000 }
    ]
  },
  {
    "name": "정인면옥",
    "categories": ["한식", "면요리"],
    "menus": [
      { "name": "평양냉면", "price": 13000 },
      { "name": "비빔냉면", "price": 13000 },
      { "name": "순면", "price": 15000 },
      { "name": "만두", "price": 11000 }
    ]
  },
  {
    "name": "청수우동메밀냉면",
    "categories": ["일식", "면요리"],
    "menus": [
      { "name": "메밀국수", "price": 11000 },
      { "name": "우동", "price": 9000 },
      { "name": "유부초밥", "price": 5000 }
    ]
  },
  {
    "name": "다미",
    "categories": ["일식"],
    "menus": [
      { "name": "연어구이", "price": 16000 },
      { "name": "메로구이", "price": 22000 },
      { "name": "고등어구이", "price": 12000 }
    ]
  },
  {
    "name": "오복수산 여의도점",
    "categories": ["일식", "해산물"],
    "menus": [
      { "name": "카이센동", "price": 22000 },
      { "name": "특선 카이센동", "price": 33000 },
      { "name": "생연어동", "price": 18000 }
    ]
  },
  {
    "name": "창고43 본점",
    "categories": ["한식", "고기"],
    "menus": [
      { "name": "창고스페셜", "price": 43000 },
      { "name": "한우명작모듬", "price": 49000 },
      { "name": "된장말이", "price": 12000 }
    ]
  },
  {
    "name": "이도맨숀",
    "categories": ["한식", "고기"],
    "menus": [
      { "name": "투뿔 한우 안심", "price": 58000 },
      { "name": "이도냉면", "price": 12000 },
      { "name": "된장찌개", "price": 10000 }
    ]
  },
  {
    "name": "마호가니커피 여의도점",
    "categories": ["카페", "베이커리"],
    "menus": [
      { "name": "아메리카노", "price": 4500 },
      { "name": "크루아상", "price": 4200 },
      { "name": "아몬드 크림 콜드브루", "price": 6000 }
    ]
  },
  {
    "name": "버거헌터 여의도IFC몰점",
    "categories": ["패스트푸드", "양식"],
    "menus": [
      { "name": "베이컨 치즈 버거", "price": 11500 },
      { "name": "BBQ 버거", "price": 10500 },
      { "name": "칠리 치즈 프라이", "price": 6000 }
    ]
  },
  {
    "name": "더현대 서울 호우섬",
    "categories": ["중식"],
    "menus": [
      { "name": "마늘칩 꿔바육", "price": 21000 },
      { "name": "새우 홍콩식 볶음면", "price": 16000 },
      { "name": "블랙 하가우", "price": 9500 }
    ]
  },
  {
    "name": "미나리삼겹살",
    "categories": ["한식", "고기"],
    "menus": [
      { "name": "미나리 삼겹살", "price": 16000 },
      { "name": "미나리 볶음밥", "price": 3000 }
    ]
  },
  {
    "name": "카페 꼼마",
    "categories": ["카페"],
    "menus": [
      { "name": "핸드드립 커피", "price": 6000 },
      { "name": "카페라떼", "price": 5500 }
    ]
  },
  {
    "name": "푸주옥",
    "categories": ["한식", "국밥"],
    "menus": [
      { "name": "설렁탕", "price": 13000 },
      { "name": "도가니탕", "price": 21000 },
      { "name": "수육", "price": 45000 }
    ]
  },
  {
    "name": "정우칼국수",
    "categories": ["한식", "면요리"],
    "menus": [
      { "name": "보쌈정식", "price": 13000 },
      { "name": "칼국수", "price": 9000 }
    ]
  },
  {
    "name": "동해도 여의도점",
    "categories": ["일식"],
    "menus": [
      { "name": "회전초밥 무한리필", "price": 25800 },
      { "name": "특선초밥 세트", "price": 18000 }
    ]
  }
]

def main():
    base_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'restaurants.json')
    try:
        with open(base_data_path, 'r', encoding='utf-8') as f:
            base_restaurants = json.load(f)
    except FileNotFoundError:
        base_restaurants = []

    # 기존 식당에 병합
    existing_names = set([r["name"] for r in base_restaurants])
    
    for nr in new_restaurants:
        if nr["name"] not in existing_names:
            base_restaurants.append(nr)
            
    with open(base_data_path, 'w', encoding='utf-8') as f:
        json.dump(base_restaurants, f, ensure_ascii=False, indent=2)
        
    print(f"✅ {len(new_restaurants)}개의 레전드 여의도 맛집이 DB에 추가되었습니다!")

if __name__ == "__main__":
    main()
