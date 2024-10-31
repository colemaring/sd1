// Function to generate random scores
function generateRandomScores(numScores, min, max) {
  const scores = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 0; i < numScores; i++) {
    scores.push({
      x: months[i],
      y: Math.floor(Math.random() * (max - min + 1)) + min,
    });
  }

  return scores;
}

// Array of persons
const persons = [
  { id: "Alice", color: "green", data: generateRandomScores(12, 100, 700) },
  { id: "Bob", color: "blue", data: generateRandomScores(12, 100, 700) },
  { id: "Charlie", color: "red", data: generateRandomScores(12, 100, 700) },
  { id: "Diana", color: "purple", data: generateRandomScores(12, 100, 700) },
  { id: "Ethan", color: "orange", data: generateRandomScores(12, 100, 700) },
  { id: "Fiona", color: "cyan", data: generateRandomScores(12, 100, 700) },
];

// Example usage: console log the persons
const mockdata = persons;

console.log(mockdata);
export default mockdata;
