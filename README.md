# BGPHLF
i am nitol updated

doctl kubernetes cluster kubeconfig save 9f8c634e-d38a-42f3-9649-e2b0aed7436d



gobgp neighbor  -p 50051


curl -X POST http://localhost:2000/announce   -H "Content-Type: application/json"   -d '{"prefix": "192.168.100.0", "prefixLen": 24, "nextHop": "127.0.0.11", "asPath": [100, 200, 300]}'

kubectl port-forward services/gobgp-service 50051:50051


curl -X POST http://localhost:2000/revokeRoute \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "203.0.113.0",
    "prefix_len": 24,
    "next_hop": "127.0.0.11"
  }'




curl http://localhost:2000/routes



curl -X POST http://localhost:2000/validateAndAnnounce \
  -H "Content-Type: application/json" \
  -d '{
    "prefix": "203.0.113.0/24",
    "path": ["65001", "65002", "65003"]
  }'
