# Base de conocimiento, MercadoSur Tech

Empresa ficticia usada para el piloto. Es el documento que Meraki consulta para armar cada respuesta. Cada sección `##` es una entrada que el backend puede recuperar por categoría o palabra clave.

## RESET DE CONTRASEÑA

Para resetear la contraseña, el cliente debe ir a app.mercadosur.com/reset, ingresar su email corporativo y seguir las instrucciones. El link de reset vence en 24 horas. Si no recibe el email, verificar la carpeta de spam. Si el problema persiste, verificar que la cuenta no esté suspendida por falta de pago.

## CONSULTA DE FACTURA

Las facturas se generan el día 1 de cada mes y están disponibles en app.mercadosur.com/facturacion. El cliente puede descargar PDF o solicitar reenvío por email desde esa sección. Si hay una discrepancia en el monto, el cliente debe enviar captura de pantalla y derivar al equipo de finanzas. No prometer ajustes ni créditos sin aprobación.

## CAMBIO DE DATOS ADMINISTRATIVOS

El cliente puede modificar razón social, RUT y dirección fiscal desde Configuración > Datos de facturación. Los cambios se reflejan en la próxima factura. No se pueden modificar facturas ya emitidas. Si el cliente necesita modificar una factura emitida, derivar a finanzas.

## PROBLEMAS DE ACCESO / LOGIN

Si el cliente no puede acceder, verificar:
1. Que la cuenta esté activa (no suspendida por falta de pago).
2. Que use el email correcto (a veces confunden email personal con corporativo).
3. Que no tenga bloqueado el navegador o las cookies deshabilitadas.
4. Que intente desde otro navegador o modo incógnito.

Si nada de lo anterior funciona, escalar a soporte técnico nivel 2.

## UPGRADE / DOWNGRADE DE PLAN

Los cambios de plan se aplican al inicio del próximo ciclo de facturación. Para upgrade, el cliente puede hacerlo directamente desde Configuración > Mi Plan. Para downgrade, debe contactar a su ejecutivo de cuenta porque puede implicar pérdida de funcionalidades. No se hacen reembolsos proporcionales por días no usados.

Planes disponibles:
- Starter: hasta 50 usuarios, 10 GB de almacenamiento, soporte por email.
- Growth: hasta 200 usuarios, 50 GB de almacenamiento, soporte prioritario.
- Enterprise: usuarios y almacenamiento ilimitados, soporte dedicado 24/7.

## ESTADO DEL SERVICIO / INCIDENTES

El estado actual del servicio está disponible en status.mercadosur.com. Si hay un incidente activo, informar al cliente el link de status y el tiempo estimado de resolución si está publicado. No prometer tiempos que no estén confirmados en la página de status. Si el cliente reporta un problema que no aparece en status, registrar como incidente potencial.

## PROBLEMAS CON PAGOS / PASARELA

Si el cliente reporta un cobro duplicado o un pago rechazado, verificar en el sistema de billing el estado de la transacción. Para cobros duplicados, registrar el caso y derivar a finanzas con el comprobante del cliente. Para pagos rechazados, sugerir al cliente que verifique con su banco o intente con otra tarjeta. No prometer devoluciones sin autorización de finanzas.

## CANCELACIONES Y REEMBOLSOS

IMPORTANTE: Meraki NO puede procesar cancelaciones ni reembolsos bajo ninguna circunstancia. Estos casos SIEMPRE deben derivarse a un operador humano. Informar al cliente que su solicitud fue registrada y que será contactado por un representante en un plazo máximo de 24 horas hábiles. Registrar el motivo de la cancelación para análisis de churn.

## INTEGRACIONES Y API

MercadoSur Tech ofrece API REST documentada en docs.mercadosur.com/api. Las integraciones disponibles incluyen facturación electrónica (DGI Uruguay), pasarelas de pago (MercadoPago, Stripe) y CRM (Salesforce, HubSpot). Para problemas con integraciones, solicitar al cliente el error exacto y la documentación del endpoint que están usando. Escalar a equipo técnico si el error no está documentado.
