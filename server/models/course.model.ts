import mongoose, { Document, Model, Schema } from 'mongoose';


interface IComment extends Document {
    user: object,
    comment: string;
};

interface IReview extends Document {
    user: object,
    rating: number,
    comment: string,
};

interface ILink extends Document {
    title: string,
    url: string,
};

interface ICourseDate extends Document {
    title: string,
    description: string,
    videoUrl: string,
    videoThumbnail: object,
    videoSection: string
    vdeioLength: number,
    videoPLayer: string,
    links: ILink[],
    suggestion: string,
    questions: IComment[],
}