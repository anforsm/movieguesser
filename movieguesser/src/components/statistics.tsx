import { useEffect, useState } from "react";
import { Bar, BarChart, Dot, LabelList, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { curveCardinal } from "d3-shape";
import useLockBodyScroll from "../hooks/useLockBodyScroll";
import { addSyntheticTrailingComment } from "typescript";
const curveFunction = curveCardinal;

const getTimeToNewDay = () => {
  let d = new Date();
  return {
    hours: 23 - d.getHours(),
    minutes: 59 - d.getMinutes(),
    seconds: 59 - d.getSeconds()
  }
}

const TimeToNewDay = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeToNewDay());
  useEffect(() => {
    const i = setInterval(() => {
      setTimeLeft(getTimeToNewDay());
    }, 1000)
    return () => clearInterval(i);
  })
  return <span className="text-2xl font-semibold">
    {timeLeft.hours.toString().padStart(2, "0")}:
    {timeLeft.minutes.toString().padStart(2, "0")}:
    {timeLeft.seconds.toString().padStart(2, "0")}
  </span>
}

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;

  const dotSize = 5;
  if (payload.visible) {
    //if (false) {
    return (
      //<g transform="translate(4 4)">
      //</g>
      <svg x={cx - dotSize} y={cy - dotSize} width={dotSize * 2} height={dotSize * 2} fill="white">
        <g transform={`translate(${dotSize} ${dotSize})`}>
          <circle r={`${dotSize}`} fill="green" />
        </g>
      </svg>
    );
  }

  return null;
};

