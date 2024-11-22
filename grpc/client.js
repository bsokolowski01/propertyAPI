import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('./proto/student.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.school.StudentService('127.0.0.1:9090', grpc.ChannelCredentials.createInsecure());

client.GetStudent(null, (error, res) => {
    console.log(res);
});