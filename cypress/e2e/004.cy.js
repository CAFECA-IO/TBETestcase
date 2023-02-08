describe("TBETC000004_出入金手續費管理", () => {
  beforeEach(() => {
    //登入管理者帳號
    cy.visitTideBit();
    cy.login("appleboycoffeedog@outlook.com", "cr2fbVWg");
    cy.get(".success").should("be.visible"); //檢查成功登入

    //進到入金管理頁面
    cy.visitAnalysis(); //進入/analysis
    cy.get(".admin-header__hamburger").click(); //打開 sidebar
    cy.contains("入金管理").click();
    cy.wait(100);
    cy.contains("入金管理"); //驗證標題文字是否正確
  });

  it("調整 BTC 的入金手續費為 0.01%，再改成 -0.01%", () => {
    //改為 0.01%
    cy.changeFee("BTC", "deposit", "1", "入金手續費", "0.01", "0.01");
    //改為 -0.01% ，負數應無效
    cy.changeFee("BTC", "deposit", "1", "入金手續費", "-0.01", "0.01");
  });

  it("調整 BTC 的出金手續費為 0.05% ，再改成 1099%", () => {
    //改為 0.05%
    cy.changeFee("BTC", "withdraw", "2", "出金手續費", "0.05", "0.05");

    //改為 1099% ，最大值為 50%
    cy.changeFee("BTC", "withdraw", "2", "出金手續費", "1099", "50");
  });

  it("調整 ETH 的入金手續費為 0.24％ ，再改成 -0.24％", () => {
    //改為 0.05%
    cy.changeFee("ETH", "deposit", "1", "入金手續費", "0.24", "0.24");

    //改為 1099% ，最大值為 50%
    cy.changeFee("ETH", "deposit", "1", "入金手續費", "-0.24", "0.24");
  });

  it("調整 ETH 的出金手續費為 0.7％ ，再改成 -30921％", () => {
    //改為 0.7%
    cy.changeFee("ETH", "withdraw", "2", "出金手續費", "0.7", "0.7");

    //改為 -30921%
    cy.changeFee("ETH", "withdraw", "2", "出金手續費", "-30921", "50");
  });

  it("調整 USDT 的入金手續費為 8％，再改成 -8％", () => {
    //改為 8%
    cy.changeFee("USDT", "deposit", "1", "入金手續費", "8", "8");

    //改為 -8%
    cy.changeFee("USDT", "deposit", "1", "入金手續費", "-8", "0");
  });

  it("調整 USDT 的出金手續費為 3.1％，再改成 -3.1％", () => {
    //改為 3.1％
    cy.changeFee("USDT", "withdraw", "2", "出金手續費", "3.1", "3.1");

    //改為 -3.1％"
    cy.changeFee("USDT", "withdraw", "2", "出金手續費", "-3.1", "0.1");
  });
});

// 禁用 Uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});
