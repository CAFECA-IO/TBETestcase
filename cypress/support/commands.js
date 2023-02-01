// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// 拜訪 TideBit 首頁
Cypress.Commands.add("visitTideBit", () => {
  cy.visit("https://staging-001.tidebit.network/");
});
// 拜訪 TideBit analysis
Cypress.Commands.add("visitAnalysis", () => {
  cy.visit("https://staging-001.tidebit.network/analysis");
});
// 登入 TideBit
Cypress.Commands.add("login", (id, password) => {
  cy.contains("登入").click();
  cy.get("#identity_email").type(id);
  cy.get("#identity_password").type(password);
  cy.contains("提交").click();
});
// 選擇交易對
Cypress.Commands.add("selectTicker", (currency, tickers) => {
  cy.get(".selectedTicker").trigger("mouseover");
  cy.contains(currency).click();
  cy.contains(tickers).click();
});
// 掛單
Cypress.Commands.add("pendingOrder", (type, price, amount, submit) => {
  cy.get(`.market-trade--${type}`)
    .find('input[name="price"]')
    .first()
    .type(price);
  cy.get(`.market-trade--${type}`)
    .first()
    .find('input[name="amount"]')
    .type(amount);
  cy.contains(submit).click();
});
// testcase 008 檢查委託單的撮合手續費
// 步驟：打開 sidebar -> 交易記錄 -> 成交紀錄 -> 檢查委託單的內容
Cypress.Commands.add("checkFee", (tradeNo, priceText, outText, feeText) => {
  cy.get(".tablet > .sidebar.item").click();
  cy.contains("交易記錄").click();
  cy.contains("成交紀錄").click();
  cy.get(`tbody > :nth-child(${tradeNo}) > :nth-child(4)`).should(
    "contain",
    `${priceText}`
  ); //價格
  cy.get(`tbody > :nth-child(${tradeNo}) > :nth-child(5)`).should(
    "contain",
    `${outText}`
  ); //流出
  cy.get(`:nth-child(${tradeNo}) > :nth-child(7)`).should(
    "contain",
    `${feeText}`
  ); //費用
});
