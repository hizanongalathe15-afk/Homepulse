# Infra

Kubernetes deployment manifests for HomePulse.

## Files
- `deployment.yaml` — Deployment specs
- `service.yaml` — Service definitions
- `ingress.yaml` — Ingress / routing rules
- `configmap.yaml` — Environment config maps

## Usage
```bash
kubectl apply -f infra/
```

## Notes
- Update image tags in `deployment.yaml` before applying.
- Secrets should be managed via Kubernetes Secrets or external secret managers.
- Ingress assumes a compatible controller (e.g., NGINX Ingress).
