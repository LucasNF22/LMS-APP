import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotification extends Document{
    title: string,
    message: string,
    status: string,
    userId: string,
};

const notificationSchema = new Schema<INotification>({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        default: "No leído"
    },
}, { timestamps: true });

const NotificationModel: Model<INotification> = mongoose.model( 'Notificacion', notificationSchema );

export default NotificationModel;