import cron from 'node-cron';
import { scheduledPickupInteractor } from '../../interactors/scheduledPickupInteractor';
import { INTERFACE_TYPE } from '../../utils/appConst';
import container from '../config/container'

export function scheduleCancelOverduePickupsJob() {
  const interactor = container.get<scheduledPickupInteractor>(INTERFACE_TYPE.scheduledPickupInteractor);

  // Run daily at 23:59
  cron.schedule('59 23 * * *', async () => {
    console.log('Running scheduled pickup cancellation job...');
    const result = await interactor.cancelScheduledPickups();
    console.log('result ', result)
    console.log(`${result.modifiedCount} Overdue pickups cancelled `);
  });
}
      