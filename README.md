# WorkQueue
A Distributed Background Task Processing System written in TypeScript, using Redis for job queuing.
# What's the need for this?

This system is designed to handle the processing and execution of background tasks concurrently to improve user experience.

**Example:** When a user signs in to your website and clicks the login button, you might want to send them a welcome email. If that email task is part of the API call, the user would have to wait until the email is sent. Instead, you can add the "send_email" task to WorkQueue and let it handle the execution in the background.

**Note:** This is built to be modular — any type of job can be added to it, not just sending emails. You just need to add the logic for that job as described below.

## Services

This repo provides two independent services:

### 1. Producer

Provides a `/enqueue` route to add your jobs/tasks.

#### How to add a job?

- Send an HTTP POST request to the exposed `/enqueue` route on this URL: [workqueue-producer](https://workqueuevs.onrender.com/api/enqueue)
- It accepts a task in this format (JSON):
**Example: An inbuilt task the system supports is sending an email. Its JSON request would look like this:**

```json
{
    "type": "send_email",
    "Retries": 3,
    "payload": {
        "to": "worldisweird2020@gmail.com",
        "subject": "testing producer"
    }
}
```

- **type** - REQUIRED. Tells the producer the type of job being added to the queue.
- **Retries** - Number of times the system should try to enqueue the job if it fails.
- **Payload** - Contains details about the task in key-value pairs (Note: you can add any type/number of key-value pairs inside the payload, as the backend is built to flexibly accept all types).

This is the TypeScript type it accepts:

```ts
type Task = {
  type: string;
  payload: Record<string, any>;
  retries: number;
}
```

The response will look like this:
![Producer response](image-1.png)

### 2. Worker

- Takes the jobs from the queue in a reliable manner and executes them
- Provides a `/metrics` endpoint to view statistics

#### How to view the status of your job?

Send an HTTP GET request to [worker-url](https://workqueuevs.onrender.com/api/metrics)

This will give a response like this:

![Worker metrics](image.png)

- **total_jobs_in_queue** - Number of jobs inside the Redis queue at that moment
- **jobs_done** - Total number of jobs executed so far
- **jobs_failed** - Number of jobs that failed to execute, if any

## Additional features

- **Concurrency** is provided to enable fast execution using goroutines and the sync package.

- **Logging** of each event is provided and stored inside the logs.txt file. This helps to trace back the success or failure of a job.


---