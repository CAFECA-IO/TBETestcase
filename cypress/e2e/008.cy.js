describe("TBETC000008_成交手續費費率調整", () => {
  it("在交易對管理中把 ETH/HKD 的 Ask/Bid 手續費率調整為 0.5% 和 0.7%", () => {
    //登入管理者帳號
    cy.visitTideBit();
    cy.login("appleboycoffeedog@outlook.com", "cr2fbVWg");
    cy.get(".success").should("be.visible"); //檢查成功登入

    //調整 Ask 為 0.5%
    cy.visitAnalysis(); //進入/analysis
    cy.contains("交易對設定"); //驗證標題文字是否正確
    cy.get(".screen__table-rows")
      .contains("ETH/HKD")
      .siblings(".admin-ticker__text")
      .eq(2)
      .as("askFee"); //抓取內容為 "ETH/HKD" 的 DOM 元素，再用 siblings 選擇器找到 ask 手續費的位置，命名為 askFee
    cy.get("@askFee").children(".screen__table-item--icon").click(); //找到調整手續費的按鈕
    cy.get('input[name="ask-default-fee"]').clear().type("0.5"); //先清空 input 再輸入
    cy.contains("確認").click();
    cy.wait(3000); //等待一段時間讓資料送出
    cy.get("@askFee")
      .contains("Default")
      .siblings(".screen__table-item--value")
      .should("have.text", "0.5%"); //檢查修改的 Default 值是否正確

    //調整 Bid 為 0.7%
    cy.get(".screen__table-rows")
      .contains("ETH/HKD")
      .siblings(".admin-ticker__text")
      .eq(3)
      .as("bidFee");
    cy.get("@bidFee").children(".screen__table-item--icon").click(); //找到調整 Bid 手續費的按鈕
    cy.get('input[name="bid-default-fee"]').clear().type("0.7"); //先清空 input 再輸入
    cy.contains("確認").click();
    cy.wait(3000); //等待一段時間讓資料送出
    cy.get("@bidFee")
      .contains("Default")
      .siblings(".screen__table-item--value")
      .should("have.text", "0.7%"); //檢查修改的 Default 值是否正確
  });

  it("建立委託單(a) 10 HKD 賣出 1 ETH", () => {
    //登入
    cy.visitTideBit();
    cy.login("appleboycoffeedog+cypresstest@outlook.com", "abcdABCD");
    cy.get(".success").should("be.visible"); //檢查成功登入

    //進入 ETH/HKD 交易對市場
    cy.get('.tablet > [href="/markets/btcusdt"]')
      .invoke("removeAttr", "target")
      .click(); //由 header 找到交易市場，並以'.invoke("removeAttr", "target")'指令繞過新標籤頁
    cy.selectTicker("HKD", "ETH/HKD"); //選擇 ETH/HKD 交易對
    cy.get(".selectedTicker__text").should("contain", "ETH/HKD"); //檢查是否進入正確的交易對

    //掛出 10 HKD 賣出 1 ETH 委託單
    cy.pendingOrder("sell", "10", "1", "賣出 ETH");
    cy.wait(500);
    cy.get("#notistack-snackbar").should(
      "contain",
      "Ask 1 ETH with for 10 HKD"
    ); //由彈出訊息檢查委託單有沒有正確送出
  });

  it("建立委託單(b) 11 HKD 買入 1 ETH，並確認撮合手續費", () => {
    //登入
    cy.visitTideBit();
    cy.login("appleboycoffeedog+0203@outlook.com", "20230203");
    cy.get(".success").should("be.visible"); //檢查成功登入

    //進入 ETH/HKD 交易對市場
    cy.get('.tablet > [href="/markets/btcusdt"]')
      .invoke("removeAttr", "target")
      .click();
    cy.selectTicker("HKD", "ETH/HKD");
    cy.get(".selectedTicker__text").should("contain", "ETH/HKD"); //檢查是否進入正確的交易對

    //掛出 11 HKD 買入 1 ETH 委託單
    cy.pendingOrder("buy", "11", "1", "買入 ETH");
    cy.wait(500);
    cy.get("#notistack-snackbar").should(
      "contain",
      "Bid 1 ETH with with 11 HKD"
    ); //由彈出訊息檢查委託單有沒有正確送出

    //檢查第一筆委託單
    cy.get('[href="/accounts"]').first().click(); //到「我的帳戶」頁面
    cy.checkFee("1", "10.0 HKD", "10.0 HKD", "0.007 ETH");
  });

  it("確認委託單(a)的撮合手續費", () => {
    cy.visitTideBit();
    cy.login("appleboycoffeedog+cypresstest@outlook.com", "abcdABCD");

    cy.checkFee("1", "10.0 HKD", "1.0 ETH", "0.05 HKD");
  });
});

// 禁用 Uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});
