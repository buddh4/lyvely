- [ ] New Challange
 - Name
 - Plan
 - Description
 - Tasks/Activities
   - If habit with lower plan is selected the habit needs to be completed on each occasion
    e.g. A daily activity in a weekly challange needs to be done on every day of the challenge week
 - Score
- [ ] Update challange on task/activity update
  - Is task/activity part of an acitve challange? 
      -> Calculate challenge state
         -> if done -> send notification + update score
    

- Challange plan not editable, maybe just recalculate?
- Clone challenge / save as template

- How to detect failed challenges e.g. a daily activity is part of a weekly challenge, the activity was skipped
one day, so challenge failed. Maybe daily challenge state job. But note that user may updated activity after
the plan ends.
  
If we detect a failed challenge maybe show option to restart/archive

How to include challenge score into statistics / logs

On each task/activity revalidate the state/progress of all pending challenges including this task/activity.

Challenge validation steps:

-> For each goal
  -> Find logs within start/end according to plan
    -> Validate logs against goal


Since we can calculate how many units a goal should contain at a given time, we can calculate possibly failed
challenges by comparing the progress with the should-be value. Also a logs will keep track of missing values.

When updating a task/activity the result should contain challenge updates as well