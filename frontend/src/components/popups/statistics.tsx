import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Dot,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { curveCardinal } from "d3-shape";
import useLockBodyScroll from "hooks/useLockBodyScroll";
import clueSpecification from "clueSpecification";

const curveFunction = curveCardinal;

let currentCategories = new Set(
  Object.keys(clueSpecification).map((key) => {
    return clueSpecification[key].clue;
  })
);

const getTimeToNewDay = () => {
  let d = new Date();
  return {
    hours: 23 - d.getHours(),
    minutes: 59 - d.getMinutes(),
    seconds: 59 - d.getSeconds(),
  };
};

const TimeToNewDay = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeToNewDay());
  useEffect(() => {
    const i = setInterval(() => {
      setTimeLeft(getTimeToNewDay());
    }, 1000);
    return () => clearInterval(i);
  });
  return (
    <span className="text-2xl font-semibold tabular-nums">
      {timeLeft.hours.toString().padStart(2, "0")}:
      {timeLeft.minutes.toString().padStart(2, "0")}:
      {timeLeft.seconds.toString().padStart(2, "0")}
    </span>
  );
};

// Dot for recharts graph
const CustomizedDot = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;

  const dotSize = 5;
  if (payload.visible && props.showTodaysScore) {
    return (
      <svg
        x={cx - dotSize}
        y={cy - dotSize}
        width={dotSize * 2}
        height={dotSize * 2}
        fill="white"
      >
        <g transform={`translate(${dotSize} ${dotSize})`}>
          <circle r={`${dotSize}`} fill="var(--secondary-900)" />
        </g>
      </svg>
    );
  }

  return null;
};

