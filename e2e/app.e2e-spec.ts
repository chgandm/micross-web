import { MicrossWebPage } from './app.po';

describe('micross-web App', function() {
  let page: MicrossWebPage;

  beforeEach(() => {
    page = new MicrossWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
