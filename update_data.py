import urllib.request
import json
import os

GAS_READ_URL = "https://script.google.com/macros/s/AKfycbxAhY853RX00MnNs1zo4obwI2vHfi0rb3_1-PJI5LUrSqx5e4mhdKYJlEOODoq6ZYzd/exec"

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
            
        approved_rows = json.loads(data)
        
        new_rest_count = 0
        added_menu_count = 0

        for row in approved_rows:
            # 사용자가 A열에 ID(번호)를 넣었으므로 컬럼 순서 조정
            if len(row) < 2: continue
            
            # B열(row[1]): 식당명
            name = str(row[1]).strip()
            if not name: continue
                
            # C열(row[2]): 카테고리 (쉼표 구분)
            categories_str = str(row[2]) if len(row) > 2 and row[2] else ""
            categories = [c.strip() for c in categories_str.split(',')] if categories_str else []
            
            # D열(row[3]): 메뉴 (생략 가능)
            menu_str = str(row[3]) if len(row) > 3 and row[3] else ""
            new_menus = parse_menu_string(menu_str)
            
            # 여기서부터 병합(Merge) 마법 시작!
            if name in rest_dict:
                # [기존에 있는 식당인 경우]
                existing_menus = rest_dict[name].get("menus", [])
                existing_menu_names = [m["name"] for m in existing_menus]
                
                # 중복되지 않는 새 메뉴만 추가
                for nm in new_menus:
                    if nm["name"] not in existing_menu_names:
                        existing_menus.append(nm)
                        added_menu_count += 1
                
                rest_dict[name]["menus"] = existing_menus
            else:
                # [완전히 새로운 식당인 경우]
                rest_dict[name] = {
                    "name": name,
                    "categories": categories,
                    "menus": new_menus
                }
                new_rest_count += 1

        # 다시 리스트로 변환
        final_restaurants = list(rest_dict.values())
            
        js_content = f"const initialRestaurants = {json.dumps(final_restaurants, ensure_ascii=False, indent=2)};"

        
        data_js_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.js')
        with open(data_js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        print("[성공] data.js가 최신 상태로 업데이트되었습니다.")
        print(f"       + 새로 추가된 식당: {new_rest_count}개")
        print(f"       + 새로 추가된 메뉴: {added_menu_count}개")
        print(f"       = 총 보유 식당 수 : {len(final_restaurants)}개")
    except Exception as e:
        print(f"[오류] 발생: {str(e)}")

if __name__ == "__main__":
    main()
