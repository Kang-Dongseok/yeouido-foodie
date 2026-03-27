/**
 * [구글 시트 연동 URL]
 * 본인의 Google Apps Script 배포 URL을 아래 따옴표 사이에 넣으세요.
 */
const GAS_URL = "https://script.google.com/macros/s/AKfycbxAhY853RX00MnNs1zo4obwI2vHfi0rb3_1-PJI5LUrSqx5e4mhdKYJlEOODoq6ZYzd/exec";

document.addEventListener('DOMContentLoaded', () => {
    // '전체'를 맨 앞에 추가
    const categories = ["전체", "한식", "중식", "일식", "양식", "패스트푸드", "분식", "카페", "면요리", "고기", "샐러드"];
    let restaurants = [];
    let activeFilters = new Set(); // 여기에 '전체'는 저장하지 않고 비어있으면 전체로 간주

    // Multi Price Filter State
    let minPriceVal = 0;
    let maxPriceVal = 100000;

    const filterContainer = document.getElementById('filterContainer');
    const restaurantGrid = document.getElementById('restaurantGrid');
    const modalCategories = document.getElementById('modalCategories');
    const suggestModal = document.getElementById('suggestModal');
    const menuModal = document.getElementById('menuModal');

    const suggestForm = document.getElementById('suggestForm');
    const menuSuggestForm = document.getElementById('menuSuggestForm');

    const rangeInputs = document.querySelectorAll('.range-input input');
    const priceDisplay = document.getElementById('priceDisplay');
    const sliderTrack = document.getElementById('sliderTrack');

    // 1. Initialize Categories
    const initCategories = () => {
        categories.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            if (cat === "전체") btn.classList.add('active'); // 초기 활성화
            btn.textContent = cat;
            btn.onclick = () => toggleFilter(cat, btn);
            filterContainer.appendChild(btn);

            // 식당 제안 모달에는 '전체'가 필요 없음
            if (cat !== "전체") {
                const wrap = document.createElement('div');
                wrap.className = 'cat-check-item';
                const id = `cat-${index}`;
                wrap.innerHTML = `
                    <input type="checkbox" name="category" value="${cat}" id="${id}">
                    <label for="${id}" class="cat-check-label">${cat}</label>
                `;
                modalCategories.appendChild(wrap);
            }
        });
    };

    // 2. Data Load & Dual Slider Init
    const fetchData = () => {
        try {
            if (typeof initialRestaurants !== 'undefined') {
                restaurants = initialRestaurants;
                renderRestaurants();
            } else {
                throw new Error('data.js 로드 실패');
            }
        } catch (error) {
            console.error('Data load error:', error);
            restaurantGrid.innerHTML = `<div style="text-align:center; grid-column:1/-1;">데이터를 불러오는 중 오류가 발생했습니다.</div>`;
        }
    };

    // Update Dual Range UI
    const updateSlider = () => {
        const minPercent = (minPriceVal / 100000) * 100;
        const maxPercent = (maxPriceVal / 100000) * 100;
        sliderTrack.style.background = `linear-gradient(to right, #e2e8f0 ${minPercent}%, var(--primary) ${minPercent}%, var(--primary) ${maxPercent}%, #e2e8f0 ${maxPercent}%)`;
        priceDisplay.textContent = `${minPriceVal.toLocaleString()}원 ~ ${maxPriceVal === 100000 ? '100,000원+' : maxPriceVal.toLocaleString() + '원'}`;
    };

    rangeInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let minVal = parseInt(rangeInputs[0].value);
            let maxVal = parseInt(rangeInputs[1].value);

            if (maxVal - minVal < 5000) {
                if (e.target.className === 'min-range') rangeInputs[0].value = maxVal - 5000;
                else rangeInputs[1].value = minVal + 5000;
            } else {
                minPriceVal = minVal;
                maxPriceVal = maxVal;
                updateSlider();
                renderRestaurants();
            }
        });
    });

    // 3. Smart Filter Logic
    const toggleFilter = (cat, btn) => {
        const allBtn = filterContainer.querySelector('.filter-btn:first-child');

        if (cat === "전체") {
            // '전체' 클릭 시 다른 모든 필터 해제
            activeFilters.clear();
            const allFilterBtns = filterContainer.querySelectorAll('.filter-btn');
            allFilterBtns.forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');
        } else {
            // 다른 카테고리 클릭 시 '전체' 버튼 비활성화
            allBtn.classList.remove('active');
            if (activeFilters.has(cat)) {
                activeFilters.delete(cat);
                btn.classList.remove('active');
            } else {
                activeFilters.add(cat);
                btn.classList.add('active');
            }

            // 만약 아무것도 선택되지 않았다면 다시 '전체' 활성화
            if (activeFilters.size === 0) {
                allBtn.classList.add('active');
            }
        }
        renderRestaurants();
    };

    // 4. Render Grid
    const renderRestaurants = () => {
        restaurantGrid.innerHTML = '';

        let filtered = restaurants.filter(res => {
            const catMatch = activeFilters.size === 0 || res.categories.some(c => activeFilters.has(c));
            const priceMatch = res.menus.some(m => {
                const p = m.price || 0;
                // If max slider is at 100k, we don't cap the upper bound
                return p >= minPriceVal && (maxPriceVal === 100000 ? true : p <= maxPriceVal);
            });
            return catMatch && priceMatch;
        });

        // 결과 카운트 업데이트
        const resultsCountEl = document.getElementById('resultsCount');
        if (resultsCountEl) {
            resultsCountEl.textContent = `검색된 식당: ${filtered.length}개`;
        }

        if (filtered.length === 0) {
            restaurantGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding: 4rem; color: var(--text-muted); font-weight: 500;">조건에 맞는 식당이 없습니다. 🥗</p>';
            return;
        }

        filtered.forEach((res, resIdx) => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';

            const tags = res.categories.map(c => `<span class="tag">${c}</span>`).join('');
            const hasManyMenus = res.menus.length > 5;
            const menuHtml = res.menus.map(m => `
                <li class="menu-item">
                    <span>${m.name}</span>
                    <strong style="color: var(--text-main); font-weight: 700;">${m.price ? m.price.toLocaleString() + '원' : '가격 미정'}</strong>
                </li>
            `).join('');

            const menuListId = `menu-list-${resIdx}`;

            card.innerHTML = `
                <div class="category-tags">${tags}</div>
                <h3>${res.name}</h3>
                <ul class="menu-list ${hasManyMenus ? 'collapsed' : ''}" id="${menuListId}">
                    ${menuHtml}
                </ul>
                ${hasManyMenus ? `<button class="toggle-menu-btn" onclick="toggleMenu('${menuListId}', this)">+ 메뉴 더 보기</button>` : ''}
                <button class="suggest-menu-btn" onclick="openMenuModal('${res.name}')">+ 새로운 메뉴 제안</button>
            `;
            restaurantGrid.appendChild(card);
        });
    };

    window.toggleMenu = (id, btn) => {
        const list = document.getElementById(id);
        const isCollapsed = list.classList.toggle('collapsed');
        btn.textContent = isCollapsed ? '+ 메뉴 더 보기' : '- 메뉴 접기';
    };

    window.openMenuModal = (resName) => {
        document.getElementById('menuModalTitle').textContent = `${resName} - 메뉴 제안`;
        document.getElementById('targetRestaurant').value = resName;
        menuModal.style.display = 'flex';
    };

    document.getElementById('openSuggestModal').onclick = () => suggestModal.style.display = 'flex';
    document.getElementById('closeModal').onclick = () => suggestModal.style.display = 'none';
    document.getElementById('closeMenuModal').onclick = () => menuModal.style.display = 'none';

    window.onclick = (e) => {
        if (e.target === suggestModal) suggestModal.style.display = 'none';
        if (e.target === menuModal) menuModal.style.display = 'none';
    };

    const menuPriceInput = document.getElementById('newMenuPrice');
    menuPriceInput.oninput = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 1 && val.startsWith('0')) val = val.replace(/^0+/, '');
        if (val === '0') val = '';
        e.target.value = val;
    };

    // Unified API Sender (CORS 대응 및 디버깅 강화 버전)
    const sendToGAS = async (data) => {
        if (GAS_URL.includes("여기에_배포_URL_입력")) {
            alert("관리자 연동이 되어 있지 않습니다. 주소를 다시 확인하세요.");
            return;
        }

        try {
            // mode: 'no-cors'를 추가하여 브라우저의 전송 차단을 방지합니다.
            await fetch(GAS_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(data)
            });

            // no-cors 모드에서는 성공 응답을 직접 확인할 수 없으나 전송은 완료됩니다.
            alert("제안이 전달되었습니다! 구글 시트를 확인해 보세요.");
        } catch (err) {
            console.error("전송 에러 상세:", err);
            alert("연결에 실패했습니다. 다음을 확인하세요:\n1. GAS 배포 시 '모든 사용자'로 설정했는지\n2. 인터넷 연결 상태");
        }
    };

    suggestForm.onsubmit = (e) => {
        e.preventDefault();
        const data = {
            type: "식당",
            restaurant: new FormData(suggestForm).get('name'),
            categories: Array.from(new FormData(suggestForm).getAll('category')).join(',')
        };
        sendToGAS(data);
        suggestModal.style.display = 'none';
        suggestForm.reset();
    };

    menuSuggestForm.onsubmit = (e) => {
        e.preventDefault();
        const data = {
            type: "메뉴",
            restaurant: new FormData(menuSuggestForm).get('target'),
            menuName: new FormData(menuSuggestForm).get('menuName'),
            price: new FormData(menuSuggestForm).get('menuPrice')
        };
        sendToGAS(data);
        menuModal.style.display = 'none';
        menuSuggestForm.reset();
    };

    initCategories();
    fetchData();
    updateSlider();
});
