/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PointsComponentsPage from './points.page-object';
import { PointsDeleteDialog } from './points.page-object';
import PointsUpdatePage from './points-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Points e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let pointsUpdatePage: PointsUpdatePage;
  let pointsComponentsPage: PointsComponentsPage;
  /*let pointsDeleteDialog: PointsDeleteDialog;*/

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

  it('should load Points', async () => {
    await navBarPage.getEntityPage('points');
    pointsComponentsPage = new PointsComponentsPage();
    expect(await pointsComponentsPage.getTitle().getText()).to.match(/Points/);
  });

  it('should load create Points page', async () => {
    await pointsComponentsPage.clickOnCreateButton();
    pointsUpdatePage = new PointsUpdatePage();
    expect(await pointsUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Points/);
  });

  /* it('should create and save Points', async () => {
        const nbButtonsBeforeCreate = await pointsComponentsPage.countDeleteButtons();

        await pointsUpdatePage.setDateInput('01-01-2001');
        expect(await pointsUpdatePage.getDateInput()).to.eq('2001-01-01');
        await pointsUpdatePage.setExcerciseInput('5');
        expect(await pointsUpdatePage.getExcerciseInput()).to.eq('5');
        await pointsUpdatePage.setMealsInput('5');
        expect(await pointsUpdatePage.getMealsInput()).to.eq('5');
        await pointsUpdatePage.setAlcoholInput('5');
        expect(await pointsUpdatePage.getAlcoholInput()).to.eq('5');
        await pointsUpdatePage.setNotesInput('notes');
        expect(await pointsUpdatePage.getNotesInput()).to.match(/notes/);
        await pointsUpdatePage.userSelectLastOption();
        await waitUntilDisplayed(pointsUpdatePage.getSaveButton());
        await pointsUpdatePage.save();
        await waitUntilHidden(pointsUpdatePage.getSaveButton());
        expect(await pointsUpdatePage.getSaveButton().isPresent()).to.be.false;

        await pointsComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
        expect(await pointsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });*/

  /* it('should delete last Points', async () => {
        await pointsComponentsPage.waitUntilLoaded();
        const nbButtonsBeforeDelete = await pointsComponentsPage.countDeleteButtons();
        await pointsComponentsPage.clickOnLastDeleteButton();

        pointsDeleteDialog = new PointsDeleteDialog();
        expect(await pointsDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/twentyOnePointsReactApp.points.delete.question/);
        await pointsDeleteDialog.clickOnConfirmButton();

        await pointsComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
        expect(await pointsComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });*/

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
