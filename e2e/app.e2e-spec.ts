import { RefarchCaseportalAppPage } from './app.po';

describe('refarch-caseportal-app App', () => {
  let page: RefarchCaseportalAppPage;

  beforeEach(() => {
    page = new RefarchCaseportalAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
