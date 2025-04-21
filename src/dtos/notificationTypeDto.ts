export const notificationTypesArr = [
    'payment_success',
    'payment_failed',
    'pickup_accepted',
    'pickup_cancelled',
    'pickup_completed',
    'registeration_accepted',
    'registeration_rejected'
  ] as const;

  
  export type notificationTypesDto = typeof notificationTypesArr[number];
