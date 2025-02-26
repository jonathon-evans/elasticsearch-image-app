/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET } from '../../../src/app/api/images/route';
import {
  checkImageAvailability,
  createElastisearchConnection,
  search,
} from '../../../src/app/utils/elastisearch';

jest.mock('validator');
jest.mock('../../../src/app/utils/elastisearch');

describe('GET /api/images', () => {
  beforeEach(() => {
    (createElastisearchConnection as jest.Mock).mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with search results', async () => {
    (search as jest.Mock).mockResolvedValueOnce([
      {
        _id: '1',
        _source: {
          bildnummer: '123',
          datum: '2025-02-25',
          suchtext: 'test',
          fotografen: 'greatest phtographer of all time',
          db: 'source1',
        },
      },
    ]);
    (checkImageAvailability as jest.Mock).mockResolvedValue(
      'http://example.com/image.jpg'
    );

    const req = new NextRequest(
      'http://localhost/api/images?searchString=test&page=1&pageSize=20'
    );
    const response = await GET(req);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual([
      {
        id: '1',
        bildnummer: '123',
        datum: '2025-02-25',
        suchtext: 'test',
        fotografen: 'greatest phtographer of all time',
        url: 'http://example.com/image.jpg',
        source: 'source1',
      },
    ]);
  });

  it('should return 404 if no results found', async () => {
    (search as jest.Mock).mockResolvedValueOnce([]);

    const req = new NextRequest(
      'http://localhost/api/images?searchString=test&page=1&pageSize=20'
    );
    const response = await GET(req);
    expect(response.status).toBe(404);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual({
      message: 'Images matching the search not found',
    });
  });

  it('should handle errors and return 500', async () => {
    (search as jest.Mock).mockRejectedValue(new Error('Search error'));

    const req = new NextRequest(
      'http://localhost/api/images?searchString=test&page=1&pageSize=20'
    );
    const response = await GET(req);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse).toEqual({
      message: 'Error fetching images',
    });
  });
});
