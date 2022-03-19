import { useEffect, useState } from "react";
import { Bar, BarChart, LabelList, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
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
  return <span className="text-white text-xl">
    {timeLeft.hours.toString().padStart(2, "0")}:
    {timeLeft.minutes.toString().padStart(2, "0")}:
    {timeLeft.seconds.toString().padStart(2, "0")}
  </span>
}

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;

  //if (payload.visible) {
  if (false) {
    return (
      <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
        <g transform="translate(4 4)">
          <circle r="4" fill="black" />
          <circle r="2" fill="white" />
        </g>
      </svg>
    );
  }

  return null;
};

const Statistics = (props: any) => {
  const [experimental, setExperimental] = useState(true);
  useLockBodyScroll();
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
  for (let i = 0; i <= 110; i++) {
    pointStats.push({ "points": i, "probability": 0, "numTimes": 0 })
  }
  const std = 4;
  const f = (x: number, mean: number) => Math.exp(-1 / 2 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
  Object.values(props.stats).forEach((stat: any) => {
    const spread = 20;
    let minPoint = Math.max(0, stat.points - spread);
    let maxPoint = Math.min(110, stat.points + spread);
    for (let currPoint = minPoint; currPoint <= maxPoint; currPoint++) {
      if (experimental) {
        pointStats[currPoint]["numTimes"] += (Math.pow((spread - Math.abs(stat.points - currPoint)), 2));
      } else {
        pointStats[currPoint]["numTimes"] += f(currPoint, stat.points);
      }
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

  const [closing, setClosing] = useState(false);
  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      props.onClose();
    }, 200)
  }
  return <div id="statisticsBG"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        close()
      }
    }}
    className={`absolute w-screen h-screen bg-black/50 flex-center top-0 z-20 ${closing ? "closing" : ""}`}
  >
    <div id="statistics" className={`bg-dark-900 rounded-lg w-[30rem] flex flex-col items-center p-8 text-white relative ${closing ? "closing" : ""}`}>
      <div onClick={close} className="absolute right-0 top-0 cursor-pointer mr-3 my-1 text-xl">x</div>
      <input className="absolute left-0 top-0 m-2" type="radio" checked={experimental} onClick={() => setExperimental(exp => !exp)} readOnly={true} />

      <span className="text-white text-xl">
        Statistics
      </span>
      <div className="w-full h-4">&nbsp;</div>

      <SimpleTextStats wins={wins} games={games} maxStreak={maxStreak} currentStreak={currentStreak} />

      <div className="w-full h-4">&nbsp;</div>

      <span className="text-white">
        Category distribution
      </span>
      {experimental && <CategoryBarChart clueStats={clueStats} />}
      {!experimental && <CategoryRadarChart clueStats={clueStats} />}


      <span className="text-white">
        Point distribution
      </span>
      <PointDistributionLineChart points={props.points} pointStats={pointStats} />

      <div className="text-white">Next movie in </div><TimeToNewDay />
      <div className="w-full h-2">&nbsp;</div>

      <button onClick={props.onShare} className="bg-green-700 p-2 rounded-md">Copy result to clipboard</button>
    </div>
  </div>
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
      <div key={stat.label} className="flex-1 border-white m-2 p-1 rounded-md flex-center flex-col bg-dark-700">
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
  <ResponsiveContainer height={250}>
    <BarChart data={props.clueStats} layout="vertical" barCategoryGap={0.9}>
      <XAxis type="number" axisLine={false} tick={false} />
      <YAxis type="category" dataKey="clue" tickLine={false} interval={0} tick={{ fill: "white" }} />
      <Bar dataKey="revealFrac" fill="green" minPointSize={15}>
        <LabelList dataKey="reveals" position="insideRight" fill="white" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>)

const PointDistributionLineChart = (props: any) => (
  <ResponsiveContainer height={200}>
    <LineChart data={props.pointStats}>
      <XAxis dataKey="points" domain={[0, 110]} ticks={[10, 30, 50, 70, 90, 110]} fill="white" />
      <Line type="basis" dataKey="probability" stroke="white" dot={<CustomizedDot />} />
      <ReferenceLine x={props.points} stroke="green" />
    </LineChart>
  </ResponsiveContainer>
)



export default Statistics;