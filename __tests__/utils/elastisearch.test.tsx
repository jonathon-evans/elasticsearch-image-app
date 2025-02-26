/**
 * @jest-environment node
 */

import { Client } from '@elastic/elasticsearch';
import {
  createElastisearchConnection,
  checkImageAvailability,
  search,
  getUniqueFotografen,
} from '../../src/app/utils/elastisearch';

jest.mock('@elastic/elasticsearch');

describe('elastisearch utils', () => {
  describe('createElastisearchConnection tests', () => {
    it('should create an Elasticsearch client with the correct options', () => {
      process.env.ELASTICSEARCH_URL = 'http://localhost:9200';
      process.env.ELASTICSEARCH_USERNAME = 'user';
      process.env.ELASTICSEARCH_PASSWORD = 'pass';

      const client = createElastisearchConnection();

      expect(client).toBeInstanceOf(Client);
      expect(Client).toHaveBeenCalledWith({
        node: {
          url: new URL('http://localhost:9200'),
        },
        auth: {
          username: 'user',
          password: 'pass',
        },
      });
    });
  });

  describe('search tests', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client({ node: 'http://localhost:9200' });
    });

    it('should execute a search query with the correct parameters', async () => {
      const mockSearchResponse = {
        hits: {
          hits: [
            {
              _id: '1',
              _source: {
                bildnummer: '123',
                datum: '2025-02-25',
                suchtext: 'test',
                fotografen: 'John Doe',
                db: 'source1',
              },
            },
          ],
        },
      };
      client.search = jest.fn().mockResolvedValue(mockSearchResponse);

      const searchOptions = {
        searchString: 'test',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        fotografen: 'John Doe',
        page: 0,
        pageSize: 20,
      };

      const results = await search(searchOptions, client);

      expect(client.search).toHaveBeenCalledWith({
        index: process.env.ELASTICSEARCH_INDEX,
        body: {
          query: {
            bool: {
              must: [
                { wildcard: { suchtext: '*test*' } },
                { match: { fotografen: 'John Doe' } },
              ],
              filter: [
                {
                  range: {
                    datum: {
                      gte: '2025-01-01',
                      lte: '2025-12-31',
                    },
                  },
                },
              ],
            },
          },
        },
        from: 0,
        size: 20,
      });
      expect(results).toEqual(mockSearchResponse.hits.hits);
    });

    it('should handle errors and return undefined', async () => {
      client.search = jest.fn().mockRejectedValue(new Error('Search error'));

      const searchOptions = {
        searchString: 'test',
        page: 0,
        pageSize: 20,
      };

      const results = await search(searchOptions, client);

      expect(client.search).toHaveBeenCalled();
      expect(results).toBeUndefined();
    });
  });

  describe('getUniqueFotografen tests', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client({ node: 'http://localhost:9200' });
    });

    it('should return unique fotografen', async () => {
      const mockSearchResponse = {
        aggregations: {
          unique_fotografen: {
            buckets: [{ key: 'Dalton' }, { key: 'Evans' }],
          },
        },
      };
      client.search = jest.fn().mockResolvedValue(mockSearchResponse);

      const uniqueFotografen = await getUniqueFotografen(client);

      expect(client.search).toHaveBeenCalledWith({
        index: process.env.ELASTICSEARCH_INDEX,
        body: {
          size: 0,
          aggs: {
            unique_fotografen: {
              terms: {
                field: 'fotografen',
                size: 1000,
              },
            },
          },
        },
      });
      expect(uniqueFotografen).toEqual(['Dalton', 'Evans']);
    });

    it('should handle errors and return undefined', async () => {
      client.search = jest.fn().mockRejectedValue(new Error('Fetch error'));

      const uniqueFotografen = await getUniqueFotografen(client);

      expect(client.search).toHaveBeenCalled();
      expect(uniqueFotografen).toBeUndefined();
    });
  });
});
