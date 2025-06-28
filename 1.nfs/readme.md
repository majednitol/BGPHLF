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
2. sudo mount -o nolocks -t nfs 167.71.238.9:/mnt/nfs_share ./nfs_clientshare

cd usr/share/nginx/html

sudo cp -R prerequsite/* ../nfs_clientshare

## minikube NFS (local deployment)
minikube start --disk-size=20g --memory=7835 --cpus=8
sudo chmod -R 777 ../nfs_share      
minikube start --mount --mount-string="/Users/majedurrahman/nfs_share:/mnt/data"
minikube delete
minikube stop
 minikube mount ../nfs_share:/mnt/data  


doctl kubernetes cluster kubeconfig save 994d2367-c91f-49e0-98ec-f56d2d3887d2
 
ssh root@139.59.74.85
vm p@$$W0rd


kubectl delete deployments --all
kubectl delete services --all




| **Org Role** | **Old Org Name** | **Old Domain**   | **New Org Name** | **New Domain (Production)** | **Connection Profile Name** | **MSP ID**  |
| ------------ | ---------------- | ---------------- | ---------------- | --------------------------- | --------------------------- | ---------- |
| AFRINIC      | org1             | org1.example.com | afrinic          | afrinic.rono.com            | connection-afrinic.json     | AfrinicMSP |
| APNIC        | org2             | org2.example.com | apnic            | apnic.rono.com              | connection-apnic.json       | ApnicMSP   |
| ARIN         | org3             | org3.example.com | arin             | arin.rono.com               | connection-arin.json        | ArinMSP    |
| RIPE NCC     | org4             | org4.example.com | ripencc          | ripencc.rono.com            | connection-ripencc.json     | RipenccMSP |
| LACNIC       | org5             | org5.example.com | lacnic           | lacnic.rono.com             | connection-lacnic.json      | LacnicMSP  |
| RONO         | org6             | org6.example.com | rono             | rono.rono.com               | connection-rono.json        | RonoMSP    |