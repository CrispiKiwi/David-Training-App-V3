// Imports and setup
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  });
}

const trainingProgram = {
  Monday: {
    bft: "Upper Body Pump",
    weights: [
      { name: "Machine Chest Fly", sets: 3, reps: "12–15" },
      { name: "Barbell Bench Press", sets: 4, reps: "8–10" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: "10–12" },
      { name: "Lateral Raises (Pyramid)", sets: 5, reps: "30,25,20,15,10" },
      { name: "Triceps Pushdowns", sets: 3, reps: "12–15" },
    ],
  },
  Tuesday: {
    bft: "Cardio",
    weights: [
      { name: "Barbell Row", sets: 4, reps: "6–8" },
      { name: "Lat Pulldown", sets: 3, reps: "8–12" },
      { name: "Face Pulls", sets: 3, reps: "12–15" },
      { name: "Bicep Curls", sets: 3, reps: "10–12" },
    ],
  },
  Wednesday: {
    bft: "Lower Body Strength",
    weights: [
      { name: "Squats", sets: 4, reps: "6–8" },
      { name: "Lunges", sets: 3, reps: "10 ea" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10–12" },
      { name: "Standing Calf Raise (Smith Machine)", sets: 4, reps: "15–20" },
    ],
  },
  Thursday: {
    bft: "Cardio Summit",
    weights: [
      { name: "Incline Dumbbell Press", sets: 3, reps: "8–10" },
      { name: "Cable Chest Fly", sets: 3, reps: "12–15" },
      { name: "Arnold Press", sets: 3, reps: "10–12" },
      { name: "Triceps Dips", sets: 3, reps: "AMRAP" },
    ],
  },
  Friday: {
    bft: "High Volume Full Body",
    weights: [
      { name: "Deadlifts", sets: 4, reps: "5" },
      { name: "Pull-Ups", sets: 3, reps: "AMRAP" },
      { name: "Barbell Curls", sets: 3, reps: "10–12" },
      { name: "Hammer Curls", sets: 3, reps: "10–12" },
      { name: "Seated Calf Raise (Smith Machine)", sets: 4, reps: "15–20" },
    ],
  },
  Saturday: {
    bft: "Cardio",
    weights: [
      { name: "Barbell Shrugs", sets: 4, reps: "12–15" },
      { name: "Lateral Raises", sets: 3, reps: "15–20" },
      { name: "Push-Ups", sets: 3, reps: "AMRAP" },
    ],
  },
  Sunday: {
    bft: "Rest",
    weights: [],
  },
};

const getWeekNumber = () => {
  const storageKey = "startWeekOffset";
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const absoluteWeek = Math.floor(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);

  let baseOffset = parseInt(localStorage.getItem(storageKey));
  if (isNaN(baseOffset)) {
    localStorage.setItem(storageKey, absoluteWeek.toString());
    baseOffset = absoluteWeek;
  }
  return `Week ${absoluteWeek - baseOffset + 1}`;
};

export default function App() {
  const currentWeek = getWeekNumber();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem("trainingLogs")) || {});
  const [completedWorkouts, setCompletedWorkouts] = useState(() => JSON.parse(localStorage.getItem("completedWorkouts")) || []);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [bftStatus, setBftStatus] = useState(() => JSON.parse(localStorage.getItem("bftStatus")) || {});
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => { localStorage.setItem("trainingLogs", JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem("bftStatus", JSON.stringify(bftStatus)); }, [bftStatus]);
  useEffect(() => { localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts)); }, [completedWorkouts]);

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    else if (timer === 0) setIsRunning(false);
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleLogChange = (day, index, value) => {
    setLogs(prev => ({
      ...prev,
      [currentWeek]: {
        ...(prev[currentWeek] || {}),
        [day]: { ...(prev[currentWeek]?.[day] || {}), [index]: value },
      },
    }));
  };

  const handleBftCheck = (day) => {
    setBftStatus(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleCompleteWorkout = () => {
    const entry = `${currentWeek} – ${selectedDay}`;
    if (!completedWorkouts.includes(entry)) {
      setCompletedWorkouts(prev => [...prev, entry]);
    }
  };

  const progressData = (week, day, index) => {
    const entry = logs[week]?.[day]?.[index] || "";
    const entries = entry.split("\n").filter(Boolean);
    const values = entries.map(e => parseFloat(e)).filter(v => !isNaN(v));
    return {
      labels: values.map((_, i) => `Set ${i + 1}`),
      datasets: [{ label: `${week} Weight (kg)`, data: values, borderColor: "blue", backgroundColor: "lightblue" }],
    };
  };

  const getSuggestedWeight = (day, index) => {
    const log = logs[currentWeek]?.[day]?.[index] || "";
    const entries = log.split("\n").map(w => parseFloat(w)).filter(w => !isNaN(w));
    if (entries.length === 0) return "No data yet";
    const recent = entries.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    return `${Math.round(avg + 2.5)} kg`;
  };

  const weekOptions = Object.keys(logs).sort().reverse();

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>🏋️ David's BFT + Weights App</h1>
      <h3>📆 Current Week: {currentWeek}</h3>

      <h2>📊 Weekly Summary</h2>
      <label>Select Week: </label>
      <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
        {weekOptions.map(week => <option key={week} value={week}>{week}</option>)}
      </select>

      <h2>🔥 Weekly BFT Classes</h2>
      <ul>
        {Object.entries(trainingProgram).map(([day, data]) => (
          <li key={day}>
            <label>
              <input type="checkbox" checked={!!bftStatus[day]} onChange={() => handleBftCheck(day)} />
              <strong> {day} – {data.bft}</strong>
            </label>
          </li>
        ))}
      </ul>

      <h2>📅 Select Day</h2>
      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        {Object.keys(trainingProgram).map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <h3>BFT Class: {trainingProgram[selectedDay].bft}</h3>
      <hr />

      <h2>📝 Weight Training for {selectedDay}</h2>
      {trainingProgram[selectedDay].weights.length > 0 ? (
        trainingProgram[selectedDay].weights.map((ex, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>{ex.name}</strong> – {ex.sets} sets x {ex.reps} reps</p>
            <p><em>💡 Suggested weight: {getSuggestedWeight(selectedDay, index)}</em></p>
            <textarea
              rows={3}
              cols={50}
              placeholder="Enter weights used (one per line)"
              value={logs[currentWeek]?.[selectedDay]?.[index] || ""}
              onChange={(e) => handleLogChange(selectedDay, index, e.target.value)}
            />
            {logs[selectedWeek]?.[selectedDay]?.[index] && (
              <Line data={progressData(selectedWeek, selectedDay, index)} />
            )}
          </div>
        ))
      ) : (
        <p>Rest day. No weights!</p>
      )}

      <button onClick={handleCompleteWorkout} style={{ marginBottom: "20px" }}>✅ Complete Workout</button>

      <h2>✅ Completed Workouts</h2>
      <ul>
        {completedWorkouts.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>

      <h2>⏱️ Rest Timer</h2>
      <p style={{ fontSize: "24px" }}>{timer}s</p>
      <button onClick={() => { setIsRunning(true); setTimer(60); }}>Start 1-Min Timer</button>
    </div>
  );
}
