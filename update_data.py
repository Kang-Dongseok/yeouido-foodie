import urllib.request
import json
import os

GAS_READ_URL = "https://script.google.com/macros/s/AKfycbzwgyfys_-4DQnzVHn_MQ0gn9N6sF0kp8RS4X4wbEXZt0jXrS55L47ckjbTsR-sQlXq/exec"

def parse_menu_string(menu_str):
    if not menu_str:
        return []
    result = []
    items = menu_str.split(',')
    for item in items:
        if ':' in item:
            name, price = item.split(':', 1)
            name = name.strip()
            try:
                price_val = int(price.strip())
            except ValueError:
                price_val = 0
            result.append({"name": name, "price": price_val})
        else:
            result.append({"name": item.strip(), "price": 0})
    return result

def main():
    print("[진행 중] 기존 데이터(restaurants.json)와 구글 시트 데이터를 병합합니다...")
    
    # 1. 기존 식당 데이터(\`restaurants.json\`) 불러오기
    base_data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'restaurants.json')
    try:
        with open(base_data_path, 'r', encoding='utf-8') as f:
            base_restaurants = json.load(f)
    except FileNotFoundError:
        base_restaurants = []
        
    # 식당 이름을 키(key)로 하는 딕셔너리로 변환하여 중복 검사를 쉽게 함
    rest_dict = { r["name"]: r for r in base_restaurants }

    try:
        # 2. 구글 시트(Approved) 데이터 불러오기
        req = urllib.request.Request(GAS_READ_URL)
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            
        data_obj = json.loads(data)
        
        # 구버전(리스트 형태) 응답이 날아오면 경고 띄우기
        if isinstance(data_obj, list):
            print("❌ 구글 시트 Apps Script 코드가 아직 업데이트되지 않았습니다!")
            print("   안내에 따라 Apps Script를 수정하고 [새 버전 배포]를 먼저 진행해 주세요.")
            return

        rest_rows = data_obj.get("restaurants", [])
        menu_rows = data_obj.get("menus", [])
        
        new_rest_count = 0
        added_menu_count = 0
        updated_price_count = 0
        added_category_count = 0

        # === 1. 식당 추가 로직 (Approved_식당) ===
        # A열(row[0]): 식당명, B열(row[1]): 카테고리
        for row in rest_rows:
            if len(row) == 0: continue
            name = str(row[0]).strip()
            if not name: continue
                
            categories_str = str(row[1]) if len(row) > 1 and row[1] else ""
            categories = [c.strip() for c in categories_str.split(',')] if categories_str else []
            
            if name in rest_dict:
                existing = rest_dict[name]
                existing_cats = set(existing.get("categories", []))
                for c in categories:
                    if c not in existing_cats:
                        existing["categories"].append(c)
                        existing_cats.add(c)
                        added_category_count += 1
            else:
                rest_dict[name] = {
                    "name": name,
                    "categories": categories,
                    "menus": []
                }
                new_rest_count += 1

        # === 2. 메뉴 추가 로직 (Approved_메뉴) ===
        # A열(row[0]): 식당명, B열(row[1]): 메뉴명, C열(row[2]): 가격
        for row in menu_rows:
            if len(row) < 2: continue 
            name = str(row[0]).strip()
            
            # 사용자 요구사항: "식당명이 기존에 존재하는게 없으면 그 메뉴는 무시"
            if not name or name not in rest_dict:
                continue
                
            menu_name = str(row[1]).strip()
            if not menu_name: continue
                
            price_str = str(row[2]) if len(row) > 2 and row[2] else "0"
            try:
                price_val = int(str(price_str).replace(',', '').strip())
            except ValueError:
                price_val = 0
                
            existing_menus = rest_dict[name].get("menus", [])
            
            found = False
            for em in existing_menus:
                if em["name"] == menu_name:
                    found = True
                    # 가격이 다르면 업데이트
                    if em["price"] != price_val:
                        em["price"] = price_val
                        updated_price_count += 1
                    break
            
            if not found:
                existing_menus.append({"name": menu_name, "price": price_val})
                added_menu_count += 1
                
            rest_dict[name]["menus"] = existing_menus

        # 3. 영구 저장소(restaurants.json)와 웹 적용 파일(data.js) 모두 업데이트
        final_restaurants = list(rest_dict.values())
        
        # restaurants.json 덮어쓰기 (DB 역할)
        with open(base_data_path, 'w', encoding='utf-8') as f:
            json.dump(final_restaurants, f, ensure_ascii=False, indent=2)
            
        # data.js 덮어쓰기 (웹 화면 역할)
        js_content = f"const initialRestaurants = {json.dumps(final_restaurants, ensure_ascii=False, indent=2)};"
        data_js_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.js')
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print("[성공] 모든 데이터가 최신 상태로 DB와 웹에 업데이트되었습니다.")
        print(f"       + 새로 추가된 식당: {new_rest_count}개")
        print(f"       + 새로 추가된 카테고리: {added_category_count}개")
        print(f"       + 새로 추가된 메뉴: {added_menu_count}개")
        print(f"       * 가격이 업데이트된 메뉴: {updated_price_count}개")
        print(f"       = 총 보유 식당 수 : {len(final_restaurants)}개")
    except Exception as e:
        print(f"[오류] 발생: {str(e)}")

if __name__ == "__main__":
    main()
