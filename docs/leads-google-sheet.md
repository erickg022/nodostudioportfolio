# Leads de /recursos en Google Sheets

Cuando alguien descarga la guía en `/recursos`, el sitio le pide nombre y correo (paso 1) y luego país, a qué se dedica y qué quiere aprender (paso 2). Cada registro llega como una fila nueva en una hoja de Google.

Funciona así: formulario -> `POST /api/leads` (servidor de tu sitio) -> script de Google Apps Script -> tu hoja.
La URL del script nunca llega al navegador, y el script solo acepta peticiones con tu clave secreta.

## 1. Crea la hoja

1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo "Leads Nodo Studio").
2. No hace falta poner encabezados: el script los crea solo.

## 2. Pega el script

En la hoja: **Extensiones -> Apps Script**. Borra lo que haya y pega esto. Cambia `TU_CLAVE_SECRETA` por una frase larga y aleatoria (la usarás otra vez en el paso 4).

```js
const SECRET = "TU_CLAVE_SECRETA";
const HEADERS = [
  "Fecha", "Nombre", "Correo", "País y ciudad", "País (IP)",
  "A qué se dedica", "Quiere aprender", "Recurso", "Consentimiento", "Texto de consentimiento",
];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out({ ok: false, error: "forbidden" });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    // Evita duplicados por correo + recurso.
    const emails = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    const resources = sheet.getRange(2, 8, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    for (let i = 0; i < emails.length; i++) {
      if (String(emails[i]).toLowerCase() === d.email && resources[i] === d.resource) return out({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      new Date(d.timestamp), d.name, d.email, d.country, d.ipCountry,
      d.role, d.interests, d.resource, d.consent ? "Sí" : "No", d.consentText,
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Publícalo como aplicación web

1. **Implementar -> Nueva implementación -> Tipo: Aplicación web**.
2. *Ejecutar como*: **Yo**. *Quién tiene acceso*: **Cualquier persona**.
3. Autoriza los permisos cuando Google te lo pida.
4. Copia la **URL de la aplicación web** (termina en `/exec`).

Si cambias el script después, tienes que crear una **nueva versión** (Implementar -> Administrar implementaciones -> Editar -> Nueva versión) para que el cambio se aplique.

## 4. Conecta tu sitio

Agrega estas dos variables de entorno:

- **En local:** crea `.env.local` en la raíz del proyecto (ya está ignorado por git):
  ```
  LEADS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
  LEADS_WEBHOOK_SECRET=la-misma-clave-secreta-del-script
  ```
- **En producción:** agrégalas en el panel de tu hosting (Vercel -> Settings -> Environment Variables) y vuelve a desplegar.

Mientras `LEADS_WEBHOOK_URL` no exista, el botón descarga el PDF directo, sin pedir datos.

## Qué se guarda

Fecha, nombre, correo, país y ciudad (lo que escribe la persona), país detectado por IP (solo cuando el sitio está en Vercel), a qué se dedica, qué quiere aprender, de qué recurso vino, y la casilla de consentimiento con su texto.

## Protecciones

- Casilla de consentimiento obligatoria para guardar a alguien.
- Campo trampa invisible y mínimo de 2 segundos para filtrar bots.
- Máximo 5 envíos por IP cada 10 minutos.
- Sin duplicados del mismo correo en el mismo recurso.

## Mandar correos después

Los correos se envían manualmente: filtra la hoja o copia la columna "Correo" a tu herramienta de envío. Solo escribe a quienes tienen "Sí" en Consentimiento, y ofrece siempre una forma de darse de baja.
