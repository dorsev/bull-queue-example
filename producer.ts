import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';

const operationsQueue = new Bull('Operations-queue');
const ops = Array(100 + 1).fill(0).map(x => {
    return ({ id: x, operationData: `working on ${x}`} as Operation)
})
const produce = async () : Promise<void> => {
    ops.forEach(async op => {
        const job = await operationsQueue.add(op)
    })
}

produce()