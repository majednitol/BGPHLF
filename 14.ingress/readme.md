1. Installing and Configuring Cert-Manager

```kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v1.3.1/cert-manager.yaml```

2. Setting up issuer
```kubectl apply -f issuer.yaml```

3.  the ingress-nginx for aws 

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/aws/deploy.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/do/deploy.yaml


nslookup www.patient-bio.majedurnitol.site