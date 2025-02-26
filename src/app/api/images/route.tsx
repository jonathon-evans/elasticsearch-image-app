import { NextResponse, NextRequest } from 'next/server';
import validator from 'validator';
import {
  checkImageAvailability,
  createElastisearchConnection,
  getUniqueFotografen,
  search,
  SearchOptions,
} from '../../utils/elastisearch';

export interface ImageItemResult {
  id: string | undefined;
  bildnummer: string | undefined;
  datum: string | undefined;
  suchtext: string | undefined;
  fotografen: string | undefined;
  url: string | undefined;
  source: string | undefined;
}

const client = createElastisearchConnection();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log('Receieved request to get images');
  const searchString = validator.escape(searchParams.get('searchString') || '');
  const startDate = validator.escape(searchParams.get('startDate') || '');
  const endDate = validator.escape(searchParams.get('endDate') || '');
  const fotografen = validator.escape(searchParams.get('fotografen') || '');
  const page = searchParams.get('page')
    ? parseInt(validator.escape(searchParams.get('page')!))
    : undefined;
  const pageSize = searchParams.get('pageSize')
    ? parseInt(validator.escape(searchParams.get('pageSize')!))
    : undefined;

  const searchOptions: SearchOptions = {
    searchString,
    startDate,
    endDate,
    fotografen,
    page,
    pageSize,
  };

  try {
    const searchResult = await search(searchOptions, client);
    if (!searchResult || !searchResult.length) {
      console.log('Images matching the search not found');
      return NextResponse.json(
        { message: 'Images matching the search not found' },
        { status: 404 }
      );
    }
    const result: ImageItemResult[] = await Promise.all(
      searchResult?.map(async (result: any) => {
        return {
          id: result._id,
          bildnummer: result._source.bildnummer,
          datum: result._source.datum,
          suchtext: result._source.suchtext,
          fotografen: result._source.fotografen,
          url: await checkImageAvailability(result._source.bildnummer),
          source: result._source.db,
        };
      })
    );

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    console.log('Error fetching images', e);
    return NextResponse.json(
      { message: 'Error fetching images' },
      { status: 500 }
    );
  }
}
