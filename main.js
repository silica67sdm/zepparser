
const companyImg = {
  floor: {
    pos: { x: 17, y: 11 },
    dir: "Zep%209382d71e35cd4b56b818a5001fc92922/search.pstatic-2.jpg",
  },
  wallLeft: {
    pos: { x: 6, y: 1 },
    dir: "Zep%209382d71e35cd4b56b818a5001fc92922/Company_Introduction_220714-25.png",
  },
  wallRight: {
    pos: { x: 34, y: 1 },
    dir: "Zep%209382d71e35cd4b56b818a5001fc92922/Company_Introduction_220714-26.png",
  },
};

function generateImgObj(loc) {
  return App.loadSpritesheet(companyImg[loc].dir);
}

function attachImgObjToMap(loc) {
  Map.putObject(
    companyImg[loc].pos.x,
    companyImg[loc].pos.y,
    generateImgObj(loc),
    {
      overlap: true,
    }
  );
}

function customPopupEffect(x, y, effectType, link) {
  Map.putTileEffect(x, y, effectType, {
    link: link,
    align2: "popup",
    triggerByTouch: true,
  });
}

function customWebProtalEffect(x, y, effectType, link) {
  Map.putTileEffect(x, y, effectType, {
    link: link,
    invisible: false,
  });
}

// 최초의 사용자가 입장했을 때만 실행되도록
let tileEffectOn = false;

App.onJoinPlayer.Add(function (player) {
  // 해당하는 모든 플레이어가 이 이벤트를 통해 App에 입장

  // 기업 이미지들 맵에 부착
  attachImgObjToMap("floor");
  attachImgObjToMap("wallLeft");
  attachImgObjToMap("wallRight");
  // attachImgObjToMap("youtube");

  if (!tileEffectOn) {
    tileEffectOn = true;

    // 채용 공고 (pop up)
    customPopupEffect(
      11,
      8,
      TileEffectType.EMBED,
      "https://careers.supercat.co.kr/home"
    );
    // 회사 유튜브 영상 (pop up)
    customPopupEffect(
      25,
      8,
      TileEffectType.EMBED,
      "https://youtu.be/MMnn78lBs9Y"
    );
    // 회사 홈페이지 (새 창, 상호작용 필수)
    customWebProtalEffect(39, 8, TileEffectType.WEB_PORTAL, "https://zep.us/");
  }
});

