import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';
import process from 'process'
const myFirstQueue = new Bull('Operations-queue1', {  defaultJobOptions: { removeOnComplete: true, removeOnFail: true} });

const consumeAndDie = async () : Promise<void> => {
    console.info('I am up and running ' + process.pid)
    const nextJob = await myFirstQueue.getNextJob()
    if (nextJob) {
        await processJob(nextJob.data)
        await nextJob.moveToCompleted('succeeded', true);

    }
    else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await consumeAndDie()
    }
}

const processJob = async (op: Operation): Promise<void> => {
    console.info('Im working on %o', { id: op.id, data: op.operationData })
    await new Promise(resolve => setTimeout(resolve, 1000 * 10));
    console.info('done working on %o', { id: op.id, data: op.operationData })
    process.exit(0)
}

consumeAndDie()
// myFirstQueue.process(function (job, done) {
//     console.log('Received message', job.data);
//     done();
//   });