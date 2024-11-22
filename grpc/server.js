import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('./proto/student.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(proto.school.StudentService.service, {
    GetStudent: (req, res) => {
        res(null,{
            studentId: 0,
            firstName: "Stefan",
            lastName: "Mostowiak"
        });
    }
});

server.bindAsync("127.0.0.1:9090", grpc.ServerCredentials.createInsecure() , (err) => {
    if (err!== null) {
        console.error(err);
    }
    console.log("Started grpc server");
});