import { useMemo } from "react";

export function useWinRate(matches, teamId) {
  return useMemo(() => {
    if (!matches || matches.length === 0) return 0;

    const finished = matches.filter(
      (m) => m.matchStatus === "Ended" || m.status === "finished"
    );
    if (finished.length === 0) return 0;

    const wins = finished.filter((m) => {
      const homeScore = parseInt(m.homeScore ?? 0, 10);
      const awayScore = parseInt(m.awayScore ?? 0, 10);
      if (m.homeTeamId === teamId) return homeScore > awayScore;
      if (m.awayTeamId === teamId) return awayScore > homeScore;
      return false;
    }).length;

    return Math.round((wins / finished.length) * 100);
  }, [matches, teamId]);
}
