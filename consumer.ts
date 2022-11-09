import Bull, { Job, DoneCallback, Queue } from 'bull'
import { Operation } from './Operation';
import process from 'process'

const LOCK_DURATION_TIME = 2 * 60 * 1000

const myFirstQueue = new Bull('Operations-queue16', { 
    settings: {
        lockDuration: LOCK_DURATION_TIME,
        maxStalledCount: 0,
    },
    defaultJobOptions:
    {
        //  timeout: JOB_TIMEOUT_MILI,
         removeOnComplete: true,
         removeOnFail: true
    } });
myFirstQueue.on('completed', (job) => {
    const totalTimeTook = job.timestamp
    console.info('I am here %o', { start: job.timestamp, processTime: job.processedOn, finished: job.finishedOn})
})
let hasProcessedJob = false
const consumer = (job: Job, done: DoneCallback): void => { 
    const data: Operation = job.data
    if (hasProcessedJob) {
        return
    }
    hasProcessedJob = true
    myFirstQueue.close(false)
    processJob(data).then(x => {
        done()
    }).catch(e => done(e))
    .then(async x => { 
        console.info('Game over.. waiting for 3 seconds');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.info('wait is over');
        myFirstQueue.close(true)
        process.exit(1)
    })
}
const printStatus = async (bullQueue: Queue<any>): Promise<void> => {
    console.info('myFirstQueue is %o', { active: myFirstQueue.getActive() })
    const waitingCount = myFirstQueue.getWaitingCount()
    const allInfoCount = myFirstQueue.getJobCounts()
    console.info('I am here %o', { waitingCount, allInfoCount })
    await new Promise(resolve => setTimeout(resolve, 2000));
    return printStatus(bullQueue)
}

const consumeAndDie = async () : Promise<void> => {
    console.info('I am up and running ' + process.pid)
    
    myFirstQueue.process(1, consumer).catch(e => {
        console.info('failed to define processing function for operation queue %s, with error %o', process.pid, e)
    })

}

const processJob = async (op: Operation): Promise<void> => {
    console.info('Im working on %o', { id: op.id, data: op.operationData })
    await new Promise(resolve => setTimeout(resolve, 100*1000))
    console.info('done working on %o', { id: op.id, data: op.operationData })
}

consumeAndDie()
// myFirstQueue.process(function (job, done) {
//     console.log('Received message', job.data);
//     done();
//   });