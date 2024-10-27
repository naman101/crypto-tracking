import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@/testing/test-utils';
import { List } from '../routes/list';

describe('Assets List Page', () => {
  it('shows list of assets', async () => {
    await render(<List />);

    //Checks if 6 rows are rendered including the row from the header
    expect((await screen.findAllByRole('row')).length).toBe(6);

    //Check if BTC as a symbol is in the document
    expect(await screen.findByText(/btc/i)).toBeInTheDocument();
  });

  it('allows searching for assets', async () => {
    await render(<List />);

    const searchInput = screen.getByPlaceholderText('Search assets...');
    fireEvent.change(searchInput, { target: { value: 'Bitcoin' } });

    await waitFor(() => {
      expect(screen.getByText('BTC')).toBeInTheDocument();
      expect(screen.queryByText('ETH')).not.toBeInTheDocument();
    });
  });

  it('allows sorting by rank', async () => {
    await render(<List />);

    const rankButton = screen.getByText('Rank');

    // Click to sort ascending
    await userEvent.click(rankButton);
    const firstCell = within(screen.getAllByRole('row')[1]).getAllByRole(
      'cell'
    )[1];

    // Assert the first row after sorting
    expect(firstCell).toHaveTextContent('1'); // First data row

    // Click to sort descending
    await userEvent.click(rankButton);

    waitFor(() => expect(firstCell).toHaveTextContent('5'));
  });

  it('allows sorting by name', async () => {
    await render(<List />);

    const nameButton = screen.getByText('Name');
    const rows = screen.getAllByRole('row');

    await userEvent.click(nameButton);

    expect(rows[1]).toHaveTextContent('Bitcoin');

    await userEvent.click(nameButton);
    waitFor(() => expect(rows[1]).toHaveTextContent('XRP'));
  });
});
