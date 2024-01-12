import {
  http,
  HttpResponse,
} from 'msw';

const handlers = [
    http.get('/api/transactions', ({ request, params, cookies }) => {
        return HttpResponse.json([
            { id: 1, date: '2024-01-12', amount: 100.00, type: 'Income', details: 'Salary' },
            // Добавьте другие транзакции
        ])
    }),
];

export { handlers };
