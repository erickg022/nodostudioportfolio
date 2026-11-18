# Leads de nodostudio.dev en Google Sheets

El sitio guarda dos tipos de registros en la misma hoja de Google:

- **Descargas de recursos** (`/recursos`): nombre, correo, país, a qué se dedica, qué quiere aprender. Van a la **primera pestaña** de la hoja.
- **Preregistros de workshops** (`/cursos`): además, experiencia con IA, modalidad preferida, herramientas que ya tiene y cómo los conoció. Van a una pestaña nueva llamada **Preregistros**, que el script crea sola.

Funciona así: formulario -> `POST /api/leads` (servidor de tu sitio) -> script de Google Apps Script -> tu hoja.
La URL del script nunca llega al navegador, y el script solo acepta peticiones con tu clave secreta.

## 1. Crea la hoja

1. Crea una hoja de cálculo nueva en Google Sheets (por ejemplo "Leads Nodo Studio").
2. No hace falta poner encabezados: el script los crea solo.
3. No muevas la pestaña de descargas del primer lugar: el script guarda las descargas en la primera pestaña.

## 2. Pega el script

En la hoja: **Extensiones -> Apps Script**. Borra lo que haya y pega esto. Cambia `TU_CLAVE_SECRETA` por una frase larga y aleatoria (la usarás otra vez en el paso 4).

```js
const SECRET = "TU_CLAVE_SECRETA";

const DOWNLOAD_HEADERS = [
  "Fecha", "Nombre", "Correo", "País y ciudad", "País (IP)",
  "A qué se dedica", "Quiere aprender", "Recurso", "Consentimiento", "Texto de consentimiento",
];
const PREREG_HEADERS = [
  "Fecha", "Workshop", "Nombre", "Correo", "País y ciudad", "País (IP)", "A qué se dedica",
  "Experiencia con IA", "Modalidad", "Herramientas", "Cómo nos conoció", "Consentimiento", "Texto de consentimiento",
];

function doGet() {
  return out({ ok: true, message: "funcionando" });
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out({ ok: false, error: "forbidden" });
    return d.kind === "prereg" ? savePrereg(d) : saveDownload(d);
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function saveDownload(d) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(DOWNLOAD_HEADERS);
  // Evita duplicados por correo + recurso.
  if (exists(sheet, 3, d.email, 8, d.resource)) return out({ ok: true, duplicate: true });
  sheet.appendRow([
    new Date(d.timestamp), d.name, d.email, d.country, d.ipCountry,
    d.role, d.interests, d.resource, d.consent ? "Sí" : "No", d.consentText,
  ]);
  return out({ ok: true });
}

function savePrereg(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Preregistros") || ss.insertSheet("Preregistros");
  if (sheet.getLastRow() === 0) sheet.appendRow(PREREG_HEADERS);
  // Evita duplicados por correo + workshop.
  if (exists(sheet, 4, d.email, 2, d.courseTitle)) return out({ ok: true, duplicate: true });
  sheet.appendRow([
    new Date(d.timestamp), d.courseTitle, d.name, d.email, d.country, d.ipCountry, d.role,
    d.experience, d.modality, d.tools, d.source, d.consent ? "Sí" : "No", d.consentText,
  ]);
  return out({ ok: true });
}

function exists(sheet, emailCol, email, keyCol, key) {
  const rows = sheet.getLastRow() - 1;
  if (rows < 1) return false;
  const emails = sheet.getRange(2, emailCol, rows, 1).getValues().flat();
  const keys = sheet.getRange(2, keyCol, rows, 1).getValues().flat();
  for (let i = 0; i < emails.length; i++) {
    if (String(emails[i]).toLowerCase() === email && keys[i] === key) return true;
  }
  return false;
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

Para comprobar que quedó bien, abre esa URL en una ventana de incógnito: debe mostrar `{"ok":true,"message":"funcionando"}`.

### Si ya tenías el script publicado (actualizarlo)

Para añadir los preregistros a un script que ya está funcionando:

1. Abre **Extensiones -> Apps Script**, borra el código y pega el de arriba. Usa **la misma clave secreta** que ya tienes en Vercel.
2. **Implementar -> Administrar implementaciones -> lápiz (editar) -> Versión: Nueva versión -> Implementar**.
3. La URL `/exec` **no cambia**, así que no tienes que tocar Vercel.

Mientras no actualices el script, los preregistros no se pierden: el sitio también los manda en el formato de las descargas, así que llegan a la primera pestaña con la columna "Recurso" como `curso:<workshop>` y las respuestas juntas en "Quiere aprender". Al actualizar, pasan a la pestaña **Preregistros** con una columna por pregunta.

## 4. Conecta tu sitio

Agrega estas dos variables de entorno:

- **En local:** crea `.env.local` en la raíz del proyecto (ya está ignorado por git):
  ```
  LEADS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
  LEADS_WEBHOOK_SECRET=la-misma-clave-secreta-del-script
  ```
- **En producción:** agrégalas en el panel de tu hosting (Vercel -> Settings -> Environment Variables, tipo **Sensitive**, sin el prefijo `NEXT_PUBLIC_`) y vuelve a desplegar.

Mientras `LEADS_WEBHOOK_URL` no exista, el botón de descarga de `/recursos` baja el PDF directo, sin pedir datos, y el preregistro de `/cursos` muestra un aviso de que no está disponible.

## Qué se guarda

**Descargas:** fecha, nombre, correo, país y ciudad (lo que escribe la persona), país detectado por IP (solo cuando el sitio está en Vercel), a qué se dedica, qué quiere aprender, de qué recurso vino, y la casilla de consentimiento con su texto.

**Preregistros:** fecha, workshop, nombre, correo, país y ciudad, país por IP, a qué se dedica, experiencia con IA, modalidad (en vivo online, grabado, presencial, me da igual), herramientas que ya tiene, cómo los conoció, y el consentimiento con su texto.

## Protecciones

- Casilla de consentimiento obligatoria para guardar a alguien.
- Campo trampa invisible y mínimo de 2 segundos para filtrar bots.
- Máximo 5 envíos por IP cada 10 minutos.
- Sin duplicados del mismo correo en el mismo recurso o workshop.

## Mandar correos después

Los correos se envían manualmente: filtra la hoja o copia la columna "Correo" a tu herramienta de envío. Solo escribe a quienes tengan "Sí" en Consentimiento, y ofrece siempre una forma de darse de baja.
