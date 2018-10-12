import { element, by, ElementFinder } from 'protractor';

export default class WeigthUpdatePage {
  pageTitle: ElementFinder = element(by.id('twentyOnePointsReactApp.weigth.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  timestampInput: ElementFinder = element(by.css('input#weigth-timestamp'));
  weightInput: ElementFinder = element(by.css('input#weigth-weight'));
  userSelect: ElementFinder = element(by.css('select#weigth-user'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTimestampInput(timestamp) {
    await this.timestampInput.sendKeys(timestamp);
  }

  async getTimestampInput() {
    return this.timestampInput.getAttribute('value');
  }

  async setWeightInput(weight) {
    await this.weightInput.sendKeys(weight);
  }

  async getWeightInput() {
    return this.weightInput.getAttribute('value');
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
