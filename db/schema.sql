-- Modelo de datos de Meraki.
-- En el piloto, el CRM y el log de tickets viven en Google Sheets; este esquema los describe como tablas
-- para migrarlos a una base relacional (PostgreSQL) cuando el volumen lo pida.

create table clientes (
  email            text primary key,
  nombre           text not null,
  empresa          text,
  plan             text not null check (plan in ('Starter', 'Pro', 'Growth', 'Enterprise')),
  estado_pago      text not null check (estado_pago in ('Al día', 'Vencido')),
  fecha_registro   date not null,
  total_tickets    integer not null default 0,
  ultimo_contacto  date,
  notas            text
);

create table tickets (
  ticket_id          uuid primary key,
  creado_en          timestamptz not null default now(),
  email_origen       text references clientes (email),
  mensaje            text not null,
  categoria          text not null,
  urgencia           text not null check (urgencia in ('Alta', 'Media', 'Baja')),
  confianza          numeric(3, 2) not null check (confianza between 0 and 1),
  kb_seccion_usada   text,
  respuesta          text,
  estado             text not null check (estado in
                       ('pendiente_envío', 'requiere_revisión', 'escalado_humano', 'enviado', 'revertido')),
  notas_operador     text,
  csat               smallint check (csat between 1 and 5),
  enviado_en         timestamptz
);

create index tickets_estado_idx on tickets (estado);
create index tickets_categoria_idx on tickets (categoria);

-- Carga de los datos del piloto (desde la raíz del repo, con psql):
-- \copy clientes from 'db/crm_piloto.csv' with (format csv, header true)
