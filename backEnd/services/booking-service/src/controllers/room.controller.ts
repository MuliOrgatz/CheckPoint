import sequelize from '../database/db';

export async function searchRooms(params: {
  text?: string;
  start?: string;
  end?: string;
  limit?: number;
  offset?: number;
}) {
  const { text, start, end, limit = 20, offset = 0 } = params;

  const whereClauses: string[] = [];
  const replacements: any = {};

  if (text) {
    whereClauses.push('(r.location ILIKE :text OR r.name ILIKE :text)');
    replacements.text = `%${text}%`;
  }

  // If searching by date, add NOT EXISTS to whereClauses
  if (start && end) {
    whereClauses.push(`NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b."roomId" = r.id
        AND b.status = 'confirmed'
        AND b."startTime" < :end::timestamp
        AND b."endTime" > :start::timestamp
    )`);
    replacements.start = start;
    replacements.end = end;
  }

  const whereClause =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT r.id, r.name, r.location, r."pricePerNight", r."createdAt", r."updatedAt"
    FROM rooms r
    ${whereClause}
    ORDER BY r.id ASC
    LIMIT :limit OFFSET :offset
  `;

  const countSql = `
    SELECT COUNT(DISTINCT r.id) AS total
    FROM rooms r
    ${whereClause}
  `;

  try {
    const rooms = await sequelize.query(sql, {
      replacements: { ...replacements, limit, offset },
      type: 'SELECT',
    });

    const countResults = await sequelize.query(countSql, {
      replacements,
      type: 'SELECT',
    });

    let total = 0;
    if (countResults.length > 0) {
      const first = countResults[0];
      if (first && typeof (first as any).total !== 'undefined') {
        total = Number((first as any).total);
      }
    }

    return { rooms, total };
  } catch (error) {
    console.error('Error searching rooms:', error);
    throw new Error('Failed to search rooms');
  }
}
