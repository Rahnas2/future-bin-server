import express from 'express';
import container from '../../infrastructure/config/container'
import { webhookController } from '../controllers/webhookController';
import { INTERFACE_TYPE } from '../../utils/appConst';

const WebhookController = container.get<webhookController>(INTERFACE_TYPE.webhookController)
const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), WebhookController.onHandleStripeWebhook);

export default router;