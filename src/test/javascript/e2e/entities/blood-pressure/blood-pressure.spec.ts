/* tslint:disable no-unused-expression */
import { browser, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import BloodPressureComponentsPage from './blood-pressure.page-object';
import { BloodPressureDeleteDialog } from './blood-pressure.page-object';
import BloodPressureUpdatePage from './blood-pressure-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('BloodPressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  /*let bloodPressureDeleteDialog: BloodPressureDeleteDialog;*/

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

  it('should load BloodPressures', async () => {
    await navBarPage.getEntityPage('blood-pressure');
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    expect(await bloodPressureComponentsPage.getTitle().getText()).to.match(/Blood Pressures/);
  });

  it('should load create BloodPressure page', async () => {
    await bloodPressureComponentsPage.clickOnCreateButton();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    expect(await bloodPressureUpdatePage.getPageTitle().getText()).to.match(/Create or edit a BloodPressure/);
  });

  /* it('should create and save BloodPressures', async () => {
        const nbButtonsBeforeCreate = await bloodPressureComponentsPage.countDeleteButtons();

        await bloodPressureUpdatePage.setTimestampInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await bloodPressureUpdatePage.getTimestampInput()).to.contain('2001-01-01T02:30');
        await bloodPressureUpdatePage.setSystolicInput('5');
        expect(await bloodPressureUpdatePage.getSystolicInput()).to.eq('5');
        await bloodPressureUpdatePage.setDiastolicInput('5');
        expect(await bloodPressureUpdatePage.getDiastolicInput()).to.eq('5');
        await bloodPressureUpdatePage.userSelectLastOption();
        await waitUntilDisplayed(bloodPressureUpdatePage.getSaveButton());
        await bloodPressureUpdatePage.save();
        await waitUntilHidden(bloodPressureUpdatePage.getSaveButton());
        expect(await bloodPressureUpdatePage.getSaveButton().isPresent()).to.be.false;

        await bloodPressureComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
        expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });*/

  /* it('should delete last BloodPressure', async () => {
        await bloodPressureComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeDelete = await bloodPressureComponentsPage.countDeleteButtons();
        await bloodPressureComponentsPage.clickOnLastDeleteButton();

        bloodPressureDeleteDialog = new BloodPressureDeleteDialog();
        expect(await bloodPressureDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/twentyOnePointsReactApp.bloodPressure.delete.question/);
        await bloodPressureDeleteDialog.clickOnConfirmButton();

        await bloodPressureComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
        expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
