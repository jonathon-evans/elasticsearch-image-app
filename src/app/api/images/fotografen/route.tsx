import { NextResponse, NextRequest } from 'next/server';
import {
  createElastisearchConnection,
  getUniqueFotografen,
} from '../../../utils/elastisearch';

const client = createElastisearchConnection();

export async function GET(req: NextRequest) {
  try {
    const uniqueFotografen = await getUniqueFotografen(client);
    return NextResponse.json(uniqueFotografen, { status: 200 });
  } catch (error) {
    console.error('Error fetching unique fotografen:', error);
    return NextResponse.json(
      { message: 'Error fetching unique fotografen' },
      { status: 500 }
    );
  }
}
