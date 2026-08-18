# TaskNest Productivity Improvement

## 1. Existing productivity score

The original implementation mixed two unrelated scoring mechanisms. Creating any task added **5 points** to a persisted `Score` row, and completing a task added another **10 points**. The score endpoint then loaded all completed tasks and added a second, dynamic “momentum bonus”: fewer than two completed tasks received `1.5` points each, while two or more completed tasks received `3.75` points each. The endpoint rounded the result down before returning it.

This meant that the same task state could produce different values depending on the history of API calls. Creating a task increased productivity before any work was completed, completing the same task repeatedly could award points again, and deleting a task did not reverse its contribution. The persisted score also had no relationship to task importance, even though the client explicitly asked for important tasks to be considered.

## 2. Issues discovered

| Issue | User impact |
| --- | --- |
| Task creation awarded points | Users could raise the score without completing work. |
| Completion and dynamic momentum were both applied | The final number was difficult to explain and could be inflated. |
| Completion was not idempotent | Repeating the same completion action could add points again. |
| Deleting a task did not recalculate the score | The score could represent tasks that no longer existed. |
| Important tasks were not modeled | The stated requirement had no corresponding user-facing functionality. |
| Score was stored separately from its source data | Refreshes and historical mutations could leave the score inconsistent with current tasks. |

## 3. Interpreted requirements and scoring rules

The requirement was translated into the following small, deterministic feature set:

| Product intent | Implemented behavior |
| --- | --- |
| Users should see how productive they are | The API derives a score from the current task records and caps it at 100. |
| Important work should count more | Every completed task is worth 10 points; a completed important task receives an additional 10-point bonus. |
| Users should stay consistent | Each distinct day with at least one completed task contributes a 5-point consistency bonus, capped at 20 points. |
| The score should be understandable | The API returns the total, completed-task count, important-task count, task points, consistency days, and consistency bonus. |

The formula is:

```text
score = min(
  (completed tasks × 10)
  + (completed important tasks × 10)
  + min(distinct completed days × 5, 20),
  100
)
```

## 4. Implementation details

The Prisma `Task` model now includes `important` and nullable `completedAt` fields. The task API accepts an importance flag at creation time and supports updating completion and importance independently. Completing a task records the completion timestamp; marking it incomplete clears that timestamp. The old persisted-score writes and the confusing momentum helper were removed from the request path. The `Score` model is retained only for backwards-compatible database migrations, while the returned score is derived from `Task` records.

The frontend now allows users to mark a task important when creating it or by toggling the star on an existing task. Important tasks display a visible badge, and the score card explains how task points and consistency points contributed to the total. The API wrapper also supports `VITE_API_URL`, allowing the frontend to connect to a deployed backend without changing source code.

## 5. Verification

The backend helper is covered by deterministic tests for normal tasks, important-task bonuses, distinct-day consistency, the 100-point cap, and incomplete tasks. The client production build was also run successfully after the changes.

## 6. Deployment links

- Frontend Deployment Link: To be added after deployment.
- Backend Deployment Link: To be added after deployment.

## 7. Pull request and explanation video

- Pull Request Link: To be added after the repository is published.
- Google Drive Video Link: To be added after the explanation video is uploaded and shared.
