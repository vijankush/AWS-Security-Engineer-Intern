import subprocess
import boto3
import select
import time
import json


class KinesisInputStream:

    def __init__(self, in_stream_name, in_file_name):
        self.kinesis = boto3.client('kinesis')
        self.in_file = in_file_name
        self.in_stream = in_stream_name

    def put_records(self):
        fout = subprocess.Popen(['tail', '-f', self.in_file],
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        p = select.poll()
        p.register(fout.stdout)
        data = []

        while True:
            rec_count = 0
            while rec_count <= 99:
                if p.poll(1):

                    record = fout.stdout.readline()
                    time.sleep(1)
                    data.append(
                        dict({'Data': record, 'PartitionKey': '123'}))
                    rec_count += 1

        res = self.kinesis.put_records(StreamName=self.in_stream, Records=data)
        time.sleep(0.1)
        print(str(rec_count - res['FailedRecordCount']) + ' records pushed to ' + self.in_stream + ' stream successfully.')


if __name__ == "__main__":

    inp_stream = KinesisInputStream(
        "test", "/test")
    inp_stream.put_records()
