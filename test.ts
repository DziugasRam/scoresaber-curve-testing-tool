import fetch from 'node-fetch';

const myCurve = {
   name: 'curve',
   points: [
      [2, 11],
      [1, 10],
      [0.99, 4],
      [0.985, 2.5],
      [0.98, 1.9],
      [0.97, 1.4],
      [0.96, 1.2],
      [0.95, 1.07],
      [0.94, 0.98],
      [0.92, 0.86],
      [0.9, 0.8],
      [0.86, 0.69],
      [0.8, 0.58],
      [0.75, 0.5],
      [0.7, 0.45],
      [0.65, 0.4],
      [0.6, 0.36],
      [0.0, 0.0],
   ],
};
let SyncCurve = {
   name: 'Sync Curve',
   points: [
      [1, 1.76],
      [0.99, 1.61],
      [0.98, 1.47],
      [0.97, 1.34],
      [0.96, 1.22],
      [0.95, 1.11],
      [0.94, 1.01],
      [0.925, 0.93],
      [0.9, 0.8],
      [0.85, 0.6],
      [0.8, 0.43],
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

let VilaCurve = {
   name: 'Vila Curve',
   points: [
      [1, 1.65],
      [0.99, 1.52],
      [0.98, 1.4],
      [0.97, 1.19],
      [0.96, 1.09],
      [0.95, 1],
      [0.945, 0.9],
      [0.925, 0.75],
      [0.9, 0.6],
      [0.8, 0.3],
      [0.75, 0.15],
      [0.7, 0.105],
      [0.65, 0.06],
      [0.6, 0.03],
      [0.55, 0.015],
      [0, 0],
   ],
};

let UmbraCurve = {
   name: 'Umbra Curve',
   points: [
      [1, 1.5],
      [0.99, 1.39],
      [0.98, 1.29],
      [0.97, 1.2],
      [0.96, 1.113],
      [0.95, 1.035],
      [0.94, 0.965],
      [0.92, 0.846],
      [0.9, 0.74],
      [0.86, 0.55],
      [0.8, 0.39],
      [0.75, 0.29],
      [0.7, 0.21],
      [0.65, 0.14],
      [0.6, 0.105],
      [0.55, 0.06],
      [0.5, 0.03],
      [0.45, 0.015],
      [0, 0],
   ],
};

let ScaledSyncCurve = {
   name: 'Scaled Sync Curve',
   points: [
      [1, 1.5],
      [0.99, 1.37],
      [0.98, 1.25],
      [0.97, 1.14],
      [0.96, 1.04],
      [0.95, 0.946],
      [0.94, 0.86],
      [0.925, 0.79],
      [0.9, 0.68],
      [0.85, 0.51],
      [0.8, 0.366],
      [0.75, 0.256],
      [0.65, 0.128],
      [0.6, 0.089],
      [0.55, 0.051],
      [0.5, 0.026],
      [0.45, 0.01],
      [0, 0],
   ],
};

let ScaledSyncSmoothed = {
   name: 'ScaledSyncSmoothed ',
   points: [
      [1, 1.5],
      [0.99, 1.37],
      [0.98, 1.25],
      [0.97, 1.14],
      [0.96, 1.04],
      [0.95, 0.946],
      [0.94, 0.867],
      [0.925, 0.79],
      [0.9, 0.68],
      [0.85, 0.51],
      [0.8, 0.366],
      [0.75, 0.256],
      [0.65, 0.128],
      [0.6, 0.089],
      [0.55, 0.051],
      [0.5, 0.026],
      [0.45, 0.01],
      [0, 0],
   ],
};

const getPP = (acc: number, starRating: number, curve: any) => {
   for (let t = 1; t < curve.points.length; ++t) {
      if (acc >= curve.points[t][0]) {
         const accDistance = curve.points[t][0] - curve.points[t - 1][0];
         const multiplierDistance = curve.points[t][1] - curve.points[t - 1][1];
         const multiplier = (acc - curve.points[t][0]) / accDistance * multiplierDistance + curve.points[t][1]
         return starRating * multiplier * 42.1198637662;
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

const run = async (curve: any, pages: number, playerId: string, sort: "recent" | "top") => {
   const scores = await getPlayerScores(pages, playerId, sort);
   const transformedScores = scores.map(([leaderboard, acc]) => {
      return [leaderboard.songName.substring(0, 15), leaderboard.stars, acc, getPP(acc, leaderboard.stars, curve)];
   });
   transformedScores.sort((a, b) => b[3] - a[3]);
   console.table(transformedScores);
}

run(myCurve, 20, "76561198186151129", "recent");