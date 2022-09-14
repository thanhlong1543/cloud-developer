import * as AWS from 'aws-sdk'
import {TodoAccess} from '../dataLayer/todosAcess'
import {createLogger} from "../utils/logger";
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('attachment')
const todoAccess = new TodoAccess()

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    })
    logger.info("start call of signed url", todoId)
    const presignedUrl = await s3.getSignedUrl('putObject', {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: todoId,
        Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
    })
    logger.info("done call of sign url", presignedUrl)

    const attachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    await todoAccess.updateAttachmentURL(todoId, userId, attachmentUrl) //update attachmentUrl to DB
    return presignedUrl
}