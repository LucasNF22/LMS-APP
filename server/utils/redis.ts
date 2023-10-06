require('dotenv').config();
import { Redis } from 'ioredis';

const redisClient = () => {
    if(process.env.REDIS_URL){
        console.log('Redis connected');
        return process.env.REDIS_URL;
    };

    throw new Error('Fallo de conexión con Redis');
};

export const redis = new Redis(redisClient()) ;