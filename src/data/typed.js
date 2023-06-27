/**
 * boarder : {
 *  name : string,
 *  pos : number,
 *  id: uuid
 * },
 * 
 * boarders: boarder[]
 * 
 * 
 * bucket : {
 *  name: string,
 *  pos: number,
 *  id: uuid
 *  boarderId: uuid(id of the board the bucket is linked to)
 * }
 *
 * buckets : bucket[]
 * 
 * 
 * task : {
 *  title: string,
 *  description: string,
 *  status; string,
 *  pos: number,
 *  id: uuid,
 *  bucketId: uuid(id of the bucket the task is linked to)
 * }
 * 
 * tasks; task[]
 * 
 * 
 * subTask: {
 *  title: string,
 *  isCompleted: boolean
 *  pos: number,
 *  id: uuid,
 *  taskId: uuid(id of the task the the subtask is linked to)
 * }
 * 
 * 
 * 
 * 
 * Initial Transformation 
 * 
 * boards
 */