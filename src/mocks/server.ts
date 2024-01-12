import { rest } from 'msw';
// src/mocks/server.ts
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, date: '2024-01-12', amount: 100.00, type: 'Income', details: 'Salary' },
        { id: 2, date: '2024-02-10', amount: 200.00, type: 'Income', details: 'Salary' },
        { id: 3, date: '2024-03-11', amount: 300.00, type: 'Expense', details: 'Salary' },
        { id: 4, date: '2024-04-21', amount: 400.00, type: 'Income', details: 'Salary' },
      ])
    );
  })
);

export { server };
