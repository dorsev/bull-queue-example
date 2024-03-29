import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';

const operationsQueue = new Bull('Operations-queue18');
const ops = Array(3).fill(0).map((x, i) => {
    return ({ id: i, operationData: `working on ${i}`} as Operation)
})
const produce = async () : Promise<void> => {
    ops.forEach(async op => {
        console.info('IM adding a task %o', { op })
        const job = await operationsQueue.add(op)
        console.info('finished adding a task %o', { job: job.data })
        await job.finished()
        console.info('Job  with id %o just ended', { job: job.data })
    })
}

produce()