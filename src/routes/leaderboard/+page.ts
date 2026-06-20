import { createSupabaseClient } from '$lib/supabaseClient';
import type { PageLoad } from './$types';

type LeaderboardRow = {
	[key: string]: unknown;
};

const TEAM_CANDIDATE_COLUMNS = ['team_name', 'team', 'teamname', 'name', 'Team', 'Team_Name'];
const POINT_CANDIDATE_COLUMNS = ['points', 'point', 'score', 'scores', 'total_points', 'Points'];

function findFirstColumn(columns: string[], candidates: string[]) {
	const lowerMap = new Map(columns.map((column) => [column.toLowerCase(), column]));
	for (const candidate of candidates) {
		const resolved = lowerMap.get(candidate.toLowerCase());
		if (resolved) return resolved;
	}
	return null;
}

export const load: PageLoad = async () => {
	const tableName =
		(import.meta.env.VITE_LEADERBOARD_TABLE as string | undefined) ||
		(import.meta.env.PUBLIC_LEADERBOARD_TABLE as string | undefined) ||
		'leaderboard';
	const { supabase, configured } = createSupabaseClient();

	if (!configured || !supabase) {
		return {
			configured: false,
			rows: [] as Array<{ position: number; team_name: string; points: number }>,
			errorMessage:
				'Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY to load leaderboard data from Supabase.',
			tableName,
		};
	}

	const { data, error } = await supabase.from(tableName).select('*').limit(500);

	if (error) {
		return {
			configured: true,
			rows: [] as Array<{ position: number; team_name: string; points: number }>,
			errorMessage: error.message,
			tableName,
		};
	}

	const rows = (data ?? []) as LeaderboardRow[];
	if (rows.length === 0) {
		return {
			configured: true,
			rows: [] as Array<{ position: number; team_name: string; points: number }>,
			tableName,
		};
	}

	const availableColumns = Object.keys(rows[0]);
	const teamColumn = findFirstColumn(availableColumns, TEAM_CANDIDATE_COLUMNS);
	const pointsColumn = findFirstColumn(availableColumns, POINT_CANDIDATE_COLUMNS);

	if (!teamColumn || !pointsColumn) {
		return {
			configured: true,
			rows: [] as Array<{ position: number; team_name: string; points: number }>,
			tableName,
			errorMessage: `Could not find team/points columns in ${tableName}. Available columns: ${availableColumns.join(', ')}`,
		};
	}

	const normalized = rows
		.map((row) => ({
			team_name: String(row[teamColumn] ?? 'Unknown Team'),
			points: Number(row[pointsColumn] ?? 0),
		}))
		.sort((left, right) => right.points - left.points);

	let previousPoints: number | null = null;
	let previousPosition = 0;

	const ranked = normalized.map((row, index) => {
		const position = previousPoints !== null && row.points === previousPoints ? previousPosition : previousPosition + 1;
		previousPoints = row.points;
		previousPosition = position;

		return {
			position,
			team_name: row.team_name,
			points: row.points,
		};
	});

	return {
		configured: true,
		rows: ranked,
		tableName,
	};
};