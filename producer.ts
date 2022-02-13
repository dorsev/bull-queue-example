import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';

const operationsQueue = new Bull('Operations-queue1');
const ops = Array(100 + 1).fill(0).map((x, i) => {
    return ({ id: i, operationData: `working on ${i}`} as Operation)
})
const produce = async () : Promise<void> => {
    ops.forEach(async op => {
        console.info('IM adding a task %o', { op })
        const job = await operationsQueue.add(op)
        console.info('finished adding a task %o', { job: job.data })

    })
}

produce()