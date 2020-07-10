docker build -t tkircsi/complex-client:latest -t tkircsi/complex-client:$SHA -f ./client/Dockerfile ./client
docker build -t tkircsi/complex-server -t tkircsi/complex-server:$SHA -f ./server/Dockerfile ./server
docker build -t tkircsi/complex-worker -t tkircsi/complex-worker:$SHA -f ./worker/Dockerfile ./worker
docker push tkircsi/complex-client:latest
docker push tkircsi/complex-server:latest
docker push tkircsi/complex-worker:latest
docker push tkircsi/complex-client:$SHA
docker push tkircsi/complex-server:$SHA
docker push tkircsi/complex-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=tkircsi/complex-server:$SHA
kubectl set image deployments/worker-deployment worker=tkircsi/complex-worker:$SHA
kubectl set image deployments/client-deployment client=tkircsi/complex-client:$SHA