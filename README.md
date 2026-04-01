# SenGarage Backend

## Ejecutar

```bash
npm install
npm run dev
```

Este backend valida el ID token de Firebase, intenta guardar en Firestore por REST y, si falla, usa un respaldo local por usuario para que la app no se caiga con 500.
