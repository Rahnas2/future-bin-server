import { scheduleCancelOverduePickupsJob } from "../cron/scheduledPickupJob";


export function initializeCronJobs() {
  scheduleCancelOverduePickupsJob()
}