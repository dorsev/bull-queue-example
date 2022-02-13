import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';
import process from 'process'
const myFirstQueue = new Bull('Operations-queue');

const consumeAndDie = async () : Promise<void> => {
    console.info('I am up and running ' + process.pid)
    const nextJob = await myFirstQueue.getNextJob()
    if (nextJob) {
        console.info('I am processing a task ' + process.pid)
        await processJob(nextJob.data)
        process.exit(0)
    }
}

const processJob = async (op: Operation): Promise<void> => {
    console.info('Im working on %o', { id: op.id, data: op.operationData })
    await new Promise(resolve => setTimeout(resolve, 1000 * 10));
    console.info('done working on %o', { id: op.id, data: op.operationData })
}

consumeAndDie()