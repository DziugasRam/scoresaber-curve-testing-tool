const myCurve = {
   name: 'curve',
   points: [
      [1, 1.5],
      [0.99, 1.3999],
      [0.98, 1.3064],
      [0.97, 1.2192],
      [0.96, 1.1379],
      [0.95, 1.0619],
      [0.94, 0.991],
      [0.93, 0.9249],
      [0.92, 0.8632],
      [0.91, 0.8055],
      [0.9, 0.7518],
      [0.85, 0.5322],
      [0.8, 0.3768],
      [0.75, 0.2667],
      [0.7, 0.1888],
      [0.65, 0.1337],
      [0.6, 0.0946],
      [0.55, 0.067],
	  [0.5, 0.0474],
	  [0.45, 0.0336],
	  [0.4, 0.0238],
	  [0.35, 0.0168],
	  [0.3, 0.0119],
	  [0.15, 0.0042],
	  [0, 0],
   ],
};
 
let CurrentCurve = {
   name: 'Current Curve',
   points: [
      [1, 1.5],
      [0.99, 1.39],
      [0.98, 1.29],
      [0.97, 1.2],
      [0.96, 1.115],
      [0.95, 1.046],
      [0.945, 1.015],
      [0.925, 0.905],
      [0.9, 0.78],
      [0.86, 0.6],
      [0.8, 0.42],
      [0.75, 0.3],
      [0.7, 0.22],
      [0.65, 0.15],
      [0.6, 0.105],
      [0.55, 0.06],
      [0.5, 0.03],
      [0.45, 0.015],
      [0, 0],
   ],
};
 
const getPP = (acc: number, starRating: number, curve: any, curve2: any) => {
	let temp = 0.0;
   for (let t = 1; t < curve.points.length; ++t) {
      if (acc >= curve.points[t][0]) {
         const accDistance = curve.points[t][0] - curve.points[t - 1][0];
         const multiplierDistance = curve.points[t][1] - curve.points[t - 1][1];
         const multiplier = (acc - curve.points[t][0]) / accDistance * multiplierDistance + curve.points[t][1]
         temp = (temp + (starRating * multiplier * 42.1198637662));
		 break;
      }
   }
   for (let t = 1; t < curve2.points.length; ++t) {
      if (acc >= curve2.points[t][0]) {
         const accDistance = curve2.points[t][0] - curve2.points[t - 1][0];
         const multiplierDistance = curve2.points[t][1] - curve2.points[t - 1][1];
         const multiplier = (acc - curve2.points[t][0]) / accDistance * multiplierDistance + curve2.points[t][1]
         return (temp - (starRating * multiplier * 42.1198637662));
      }
   }
}
 
const getPlayerScores = async (pages: number, playerId: string, sort: "recent" | "top") => {
   const scores = [];
   for (let page = 1; page <= pages; ++page) {
      const response = await fetch(`https://scoresaber.com/api/player/${playerId}/scores?page=${page}&sort=${sort}`);
      const result: any = await response.json()
      for (const playerScore of result.playerScores) {
         if (playerScore.leaderboard.maxScore)
            scores.push([
               playerScore.leaderboard,
               playerScore.score.modifiedScore / playerScore.leaderboard.maxScore
            ]);
      }
   }
   return scores;
}
 
const run = async (curve: any, curve2: any, pages: number, playerId: string, sort: "recent" | "top") => {
   const scores = await getPlayerScores(pages, playerId, sort);
   const transformedScores = scores.map(([leaderboard, acc]) => {
      return [leaderboard.songName.substring(0, 15), leaderboard.stars, +(acc).toFixed(3), getPP(acc, leaderboard.stars, curve, curve2)];
   });
   transformedScores.forEach((element) => {element[3] = +(element[3]).toFixed(3)});
   transformedScores.sort((a, b) => b[3] - a[3]);
   console.table(transformedScores);
}
 
 
run(myCurve, CurrentCurve, 5, "76561198073989976", "top");