const Statistics = (props: any) => {
  useLockBodyScroll();
  if (props.stats.length === 0) return <span>Play a game first...</span>
  let days = Object.keys(props.stats).map(day => Number.parseInt(day));
  let maxStreak = 0;
  let prevDay = days[0];
  let currentStreak = props.stats[days[0]].status !== "UNFINISHED" ? 1 : 0;
  days.slice(1).forEach(day => {
    if (day === prevDay + 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
    prevDay = day;
  });
  maxStreak = Math.max(maxStreak, currentStreak);
  let lastDay = days[days.length - 1];
  if (props.currentDay !== lastDay)
    currentStreak = 0;

  let games = 0;
  let wins = 0;
  const stripNumbers = (str: any) => str.replace(/[0-9]/g, "");
  let clueStats: any = {};
  Object.values(props.stats).forEach((stat: any) => {
    if (stat.status === "WIN")
      wins++;
    games++;
    Object.keys(stat.clues).forEach((category) => {
      if (!clueStats[stripNumbers(category)])
        clueStats[stripNumbers(category)] = 0;
      clueStats[stripNumbers(category)] += stat.clues[category];
    });
  });
  clueStats = Object.entries(clueStats)
  let maxReveals = clueStats.reduce((prevMax: number, clue: any) => Math.max(prevMax, clue[1]), 0);
  clueStats = clueStats.map((clue: any) => ({ "clue": clue[0][0].toUpperCase() + clue[0].slice(1), "reveals": clue[1], "revealFrac": clue[1] / maxReveals }));
  let playedDays = Object.keys(props.stats).length;
  let pointStats: any[] = [];
  for (let i = 0; i <= 100; i++) {
    pointStats.push({ "points": i, "probability": 0, "numTimes": 0 })
  }
  const std = 4;
  const f = (x: number, mean: number) => Math.exp(-1 / 2 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
  Object.values(props.stats).forEach((stat: any) => {
    let points = 100 - Math.min(stat.points, 100);
    const spread = 20;
    let minPoint = Math.max(0, points - spread);
    let maxPoint = Math.min(100, points + spread);
    for (let currPoint = minPoint; currPoint <= maxPoint; currPoint++) {
      pointStats[currPoint]["numTimes"] += f(currPoint, points);
    }
    //pointStats[stat.points]["numTimes"]++
  });

  let totalTimes = pointStats.reduce((currTimes, pointStat) => pointStat["numTimes"] + currTimes, 0)
  pointStats = pointStats.map(currPoint => ({
    "points": currPoint.points,
    "probability": currPoint.numTimes / totalTimes,
    "numTimes": currPoint.numTimes,
    "visible": currPoint.points === props.points
  }));

  //<input className="absolute left-0 top-0 m-2" type="radio" checked={experimental} onClick={() => setExperimental(exp => !exp)} readOnly={true} />
  /*
  return <div id="statisticsBG"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        close()
      }
    }}
    className={`absolute w-screen h-screen bg-black/50 flex-center top-0 z-20 ${closing ? "closing" : ""}`}
  >
    <div id="statistics" className={`bg-dark-900 rounded-lg w-[30rem] flex flex-col items-center p-8 text-white relative ${closing ? "closing" : ""}`}>
    */
  return <>

    <span className="text-xl">
      Statistics
    </span>
    <div className="w-full h-4">&nbsp;</div>

    <SimpleTextStats wins={wins} games={games} maxStreak={maxStreak} currentStreak={currentStreak} />

    <div className="w-full h-4">&nbsp;</div>

    <span className="">
      Category distribution
    </span>
    {true && <CategoryBarChart clueStats={clueStats} />}
    {false && <CategoryRadarChart clueStats={clueStats} />}


    <span className="">
      Point distribution
    </span>
    <PointDistributionLineChart points={props.points} pointStats={pointStats} />

    <div className="w-full h-4">&nbsp;</div>

    <div className="w-full h-[100px]">
      <div className="flex-center flex-col w-1/2 h-full float-left border-r-[1px] border-text-col">
        <div className="">Next movie in </div>
        <br />
        <TimeToNewDay />
      </div>

      <div className="flex-center w-1/2 h-full border-l-[1px] border-text-col">
        <button onClick={props.onShare} className="bg-green-700 p-2 rounded-md text-white">Copy results</button>
      </div>
    </div>
  </>
  /*
</div >
</div >
*/
}

const SimpleTextStats = (props: any) => {
  let stats: any = []
  const addStat = (label: string, value: any) => stats.push({ "label": label, "value": value });
  addStat("Games", props.games);
  addStat("Win Rate", (props.wins / props.games * 100).toFixed(0).toString() + "%");
  addStat("Highest Streak", props.maxStreak);
  addStat("Current Streak", props.currentStreak);
  return <div className="w-full flex">
    {stats.map((stat: any) =>
      <div key={stat.label} className="flex-1 shadow-md m-2 p-1 rounded-md flex-center flex-col bg-primary-700">
        <div className="text-2xl font-bold">{stat.value}</div>
        <div className="text-xs">{stat.label}</div>
      </div>)}
  </div>
  /*
  <div className="w-full flex">
    <div className="flex-1">
      <div>Games</div>
      <div>{props.games}</div>
    </div>

    <div className="flex-1">
      <div>Win rate</div>
      <div>{(props.wins / props.games * 100).toFixed(0)}%</div>
    </div>

    <div className="flex-1">
      <div>Highest streak</div>
      <div>{props.maxStreak}</div>
    </div>

    <div className="flex-1">
      <div>Current streak</div>
      <div>{props.currentStreak}</div>
    </div>
  </div>
  */
}

const animationDuration = 0;

const CategoryRadarChart = (props: any) => (
  <ResponsiveContainer height={250}>
    <RadarChart outerRadius={90} data={props.clueStats}>
      <PolarGrid />
      <PolarAngleAxis dataKey="clue" tick={{ fill: "white" }} />
      <Radar dataKey="revealFrac" fill="green" fillOpacity={0.8} />
    </RadarChart>
  </ResponsiveContainer>
)

const CategoryBarChart = (props: any) => (
  <ResponsiveContainer height={230}>
    <BarChart data={props.clueStats} layout="vertical" barCategoryGap={0.9}>
      <XAxis type="number" axisLine={false} tick={false} />
      <YAxis type="category" dataKey="clue" tickLine={false} interval={0} tick={{ fill: "var(--text-col)" }} />
      <Bar dataKey="revealFrac" fill="green" minPointSize={15} radius={[0, 5, 5, 0]} animationDuration={animationDuration}>
        <LabelList dataKey="reveals" position="insideRight" fill="white" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>)

const strokeWidth = 2;
const PointDistributionLineChart = (props: any) => (
  <ResponsiveContainer height={200}>
    <LineChart data={props.pointStats}>
      <XAxis dataKey="points" domain={[0, 110]} ticks={[0, 20, 40, 60, 80, 100]} fill="white" />
      <Line type="basis" dataKey="probability" stroke="var(--text-col)" dot={<CustomizedDot />} strokeWidth={strokeWidth} animationDuration={animationDuration} />
      <ReferenceLine x={props.points} stroke="green" strokeWidth={strokeWidth} />
    </LineChart>
  </ResponsiveContainer>
)



export default Statistics;