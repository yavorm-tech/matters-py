import pdb
import boto3
import os
import botocore


class GetS3Objects:
    def __init__(self, region=None, awsuser=None, awspass=None):
        self.region = region
        self.awsuser = awsuser
        self.awspass = awspass
        self.s3 = boto3.resource(
            service_name='s3',
            region_name=region if (region) else os.environ.AWS_REGION,
            aws_access_key_id=awsuser if (awsuser) else os.environ.AWS_USER,
            aws_secret_access_key=awspass if (
                awspass) else os.environ.AWS_PASS,
        )

    def setDefaultBucket(self, bucketname: str = None) -> None:
        self.bucketname = bucketname

    def getFileFromS3(self, src_filename: str = None, dest_filename: str = None) -> None:
        try:
            self.s3.Bucket(self.bucketname).download_file(
                src_filename, dest_filename)
        except (botocore.exceptions.ClientError, ValueError, TypeError) as error:
            print(error)

    def getEnvFileFromS3(self, bucket=None, bucket_file=None, destfilename=None):
        # add environment variables for bucket, bucket_filename, stored_filename
        bucket_name = bucket if (bucket) else os.environ.get('AWS_BUCKET_NAME')
        bucket_filename = bucket_file if (
            bucket_file) else os.environ.get('BUCKET_ENV_FILE')
        dest_filename = destfilename if (
            destfilename) else os.environ.get("ENV_FILE_NAME")
        try:
            envfile = self.s3.Bucket(bucket).download_file(
                bucket_filename, dest_filename)
        except (botocore.exceptions.ClientError, ValueError, TypeError) as error:
            print(error)
