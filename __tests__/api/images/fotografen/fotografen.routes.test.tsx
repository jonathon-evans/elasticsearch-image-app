/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '../../../../src/app/api/images/fotografen/route';
import {
  createElastisearchConnection,
  getUniqueFotografen,
} from '../../../../src/app/utils/elastisearch';

jest.mock('validator');
jest.mock('../../../../src/app/utils/elastisearch');

describe('GET /api/fotografen', () => {
  beforeEach(() => {
    (createElastisearchConnection as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with unique fotografen', async () => {
    const mockDaa = ['Dalton Evans', 'Dalton Evans 2'];
    (getUniqueFotografen as jest.Mock).mockResolvedValueOnce(mockDaa);

    const req = new NextRequest('http://localhost/api/fotografen');
    const response = await GET(req);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual(mockDaa);
  });

  it('should handle errors and return 500', async () => {
    (getUniqueFotografen as jest.Mock).mockRejectedValue(
      new Error('Fetch error')
    );

    const req = new NextRequest('http://localhost/api/fotografen');
    const response = await GET(req);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual({
      message: 'Error fetching unique fotografen',
    });
  });
});