const Statistics = (props: any) => {
  useLockBodyScroll();
  if (props.stats.length === 0) return <span>Play a game first...</span>;
  let days = Object.keys(props.stats).map((day) => Number.parseInt(day));
  let maxStreak = 0;
  let prevDay = days[0];
  let currentStreak = props.stats[days[0]].status !== "UNFINISHED" ? 1 : 0;
  days.slice(1).forEach((day) => {
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
  if (props.currentDay !== lastDay) currentStreak = 0;

  let games = 0;
  let wins = 0;
  const stripNumbers = (str: any) => str.replace(/[0-9]/g, "");
  let clueStats: any = {};
  Object.values(props.stats).forEach((stat: any) => {
    if (stat.status === "WIN") wins++;
    games++;
    Object.keys(stat.clues).forEach((category) => {
      if (!clueStats[stripNumbers(category)])
        clueStats[stripNumbers(category)] = 0;
      clueStats[stripNumbers(category)] += stat.clues[category];
    });
  });
  clueStats = Object.entries(clueStats);
  clueStats = clueStats.filter((entry: any) => currentCategories.has(entry[0]));
  let maxReveals = clueStats.reduce(
    (prevMax: number, clue: any) => Math.max(prevMax, clue[1]),
    0
  );
  clueStats = clueStats.map((clue: any) => ({
    clue: clue[0][0].toUpperCase() + clue[0].slice(1),
    reveals: clue[1],
    revealFrac: clue[1] / maxReveals,
  }));
  console.log(clueStats);
  let playedDays = Object.keys(props.stats).length;
  let pointStats: any[] = [];
  for (let i = 0; i <= 100; i++) {
    pointStats.push({ points: i, probability: 0, numTimes: 0 });
  }
  let totalPoints = 0;
  const std = 4;
  const f = (x: number, mean: number) =>
    Math.exp((-1 / 2) * Math.pow((x - mean) / std, 2)) /
    (std * Math.sqrt(2 * Math.PI));
  Object.values(props.stats).forEach((stat: any) => {
    let points = 100 - Math.min(stat.points, 100);
    totalPoints += points;
    const spread = 20;
    let minPoint = Math.max(0, points - spread);
    let maxPoint = Math.min(100, points + spread);
    for (let currPoint = minPoint; currPoint <= maxPoint; currPoint++) {
      pointStats[currPoint]["numTimes"] += f(currPoint, points);
    }
  });
  const averagePoints = totalPoints / playedDays;

  let totalTimes = pointStats.reduce(
    (currTimes, pointStat) => pointStat["numTimes"] + currTimes,
    0
  );
  pointStats = pointStats.map((currPoint) => ({
    points: currPoint.points,
    probability: currPoint.numTimes / totalTimes,
    numTimes: currPoint.numTimes,
    visible: currPoint.points === props.points,
  }));

  return (
    <>
      <span className="text-xl">Statistics</span>
      <div className="h-4 w-full">&nbsp;</div>

      <SimpleTextStats
        wins={wins}
        games={games}
        maxStreak={maxStreak}
        currentStreak={currentStreak}
        averagePoints={averagePoints}
      />

      <div className="h-4 w-full">&nbsp;</div>

      <div className="h-[17rem] w-full">
        <Page
          pages={[
            <div className="flex-center w-full flex-col">
              <span className="">Category Distribution</span>
              <div className="h-4 w-full">&nbsp;</div>
              <div className="w-3/4">
                <CategoryBarChart clueStats={clueStats} />
              </div>
            </div>,
            <div className="flex-center w-full flex-col">
              <span className="">Point Distribution</span>
              <div className="h-4 w-full">&nbsp;</div>
              <div className="w-3/4">
                <PointDistributionLineChart
                  points={props.points}
                  pointStats={pointStats}
                  showTodaysScore={props.currentDay === lastDay}
                />
              </div>
            </div>,
          ]}
        />
      </div>

      <div className="h-8 w-full">&nbsp;</div>

      <div className="h-[100px] w-full">
        <div className="flex-center float-left h-full w-1/2 flex-col border-r-[1px] border-text-col">
          <div className="">Next Movie In </div>
          <br />
          <TimeToNewDay />
        </div>

        <div className="flex-center h-full w-1/2 border-l-[1px] border-text-col">
          <button
            onClick={props.onShare}
            className="secondary rounded-md p-2 text-white"
          >
            Copy results
          </button>
        </div>
      </div>
    </>
  );
};

const SimpleTextStats = (props: any) => {
  let stats: any = [[], []];
  const addStat = (label: string, value: any, row: number) =>
    stats[row].push({ label: label, value: value });
  addStat("Games Played", props.games, 0);
  addStat("Current Streak", props.currentStreak, 0);
  addStat("Highest Streak", props.maxStreak, 0);
  addStat("Average Points", props.averagePoints.toFixed(0).toString(), 0);
  addStat(
    "Win Rate",
    ((props.wins / props.games) * 100).toFixed(0).toString() + "%",
    0
  );
  return (
    <div className="flex-center w-3/4 flex-col">
      {stats.map((row: any) => (
        <div className="flex-center w-full">
          {row.map((stat: any, id: number) => (
            <div
              key={stat.label}
              className="flex-center m-2 w-[6rem] flex-1 flex-col rounded-md p-1 text-center shadow-md"
            >
              <div className="text-2xl font-bold ">{stat.value}</div>
              {stat.label.split(" ").map((labelPart: string) => (
                <div
                  className={`flex-center flex-grow text-xs ${
                    id == 4 && " ml-[-10px]"
                  }`}
                >
                  {labelPart}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const animationDuration = 0;

const CategoryRadarChart = (props: any) => (
  <ResponsiveContainer height={250}>
    <RadarChart outerRadius={90} data={props.clueStats}>
      <PolarGrid />
      <PolarAngleAxis dataKey="clue" tick={{ fill: "white" }} />
      <Radar dataKey="revealFrac" fill="green" fillOpacity={0.8} />
    </RadarChart>
  </ResponsiveContainer>
);

const CategoryBarChart = (props: any) => (
  <ResponsiveContainer height={200}>
    <BarChart
      data={props.clueStats}
      layout="vertical"
      barCategoryGap={0.9}
      height={400}
    >
      <XAxis type="number" axisLine={false} tick={false} height={0} />
      <YAxis
        type="category"
        dataKey="clue"
        tickLine={false}
        interval={0}
        tick={{ fill: "var(--text-col)" }}
      />
      <Bar
        dataKey="revealFrac"
        fill="var(--secondary-900)"
        minPointSize={30}
        radius={[0, 5, 5, 0]}
        animationDuration={animationDuration}
      >
        <LabelList dataKey="reveals" position="insideRight" fill="white" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const strokeWidth = 2;
const PointDistributionLineChart = (props: any) => (
  <ResponsiveContainer height={200}>
    <LineChart data={props.pointStats}>
      <XAxis
        dataKey="points"
        domain={[0, 110]}
        ticks={[0, 20, 40, 60, 80, 100]}
        stroke="var(--text-col)"
      />
      <Line
        type="basis"
        dataKey="probability"
        stroke="var(--text-col)"
        dot={<CustomizedDot showTodaysScore={props.showTodaysScore} />}
        strokeWidth={strokeWidth}
        animationDuration={animationDuration}
      />
      {props.showTodaysScore && (
        <ReferenceLine
          x={props.points}
          stroke="var(--secondary-900)"
          strokeWidth={strokeWidth}
        />
      )}
    </LineChart>
  </ResponsiveContainer>
);

const Page = (props: any) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageXOffset, setPageXOffset] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(0);
    setTouchStart(e.touches[0].clientX);
    setPageXOffset(0);
  };

  const onTouchMove = (e: any) => {
    setPageXOffset(Math.round((e.touches[0].clientX - touchStart) / 10) * 10);
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = (e: any) => {
    if (!touchStart || !touchEnd) return;

    if (Math.abs(touchStart - touchEnd) > minSwipeDistance) {
      setCurrentPage((prev) => (prev + 1) % 2);
      setPageXOffset(0);
    }
  };

  return (
    <div className="flex-center h-full w-full flex-col">
      <div className="flex w-full grow flex-col overflow-x-hidden">
        <div
          className="flex-center relative h-full transition-all"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            width: 100 * props.pages.length + "%",
            left:
              "calc(" + currentPage * -100 + "%" + " + " + pageXOffset + "px)",
          }}
        >
          {props.pages.map((page: any, id: number) => (
            <div
              key={id}
              className={`h-full`}
              style={{ width: 100 / props.pages.length + "%" }}
            >
              {page}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-center w-full">
        {props.pages.map((page: any, id: number) => (
          <button
            className={`m-1 aspect-square h-[0.65rem] rounded-full transition-all ${
              id == currentPage
                ? "scale-150 bg-text-col"
                : "bg-text-col-secondary"
            }`}
            onClick={() => setCurrentPage(id)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
