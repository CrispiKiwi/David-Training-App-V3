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
  return <div>App is working!</div>;
}
