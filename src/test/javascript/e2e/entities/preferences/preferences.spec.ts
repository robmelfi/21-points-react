/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PreferencesComponentsPage from './preferences.page-object';
import { PreferencesDeleteDialog } from './preferences.page-object';
import PreferencesUpdatePage from './preferences-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Preferences e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let preferencesUpdatePage: PreferencesUpdatePage;
  let preferencesComponentsPage: PreferencesComponentsPage;
  let preferencesDeleteDialog: PreferencesDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();

    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Preferences', async () => {
    await navBarPage.getEntityPage('preferences');
    preferencesComponentsPage = new PreferencesComponentsPage();
    expect(await preferencesComponentsPage.getTitle().getText()).to.match(/Preferences/);
  });

  it('should load create Preferences page', async () => {
    await preferencesComponentsPage.clickOnCreateButton();
    preferencesUpdatePage = new PreferencesUpdatePage();
    expect(await preferencesUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Preferences/);
  });

  it('should create and save Preferences', async () => {
    const nbButtonsBeforeCreate = await preferencesComponentsPage.countDeleteButtons();

    await preferencesUpdatePage.setWeeklyGoalInput('5');
    expect(await preferencesUpdatePage.getWeeklyGoalInput()).to.eq('5');
    await preferencesUpdatePage.weightUnitsSelectLastOption();
    await preferencesUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(preferencesUpdatePage.getSaveButton());
    await preferencesUpdatePage.save();
    await waitUntilHidden(preferencesUpdatePage.getSaveButton());
    expect(await preferencesUpdatePage.getSaveButton().isPresent()).to.be.false;

    await preferencesComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await preferencesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Preferences', async () => {
    await preferencesComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await preferencesComponentsPage.countDeleteButtons();
    await preferencesComponentsPage.clickOnLastDeleteButton();

    preferencesDeleteDialog = new PreferencesDeleteDialog();
    expect(await preferencesDeleteDialog.getDialogTitle().getAttribute('id')).to.match(
      /twentyOnePointsReactApp.preferences.delete.question/
    );
    await preferencesDeleteDialog.clickOnConfirmButton();

    await preferencesComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await preferencesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
