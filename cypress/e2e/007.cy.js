const newUser = {
  id: "appleboycoffeedog+0217@outlook.com",
  password: "20230217",
};

const referralUser = {
  id: "appleboycoffeedog@outlook.com",
  password: "cr2fbVWg",
};

const dayjs = require("dayjs");

describe("TBETC000007_推薦人交易回饋功能", () => {
  beforeEach(() => {
    cy.visitTideBit();
  });

  it("註冊新帳號，輸入推薦碼，在 BTC/USDT 及 ETH/HKD 交易", () => {
    //註冊新帳號並輸入推薦碼只能手動操作

    //登入
    cy.login(newUser.id, newUser.password);
    cy.get(".success").should("be.visible"); //檢查成功登入

    //在 BTC/USDT 掛市價單
    cy.get('.tablet > [href="/markets/btcusdt"]')
      .invoke("removeAttr", "target")
      .click(); //由 header 找到交易市場，並以'.invoke("removeAttr", "target")'指令繞過新標籤頁
    cy.selectTicker("USDT", "BTC/USDT"); //選擇 BTC/USDT 交易對
    cy.get(".selectedTicker__text").should("contain", "BTC/USDT"); //檢查是否進入正確的交易對
    cy.contains("市價").click();

    //買入 BTC
    cy.pendingMarketOrder("buy", "0.00001"); //掛限價單
    cy.wait(500);
    cy.get("#notistack-snackbar").should("contain", "Bid 0.00001 BTC with"); //由彈出訊息檢查委託單有沒有正確送出

    //賣出 BTC
    cy.pendingMarketOrder("sell", "0.00001");
    cy.wait(500);
    cy.get("#notistack-snackbar").should("contain", "Ask 0.00001 BTC with");

    //在 ETH/HKD 掛限價單，並和自己的掛單撮合
    cy.selectTicker("HKD", "ETH/HKD"); //選擇 ETH/HKD 交易對
    cy.get(".selectedTicker__text").should("contain", "ETH/HKD"); //檢查是否進入正確的交易對
    cy.contains("限價").click();

    //買入 ETH
    cy.pendingLimitOrder("buy", "11", "1");
    cy.wait(500);
    cy.get("#notistack-snackbar").should(
      "contain",
      "Bid 1 ETH with with 11 HKD"
    ); //由彈出訊息檢查委託單有沒有正確送出

    //賣出 ETH
    cy.pendingLimitOrder("sell", "10", "1");
    cy.wait(500);
    cy.get("#notistack-snackbar").should(
      "contain",
      "Ask 1 ETH with for 10 HKD"
    );
  });

  it("登入推薦人帳號，在「立即推薦」檢查獎賞紀錄", () => {
    //登入
    cy.login(referralUser.id, referralUser.password);
    cy.get(".success").should("be.visible");

    //進入立即推薦
    cy.get('.tablet > [href="/referrals"]').click();

    //測試 scroll 是否正常運作
    cy.get("body").scrollIntoView().should("be.visible");

    //檢查推薦用戶及獎賞紀錄
    cy.get(".segment")
      .contains("推薦用戶概況")
      .parents(".segment")
      .find(".list tbody tr")
      .eq(0)
      .should("contain", dayjs().format("YYYY-MM-DD")); //找到推薦用戶概況，驗證推薦用戶的註冊日是否為今天日期
    cy.contains("最新獎賞紀錄")
      .parents(".segment")
      .find(".list tbody tr")
      .eq(0)
      .should("contain", dayjs().format("YYYY-MM-DD")) //找到最新獎賞記錄，驗證今天的回饋是否匯入
      .and("contain", "0.0035 ETH"); //且匯入的獎勵正確
  });
});

// 禁用 Uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});
