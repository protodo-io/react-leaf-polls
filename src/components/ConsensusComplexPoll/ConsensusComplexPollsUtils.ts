import { Result } from '../../types/result'

function manageVote(results: Result[], item: Result) {
  item.votes += 1
  countPercentage(results)
}

const countPercentage = (results: Result[]) => {
  // Exclude the last option (vote abstention)
  const votableOptions = results.slice(0, -1)

  // Total votes across all votable options
  const totalVotes = votableOptions.reduce(
    (total, result) => total + result.votes,
    0
  )

  // Update percentage for each votable option
  votableOptions.forEach((result) => {
    result.percentage =
      totalVotes > 0 ? Math.round((result.votes / totalVotes) * 100) : 0
  })
}

function calculateAveragePosition(results: Result[]) {
  let totalVotes = 0
  let weightedSum = 0

  // Exclude the last option 'No response' by iterating to results.length - 1
  for (let i = 0; i < results.length - 1; i++) {
    totalVotes += results[i].votes
    weightedSum += (i + 1) * results[i].votes
  }
  return totalVotes > 0 ? weightedSum / totalVotes : 0
}

export { manageVote, countPercentage, calculateAveragePosition }
