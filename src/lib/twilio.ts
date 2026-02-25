import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendSms(to: string, body: string) {
  await sns.send(
    new PublishCommand({
      PhoneNumber: to,
      Message: body,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    })
  );
}
