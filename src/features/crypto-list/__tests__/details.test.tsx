import { render, screen } from '@/testing/test-utils';
import { Details } from '../routes/details';

const renderAssetDetails = async () => {
  const utils = await render(<Details />, {
    path: '/:assetId',
    url: '/bitcoin',
  });

  return {
    ...utils,
    assetId: /bitcoin/i,
  };
};

describe('Assets Details Page', () => {
  it('should render details page', async () => {
    const { assetId } = await renderAssetDetails();
    expect(screen.getAllByText(assetId).length).toBeGreaterThan(0);
  });
});
