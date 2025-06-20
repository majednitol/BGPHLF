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
4. sudo mount -t nfs 159.89.174.36:/mnt/nfs_share ./nfs_clientshare
5. ls -l /mnt/nfs_clientshare/

## NFS Client (MacOS)

1. mkdir nfs_clientshare
2. sudo mount -o nolocks -t nfs 159.89.174.36:/mnt/nfs_share ./nfs_clientshare

cd usr/share/nginx/html

sudo cp -R prerequsite/* ../nfs_clientshare

## minikube NFS (local deployment)
minikube start --disk-size=20g --memory=7835 --cpus=8
sudo chmod -R 777 ../nfs_share      
minikube start --mount --mount-string="/Users/majedurrahman/nfs_share:/mnt/data"
minikube delete
minikube stop
 minikube mount ../nfs_share:/mnt/data  


doctl kubernetes cluster kubeconfig save 625ee50d-5a16-4728-9441-7d9731572036
 
ssh root@167.71.238.9
vm p@$$W0rd


