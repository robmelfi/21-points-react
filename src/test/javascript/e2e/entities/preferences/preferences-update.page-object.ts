import { element, by, ElementFinder } from 'protractor';

export default class PreferencesUpdatePage {
  pageTitle: ElementFinder = element(by.id('twentyOnePointsReactApp.preferences.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  weeklyGoalInput: ElementFinder = element(by.css('input#preferences-weeklyGoal'));
  weightUnitsSelect: ElementFinder = element(by.css('select#preferences-weightUnits'));
  userSelect: ElementFinder = element(by.css('select#preferences-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setWeeklyGoalInput(weeklyGoal) {
    await this.weeklyGoalInput.sendKeys(weeklyGoal);
  }

  async getWeeklyGoalInput() {
    return this.weeklyGoalInput.getAttribute('value');
  }

  async setWeightUnitsSelect(weightUnits) {
    await this.weightUnitsSelect.sendKeys(weightUnits);
  }

  async getWeightUnitsSelect() {
    return this.weightUnitsSelect.element(by.css('option:checked')).getText();
  }

  async weightUnitsSelectLastOption() {
    await this.weightUnitsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }
  async userSelectLastOption() {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option) {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect() {
    return this.userSelect;
  }

  async getUserSelectedOption() {
    return this.userSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
