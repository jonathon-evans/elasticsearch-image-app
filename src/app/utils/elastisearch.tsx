import { Client, ClientOptions } from '@elastic/elasticsearch';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export interface SearchOptions {
  searchString?: string;
  startDate?: string;
  endDate?: string;
  fotografen?: string;
  page?: number;
  pageSize?: number;
}

export const createElastisearchConnection = (): Client => {
  const clientOptions: ClientOptions = {
    node: {
      url: new URL(process.env.ELASTICSEARCH_URL as string),
    },
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME as string, // TODO add validation that values exist in .env
      password: process.env.ELASTICSEARCH_PASSWORD as string,
    },
  };

  return new Client(clientOptions);
};

export const checkImageAvailability = async (bildnummer: string) => {
  const imageUrl = `https://www.imago-images.de/bild/st/${bildnummer}/s.jpg`;
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    if (response.ok) {
      return imageUrl;
    }
    return undefined;
  } catch (error) {
    console.error('Error fetching image:', error);
    return undefined;
  }
};

export const search = async (searchOptions: SearchOptions, client: Client) => {
  const {
    searchString,
    startDate,
    endDate,
    fotografen,
    page = 0,
    pageSize = 20,
  } = searchOptions;
  const query: any = {
    bool: {
      must: [],
      filter: [],
    },
  };

  if (searchString) {
    query.bool.must.push({
      wildcard: {
        suchtext: `*${searchString}*`,
      },
    });
  }

  if (fotografen) {
    query.bool.must.push({
      match: {
        fotografen: fotografen,
      },
    });
  }

  if (startDate || endDate) {
    query.bool.filter.push({
      range: {
        datum: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      },
    });
  }
  try {
    const result = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      body: {
        query,
      },
      from: page,
      size: pageSize,
    });

    //TODO - handle the result
    return result.hits.hits;
  } catch (error) {
    console.error('Error executing search query:', error);
  }
};

export const getUniqueFotografen = async (client: Client) => {
  try {
    const result: any = await client.search({
      index: process.env.ELASTICSEARCH_INDEX,
      body: {
        size: 0,
        aggs: {
          unique_fotografen: {
            terms: {
              field: 'fotografen', // Use the keyword field for exact matches
              size: 1000, // Adjust the size as needed
            },
          },
        },
      },
    });

    const uniqueFotografen =
      result?.aggregations?.unique_fotografen?.buckets?.map(
        (bucket: any) => bucket.key
      );
    return uniqueFotografen;
  } catch (error) {
    console.error('Error fetching unique fotografen:', error);
  }
};
