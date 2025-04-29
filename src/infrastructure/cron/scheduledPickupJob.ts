import cron from 'node-cron';
import { scheduledPickupInteractor } from '../../interactors/scheduledPickupInteractor';
import { INTERFACE_TYPE } from '../../utils/appConst';
import container from '../config/container'

export function scheduleCancelOverduePickupsJob() {
  const scheduledPickupInteractor = container.get<scheduledPickupInteractor>(INTERFACE_TYPE.scheduledPickupInteractor);

  // Run daily at 23:59
  cron.schedule('* * * * *', async () => {
    console.log('Running scheduled pickup cancellation job...');
    const result = await scheduledPickupInteractor.cancelScheduledPickups();
    if (!result) {
      console.log('no over due pickups')
    } else {
      console.log(`Overdue pickups updated `)
    }
  })
}
