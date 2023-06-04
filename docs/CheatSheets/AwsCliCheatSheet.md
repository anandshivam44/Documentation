## AWS Cli Cheat Sheet  
#### Get caller identity / get current user details
```bash
aws sts get-caller-identity
```
#### Quick create a bucket
```bash
BUCKET_NAME=my-bucket-$(date +%s)
aws s3 mb $BUCKET_NAME
```
#### Replace a File in s3, from local to s3
```bash
aws s3 cp C:\Users\sanand\filename.ext s3://bucket-name/path/filename.ext
```
or
```bash
aws s3 cp C:\Users\sanand\filename.ext s3://bucket-name/path/
```
#### Sync node of of one local folder to node of another folder in s3
```bash
aws s3 sync C:\Users\sanand\path1 s3://bucket-name/folder1/folder2/folder3/ 
```
#### Sync node of of one folder in s3 to node of another folder in s3
```bash
aws s3 sync s3://bucket-name-1/folder1/folder2/folder3/ s3://bucket-name-2/folder1/folder2/folder3/ 
```
#### Empty a s3 bucket
```bash
$BUCKET_NAME="bucket-name"
```
```bash
aws s3 rm s3://$BUCKET_NAME/ --recursive
```
#### Remove a s3 bucket
```bash
$BUCKET_NAME="bucket-name"
```
```bash
aws s3 rm s3://$BUCKET_NAME/ --recursive
aws s3 rb s3://$BUCKET_NAME
```
#### Copy a folder from local repo to s3 bucket or s3 folder
```bash
 aws s3 cp $LOCAL_PATH\ s3://$BUCKET_NAME/folder1/folder2/ --recursive
```

#### Expand disk aws ec2
```bash
INSTANCE_ID=
VOLUME_ID=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID | jq -r '.Reservations[0].Instances[0].BlockDeviceMappings[0].Ebs.VolumeId')

aws ec2 modify-volume --size 40 --volume-id $VOLUME_ID
```
#### Get Internal Ip of ec2 with a specific tag
```bash
aws ec2 describe-instances --filters Name=tag:created_by,Values=shivam   | jq -r '.Reservations[]?.Instances[]? | .PrivateIpAddress'
```
#### Execute Lambda Remotely
```bash
aws lambda invoke \
    --cli-binary-format raw-in-base64-out \
    --function-name FUNCTION_NAME \
    --log-type Tail \
    --payload '{"key": "value"}' \
    response.json
```
