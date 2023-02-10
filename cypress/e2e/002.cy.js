const newUser = {
  id: "appleboycoffeedog+0210@outlook.com",
  password: "20230210",
};

describe("TBETC000002_管理權限帳號", () => {
  beforeEach(() => {
    cy.visitTideBit();
  });

  it("確認新帳號無管理權限", () => {
    cy.login(newUser.id, newUser.password);
    cy.visitAnalysis();
    //cy.get("#notistack-snackbar").should("contain", "沒有訪問權限");
    cy.contains("登入"); //驗證新帳號登入失敗，跳轉回登入畫面
  });

  it("用管理者帳號授權 root 權限給新帳號", () => {
    //管理者登入
    cy.login("appleboycoffeedog@outlook.com", "cr2fbVWg");

    //進入管理人員設定
    cy.visitAnalysis();
    cy.enterAdminSettings();

    //新增管理員
    cy.addAdmin(newUser.id);
    cy.wait(1000); //等待一段時間讓資料送出
    cy.get("#notistack-snackbar").should("contain", "修改成功");
    cy.get(".screen__table-row").should("contain", newUser.id); //確認新增成功
  });

  it("用有了 root 權限的新帳號修改後台資料", () => {
    cy.login(newUser.id, newUser.password);
    cy.visitAnalysis();

    //修改交易對顯示
    cy.wait(1000);
    cy.contains("交易對設定"); //驗證標題文字是否正確
    cy.get(".switch__btn").eq(7).dblclick(); //dblclick() => 雙擊
    cy.get("#notistack-snackbar").should("contain", "修改成功"); //確認修改成功

    //修改手續費
    cy.get(".screen__table-rows")
      .contains("LTC/HKD")
      .siblings(".admin-ticker__text")
      .eq(2)
      .children(".screen__table-item--icon")
      .click(); //找到調整手續費的按鈕
    cy.get('input[name="ask-default-fee"]').clear().type("0.3"); //先清空 input 再輸入
    cy.contains("確認").click();
    cy.wait(100); //等待一段時間讓資料送出
    cy.get("#notistack-snackbar").should("contain", "修改成功"); //確認修改成功
  });

  it("將新帳號的 root 權限移除", () => {
    //移除新帳號 root 權限
    cy.login("appleboycoffeedog@outlook.com", "cr2fbVWg");
    cy.visitAnalysis();
    cy.enterAdminSettings();
    cy.get(".screen__table-row").contains(newUser.id).as("newUserRow"); //找到新帳號的位置
    cy.get("@newUserRow").siblings(".user-setting__setting-btn").click(); //點擊齒輪
    cy.get(".editing").contains("Root").click();
    cy.get(".editing").contains("Accountant").click(); //加入 Accountant 權限
    cy.get(".editing").contains("儲存設定").click();
    cy.get("@newUserRow")
      .siblings(".user-setting__roles")
      .should("contain", "Accountant"); //確認有成功加入 Accountant 權限
  });

  it("試著用沒有 root 權限的新帳號修改後台資料", () => {
    cy.login(newUser.id, newUser.password);
    cy.visitAnalysis();

    cy.wait(3000);
    cy.get(".switch__btn").eq(7).dblclick();
    cy.get("#notistack-snackbar").should("contain", "發生錯誤"); //移除 root 權限後應該只能瀏覽而不能更改資料
  });

  it("將使用重複的 Email 新增至管理者權限，然後移除新帳號", () => {
    cy.login("appleboycoffeedog@outlook.com", "cr2fbVWg");
    cy.visitAnalysis();
    cy.enterAdminSettings();

    //加入重複帳號
    cy.wait(1000);
    cy.addAdmin(newUser.id);
    cy.get("#notistack-snackbar").should("contain", "此 Email 已有管理者權限");

    //移除帳號
    cy.get(".screen__table-row").contains(newUser.id).click();
    cy.get(".screen__table-tool-icon").eq(0).click(); //點擊減號
    cy.get(".modal__confirm-btn").click(); //這裡不能用 cy.contains("確認") ，因為 confirm 也有出現"確認"兩個字
  });

  it("用已移除權限的新帳號登入管理介面", () => {
    cy.login(newUser.id, newUser.password);
    cy.visitAnalysis();

    cy.contains("登入"); //驗證新帳號登入失敗，跳轉回登入畫面
  });
});

// 禁用 Uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.log("Cypress detected uncaught exception: ", err);
  return false;
});
