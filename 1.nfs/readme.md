## NFS Server

1. sudo apt update
2. sudo apt install nfs-kernel-server
3. sudo mkdir -p /mnt/nfs_share
4. sudo chown -R nobody:nogroup /mnt/nfs_share/
5. sudo chmod 777 /mnt/nfs_share/
6. echo "/mnt/nfs_share *(rw,sync,no_subtree_check,insecure)" | sudo tee -a /etc/exports  
7. sudo exportfs -a
8. sudo systemctl restart nfs-kernel-server

## NFS Client (Ubuntu)

1. sudo apt update
2. sudo apt install nfs-common
3. sudo mkdir -p /mnt/nfs_clientshare
4. sudo mount -t nfs 139.59.74.85:/mnt/nfs_share ./nfs_clientshare
5. ls -l /mnt/nfs_clientshare/

## NFS Client (MacOS)

1. mkdir nfs_clientshare
2. sudo mount -o nolocks -t nfs 212.2.247.23:/mnt/nfs_share ./nfs_clientshare

cd usr/share/nginx/html

sudo cp -R prerequsite/* ../nfs_clientshare


sudo chmod 777 chaincode connection-profile configtx organizations -R

sudo rm -rf chaincode connection-profile scripts fabric-ca configtx organizations
## minikube NFS (local deployment)
minikube start --disk-size=20g --memory=7835 --cpus=8
sudo chmod -R 777 ../nfs_share      
minikube start --mount --mount-string="/Users/majedurrahman/nfs_share:/mnt/data"
minikube delete
minikube stop
 minikube mount ../nfs_share:/mnt/data  


civo kubernetes create bgphlf \
  --size g4s.kube.large \
  --nodes 3 \
  --region LON1 \
  --save

 civo kubernetes remove bgphlf --region LON1 --yes
civo instance create bgphlf ubuntu --size g4s.small --wait

ssh civo@212.2.247.23
vm ELrmo3Qq1t
./scripts/ccp.sh 

kubectl delete deployments --all
kubectl delete services --all



<!-- backup full system data  -->
1. sudo chmod -R 777 ~/coding/backup_data
2. sudo rsync -av --progress --delete ~/coding/nfs_clientshare/ ~/coding/backup_data/
3. sudo crontab -e
4. * * * * * rsync -av --delete /Users/majedurrahman/coding/nfs_clientshare/ /Users/majedurrahman/coding/backup_data/

// check crontab
 sudo crontab -l


sudo cp -R ~/coding/backup_data/. ~/coding/nfs_clientshare/



gobgp global rib add 103.108.202.0/23 origin igp -p 50052
gobgp global rib
gobgp -p 50053 neighbor 127.0.0.12 adj-in 103.108.202.0/23 validation
gobgp global rib del 103.108.202.0/23 origin igp -p 50052
gobgp global rib add 103.108.202.0/23 origin igp aspath 300 -p 50052
