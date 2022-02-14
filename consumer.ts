import Bull, { Job, DoneCallback } from 'bull'
import { Operation } from './Operation';
import process from 'process'

const CONCURRENT_PROCESSING = 10
const JOB_TIMEOUT_MILI = 30 * 60 * 1000
const LOCK_DURATION_TIME = 2 * 60 * 1000

const myFirstQueue = new Bull('Operations-queue4', { 
    settings: {
        lockDuration: LOCK_DURATION_TIME,
    },
    defaultJobOptions:
    {
         timeout: JOB_TIMEOUT_MILI,
         removeOnComplete: true,
         removeOnFail: true
    } });


const consumer = (job: Job, done: DoneCallback): void => { 
    const data: Operation = job.data
    processJob(data).then(x => {
        done()
    }).catch(e => done(e))
    .then(x => process.exit(0))
}

const consumeAndDie = async () : Promise<void> => {
    console.info('I am up and running ' + process.pid)
    myFirstQueue.process(1, consumer).catch(e => {
        console.info('failed to define processing function for operation queue %s, with error %o', process.pid, e)
      })
    console.info('I died')

}

const processJob = async (op: Operation): Promise<void> => {
    console.info('Im working on %o', { id: op.id, data: op.operationData })
    await new Promise(resolve => setTimeout(resolve, 1000 * 50));
    console.info('done working on %o', { id: op.id, data: op.operationData })
    process.exit(0)
}

consumeAndDie()
// myFirstQueue.process(function (job, done) {
//     console.log('Received message', job.data);
//     done();
//   });