const fs = require('fs');
const https = require('https');

/**
 * [구글 시트 연동 URL]
 * 본인의 Google Apps Script 배포 URL을 아래 따옴표 사이에 넣으세요.
 */
const GAS_READ_URL = "https://script.google.com/macros/s/AKfycbxAhY853RX00MnNs1zo4obwI2vHfi0rb3_1-PJI5LUrSqx5e4mhdKYJlEOODoq6ZYzd/exec";

if (GAS_READ_URL.includes("여기에")) {
    console.error("❌ 에러: update_data.js 상단의 GAS_READ_URL을 본인 배포 URL로 수정해 주세요!");
    process.exit(1);
}

console.log("📡 구글 시트에서 승인된(Approved) 데이터를 가져오는 중...");

https.get(GAS_READ_URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const approvedRows = JSON.parse(data);

            // 구글 시트 데이터를 정식 데이터(initialRestaurants) 구조로 변환
            const restaurants = approvedRows.map(row => {
                // 시트 컬럼 순서: [ID, 식당명, 카테고리(쉼표), 메뉴정보]
                // ※ 사용자님 시트 탭의 컬럼 순서에 맞춰 조정 필요
                return {
                    name: row[1],
                    categories: row[2] ? row[2].toString().split(',').map(c => c.trim()) : [],
                    menus: row[3] ? parseMenuString(row[3]) : []
                };
            });

            // data.js 파일 생성용 문자열 조립
            const jsContent = `const initialRestaurants = ${JSON.stringify(restaurants, null, 2)};`;

            fs.writeFileSync('data.js', jsContent, 'utf8');
            console.log("✅ 성공! 구글 시트 데이터가 data.js에 성공적으로 반영되었습니다.");
            console.log(`📊 승인된 식당 총: ${restaurants.length}개`);

        } catch (e) {
            console.error("❌ 데이터 파싱 에러:", e.message);
            console.log("응답 받은 원본 데이터:", data);
        }
    });

}).on("error", (err) => {
    console.error("❌ 시트 연결 실패: " + err.message);
});

// "메뉴1:10000, 메뉴2:20000" 형태의 문자열을 객체 배열로 변환
function parseMenuString(str) {
    if (!str) return [];
    return str.split(',').map(item => {
        const [name, price] = item.split(':').map(s => s.trim());
        return { name: name, price: parseInt(price) || 0 };
    });
}
