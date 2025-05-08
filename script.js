const kcetData = [
  [98.89, 1], [97.5, 15], [96.5, 30], [95.8, 40], [94.3, 125], [93.333, 150],
  [92.5, 210], [91.5, 360], [90.8, 410], [89.0, 891], [91.002, 399], [86.778, 1243],
  [86.5, 1300], [86.222, 1365], [84.056, 2081], [84, 2584], [83.389, 2641],
  [81.333, 3911], [81.056, 3976], [80.6, 4200], [80.478, 4292], [80.3, 4400],
  [77.611, 7489], [77.333, 7521], [76.333, 8762], [76.5, 9500], [75.111, 11272],
  [74.611, 11607], [74.333, 12306], [74.667, 12462], [73.944, 13244], [74.0, 13572],
  [73.333, 15249], [72.556, 17339], [72.111, 17453], [71.5, 19479], [71.389, 20192],
  [71.111, 21166], [70.833, 21408], [70.111, 23142], [70.333, 23607], [69.889, 24536],
  [68.722, 26287], [69.111, 28514], [67.556, 33634], [67.5, 34698], [66.889, 38773],
  [67.056, 39390], [66.389, 39518], [66.333, 41668], [66.111, 42292], [65.889, 44572],
  [64.778, 50007], [64.944, 50261], [64.5, 52221], [64.556, 53721], [64.167, 55928],
  [63.833, 56135], [63.944, 58948], [63.222, 61549], [65.444, 74803], [62.056, 75743],
  [61.167, 80268], [60.444, 87683], [59.611, 95197], [58.833, 103513], [58.944, 103778],
  [58.611, 107678], [58, 110751], [57.056, 122105], [56.111, 133311], [55.278, 140185],
  [54.056, 151168], [53.167, 161591], [48.389, 204505], [48.056, 214063], [41.944, 248796]
];

const overallData = kcetData.sort((a, b) => b[0] - a[0]);

function predictRankKCET() {
  const boardInput = document.getElementById('boardMarks');
  const kcetInput = document.getElementById('kcetMarks');
  const boardMarks = Number(boardInput.value.trim());
  const kcetMarks = Number(kcetInput.value.trim());
  const rankBox = document.getElementById('rankBox');

  boardInput.classList.remove('invalid');
  kcetInput.classList.remove('invalid');

  if (!boardMarks || !kcetMarks) {
    alert('Both fields are mandatory. Please fill in all fields.');
    return;
  }

  if (isNaN(boardMarks) || boardMarks < 0 || boardMarks > 300) {
    boardInput.classList.add('invalid');
    alert('Please enter valid board marks (0-300).');
    return;
  }
  if (isNaN(kcetMarks) || kcetMarks < 0 || kcetMarks > 180) {
    kcetInput.classList.add('invalid');
    alert('Please enter valid KCET marks (0-180).');
    return;
  }

  rankBox.style.display = 'block';
  rankBox.innerHTML = `<div class="loading">Loading your rank estimate...</div>`;

  setTimeout(() => {
    const normalizedScore = (boardMarks / 300) * 50 + (kcetMarks / 180) * 50;

    let low = 0, high = overallData.length - 1, predictedRank = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (overallData[mid][0] === normalizedScore) {
        predictedRank = overallData[mid][1];
        break;
      } else if (overallData[mid][0] < normalizedScore) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (predictedRank === -1) {
      if (low === 0) {
        predictedRank = overallData[0][1];
      } else if (low >= overallData.length) {
        predictedRank = overallData[overallData.length - 1][1];
      } else {
        const lower = overallData[low - 1];
        const upper = overallData[low];
        const rankDiff = upper[1] - lower[1];
        const scoreDiff = upper[0] - lower[0];
        const scoreOffset = normalizedScore - lower[0];
        predictedRank = Math.round(lower[1] + (scoreOffset / scoreDiff) * rankDiff);
      }
    }

    const upperRange = Math.round(predictedRank * 1.05);
    rankBox.innerHTML = `
      <div>Your predicted rank is estimated:</div>
      <div><strong>${predictedRank} - ${upperRange}</strong></div>
    `;
  }, 1500);
}

document.getElementById('predictBtn').addEventListener('click', predictRankKCET);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    predictRankKCET();
  }
});
