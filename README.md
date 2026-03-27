# 🥗 Yeouido Foodie (여의도 맛집 가이드)

서울 여의도 지역의 세련된 식당 정보를 제공하고, 사용자로부터 새로운 맛집 제안을 받는 정적 웹 애플리케이션입니다.

## 🛠 기술 스택
- **Frontend**: HTML5, Vanilla CSS (Glassmorphism), Pure JavaScript
- **Deployment**: Vercel (Static Hosting)
- **Database (Mock)**: `restaurants.json` (Local)
- **Backend (Automation)**: Google Sheets + Google Apps Script

## 🚀 워크플로우 (Data Approval Logic)
1. **제안**: 사용자가 웹페이지에서 식당을 제안하면, Google Apps Script(GAS)의 `doPost`가 작동하여 **Google Sheets의 'Pending' 시트**에 저장됩니다.
2. **승인**: 관리자가 수동으로 'Pending' 시트의 데이터를 검토 후 **'Approved' 시트**로 옮깁니다 (혹은 승인 상태 값을 'OK'로 변경).
3. **업데이트**: 관리자가 로컬에서 `node update_data.js`를 실행하면, 'Approved'된 데이터만 `restaurants.json`에 덮어씌워집니다.
4. **배포**: 갱신된 `restaurants.json`을 GitHub에 Push하여 Vercel에서 즉시 반영됩니다.

---

## 📋 Google Apps Script (GAS) 설정 가이드

구글 시트의 [확장 프로그램] -> [Apps Script]를 클릭하고 아래 코드를 붙여넣으세요.

```javascript
/* GAS Code - doPost: 사용자 제안 받기 / doGet: 승인 데이터 조회 */

const SPREADSHEET_ID = '여러분의_구글_시트_아이디';

function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Pending'); // 'Pending' 시트 필요
  
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(), 
    data.restaurant, 
    data.categories, 
    data.menus, 
    'Waiting' // 초기 상태
  ]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Approved'); // 'Approved' 시트 필요
  const data = sheet.getDataRange().getValues();
  
  const headers = data[0]; 
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // restaurants.json 구조에 맞춰 가공
    result.push({
      "name": row[1], // B열: 식당명
      "categories": row[2].split(','), // C열: 카테고리(쉼표 구분)
      "menus": formatMenus(row[3]) // D열: 메뉴데이터 가공
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// 텍스트 메뉴를 객체 배열로 변환하는 헬퍼
function formatMenus(text) {
  return text.split('\n').map(line => {
    const [name, price] = line.split(':');
    return { "name": name.trim(), "price": parseInt(price.replace(/[^0-9]/g, '')) || 0 };
  });
}
```

## ⚙️ 실행 방법
1. 구글 시트에서 'Pending', 'Approved'라는 이름의 시트 두 개를 생성합니다.
2. 위 GAS 코드를 저장하고 '웹 앱'으로 배포(액세스 권한: 모든 사람)합니다.
3. 배포된 URL을 `script.js`의 `GAS_URL`과 `update_data.js`의 `GAS_READ_URL`에 각각 입력합니다.
4. 로컬 테스트: `Index.html`을 브라우저에서 엽니다.

---
© 2024 Yeouido Foodie Guide.
