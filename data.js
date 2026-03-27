const initialRestaurants = [
  {
    "name": "진주집",
    "categories": [
      "한식",
      "면요리"
    ],
    "menus": [
      {
        "name": "냉콩국수",
        "price": 15000
      },
      {
        "name": "닭칼국수",
        "price": 11000
      },
      {
        "name": "비빔국수",
        "price": 11000
      }
    ]
  },
  {
    "name": "가양칼국수버섯매운탕",
    "categories": [
      "한식",
      "면요리"
    ],
    "menus": [
      {
        "name": "버섯매운탕 버섯칼국수",
        "price": 13000
      }
    ]
  },
  {
    "name": "희정식당",
    "categories": [
      "한식",
      "분식"
    ],
    "menus": [
      {
        "name": "부대찌개",
        "price": 11000
      },
      {
        "name": "티본스테이크",
        "price": 40000
      }
    ]
  },
  {
    "name": "서궁",
    "categories": [
      "중식"
    ],
    "menus": [
      {
        "name": "탕수육",
        "price": 28000
      },
      {
        "name": "오향장육",
        "price": 32000
      },
      {
        "name": "군만두",
        "price": 9000
      }
    ]
  },
  {
    "name": "가양등촌샤브",
    "categories": [
      "한식",
      "고기"
    ],
    "menus": [
      {
        "name": "샤브세트",
        "price": 16000
      }
    ]
  },
  {
    "name": "슈츠",
    "categories": [
      "양식"
    ],
    "menus": [
      {
        "name": "한우 안심 스테이크",
        "price": 65000
      },
      {
        "name": "문어 샐러드",
        "price": 22000
      }
    ]
  },
  {
    "name": "샐러디 여의도점",
    "categories": [
      "샐러드",
      "패스트푸드"
    ],
    "menus": [
      {
        "name": "탄단지 샐러디",
        "price": 8900
      },
      {
        "name": "멕시칸 랩",
        "price": 6700
      }
    ]
  },
  {
    "name": "카페 마마스",
    "categories": [
      "카페",
      "샐러드",
      "양식"
    ],
    "menus": [
      {
        "name": "리코타치즈 샐러드",
        "price": 15800
      },
      {
        "name": "청포도 주스",
        "price": 6800
      }
    ]
  },
  {
    "name": "바스버거 여의도점",
    "categories": [
      "양식",
      "패스트푸드"
    ],
    "menus": [
      {
        "name": "바스버거",
        "price": 7777
      },
      {
        "name": "치킨버거",
        "price": 8900
      }
    ]
  },
  {
    "name": "별미볶음점",
    "categories": [
      "한식",
      "고기"
    ],
    "menus": [
      {
        "name": "오삼직화",
        "price": 18000
      },
      {
        "name": "제육직화",
        "price": 16000
      },
      {
        "name": "낙지직화",
        "price": 20000
      }
    ]
  },
  {
    "name": "정인면옥",
    "categories": [
      "한식",
      "면요리"
    ],
    "menus": [
      {
        "name": "평양냉면",
        "price": 13000
      },
      {
        "name": "비빔냉면",
        "price": 13000
      },
      {
        "name": "순면",
        "price": 15000
      },
      {
        "name": "만두",
        "price": 11000
      }
    ]
  },
  {
    "name": "청수우동메밀냉면",
    "categories": [
      "일식",
      "면요리"
    ],
    "menus": [
      {
        "name": "메밀국수",
        "price": 11000
      },
      {
        "name": "우동",
        "price": 9000
      },
      {
        "name": "유부초밥",
        "price": 5000
      }
    ]
  },
  {
    "name": "다미",
    "categories": [
      "일식"
    ],
    "menus": [
      {
        "name": "연어구이",
        "price": 16000
      },
      {
        "name": "메로구이",
        "price": 22000
      },
      {
        "name": "고등어구이",
        "price": 12000
      }
    ]
  },
  {
    "name": "오복수산 여의도점",
    "categories": [
      "일식",
      "해산물"
    ],
    "menus": [
      {
        "name": "카이센동",
        "price": 22000
      },
      {
        "name": "특선 카이센동",
        "price": 33000
      },
      {
        "name": "생연어동",
        "price": 18000
      }
    ]
  },
  {
    "name": "창고43 본점",
    "categories": [
      "한식",
      "고기"
    ],
    "menus": [
      {
        "name": "창고스페셜",
        "price": 43000
      },
      {
        "name": "한우명작모듬",
        "price": 49000
      },
      {
        "name": "된장말이",
        "price": 12000
      }
    ]
  },
  {
    "name": "이도맨숀",
    "categories": [
      "한식",
      "고기"
    ],
    "menus": [
      {
        "name": "투뿔 한우 안심",
        "price": 58000
      },
      {
        "name": "이도냉면",
        "price": 12000
      },
      {
        "name": "된장찌개",
        "price": 10000
      }
    ]
  },
  {
    "name": "마호가니커피 여의도점",
    "categories": [
      "카페",
      "베이커리"
    ],
    "menus": [
      {
        "name": "아메리카노",
        "price": 4500
      },
      {
        "name": "크루아상",
        "price": 4200
      },
      {
        "name": "아몬드 크림 콜드브루",
        "price": 6000
      }
    ]
  },
  {
    "name": "버거헌터 여의도IFC몰점",
    "categories": [
      "패스트푸드",
      "양식"
    ],
    "menus": [
      {
        "name": "베이컨 치즈 버거",
        "price": 11500
      },
      {
        "name": "BBQ 버거",
        "price": 10500
      },
      {
        "name": "칠리 치즈 프라이",
        "price": 6000
      }
    ]
  },
  {
    "name": "더현대 서울 호우섬",
    "categories": [
      "중식"
    ],
    "menus": [
      {
        "name": "마늘칩 꿔바육",
        "price": 21000
      },
      {
        "name": "새우 홍콩식 볶음면",
        "price": 16000
      },
      {
        "name": "블랙 하가우",
        "price": 9500
      }
    ]
  },
  {
    "name": "미나리삼겹살",
    "categories": [
      "한식",
      "고기"
    ],
    "menus": [
      {
        "name": "미나리 삼겹살",
        "price": 16000
      },
      {
        "name": "미나리 볶음밥",
        "price": 3000
      }
    ]
  },
  {
    "name": "카페 꼼마",
    "categories": [
      "카페"
    ],
    "menus": [
      {
        "name": "핸드드립 커피",
        "price": 6000
      },
      {
        "name": "카페라떼",
        "price": 5500
      }
    ]
  },
  {
    "name": "푸주옥",
    "categories": [
      "한식",
      "국밥"
    ],
    "menus": [
      {
        "name": "설렁탕",
        "price": 13000
      },
      {
        "name": "도가니탕",
        "price": 21000
      },
      {
        "name": "수육",
        "price": 45000
      }
    ]
  },
  {
    "name": "정우칼국수",
    "categories": [
      "한식",
      "면요리"
    ],
    "menus": [
      {
        "name": "보쌈정식",
        "price": 13000
      },
      {
        "name": "칼국수",
        "price": 9000
      }
    ]
  },
  {
    "name": "동해도 여의도점",
    "categories": [
      "일식"
    ],
    "menus": [
      {
        "name": "회전초밥 무한리필",
        "price": 25800
      },
      {
        "name": "특선초밥 세트",
        "price": 18000
      }
    ]
  }
];