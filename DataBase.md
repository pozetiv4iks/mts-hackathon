users: 

| field         | type      | nullable | unique | key | default           |
| ------------- | --------- | -------- | ------ | --- | ----------------- |
| user_id       | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| username      | text      | FALSE    | TRUE   |     |                   |
| password_hash | text      | FALSE    |        |     |                   |
| user_role     | enum      | FALSE    |        |     | "user"            |
| created_at    | timestamp | FALSE    |        |     | now()             |
roles:
- user
- admin

--------------------------------------------------------------------------
tenants:

| field      | type      | nullable | unique | key | default           |
| ---------- | --------- | -------- | ------ | --- | ----------------- |
| tenant_id  | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| name       | text      | FALSE    |        |     |                   |
| owner_id   | uuid      | FALSE    |        | FK  |                   |
| status     | enum      | FALSE    |        |     | "ACTIVE"          |
| created_at | timestamp | FALSE    |        |     | now()             |
statuses:
- ACTIVE
- INACTIVE

--------------------------------------------------------------------------
plans:

| field      | type    | nullable | unique | key | default           |
| ---------- | ------- | -------- | ------ | --- | ----------------- |
| plan_id    | uuid    | FALSE    | TRUE   | PK  | gen_random_uuid() |
| name       | text    | FALSE    |        |     |                   |
| price      | real    | TRUE     |        |     |                   |
| cpu_limit  | float   | TRUE     |        |     |                   |
| ram_limit  | float   | TRUE     |        |     |                   |
| disk_limit | float   | TRUE     |        |     |                   |
| is_custom  | boolean | FALSE    |        |     | FALSE             |

--------------------------------------------------------------------------
tenant_quotas:

| field            | type      | nullable | unique | key | default           |
| ---------------- | --------- | -------- | ------ | --- | ----------------- |
| quota_id         | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| tenant_id        | uuid      | FALSE    |        | FK  |                   |
| plan_id          | uuid      | FALSE    |        | FK  |                   |
| payment_status   | enum      | FALSE    |        |     | "UNPAID"          |
| total_price      | float     | FALSE    |        |     |                   |
| total_cpu_limit  | float     | FALSE    |        |     |                   |
| total_ram_limit  | float     | FALSE    |        |     |                   |
| total_disk_limit | float     | FALSE    |        |     |                   |
| updated_at       | timestamp | FALSE    |        |     | now()             |
| created_at       | timestamp | FALSE    |        |     | now()             |
payment_statuses:
- UNPAID
- PAID
- REFUNDED

--------------------------------------------------------------------------
virtual_machines:

| field      | type      | nullable | unique | key | default           |
| ---------- | --------- | -------- | ------ | --- | ----------------- |
| vm_id      | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| tenant_id  | uuid      | FALSE    |        | FK  |                   |
| created_by | uuid      | FALSE    |        | FK  |                   |
| name       | text      | FALSE    |        |     | "Virtual Machine" |
| cpu        | float     | FALSE    |        |     |                   |
| ram        | float     | FALSE    |        |     |                   |
| disk       | float     | FALSE    |        |     |                   |
| status     | text      | FALSE    |        |     | "ACTIVE"          |
| created_at | timestamp | FALSE    |        |     | now()             |
statuses:
- ACTIVE
- INACTIVE

--------------------------------------------------------------------------
vm_logs:

| field      | type      | nullable | unique | key | default           |
| ---------- | --------- | -------- | ------ | --- | ----------------- |
| vm_log_id  | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| vm_log     | json      | FALSE    |        |     |                   |
| vm_id      | uuid      | FALSE    |        | FK  |                   |
| created_at | timestamp | FALSE    |        |     | now()             |

--------------------------------------------------------------------------
custom_plan_requests:

| field      | type      | nullable | unique | key | default           |
| ---------- | --------- | -------- | ------ | --- | ----------------- |
| request_id | uuid      | FALSE    | TRUE   | PK  | gen_random_uuid() |
| tenant_id  | uuid      | FALSE    |        | FK  |                   |
| cpu        | float     | FALSE    |        |     |                   |
| ram        | float     | FALSE    |        |     |                   |
| disk       | float     | FALSE    |        |     |                   |
| status     | enum      | FALSE    |        |     | "PENDING"         |
| created_at | timestamp | FALSE    |        |     | now()             |
statuses:
- PENDING
- APPROVED
- REJECTED

--------------------------------------------------------------------------
user_tenant:

|field|type|nullable|unique|key|default|
|---|---|---|---|---|---|
|user_tenant_id|uuid|FALSE|TRUE|PK|gen_random_uuid()|
|user_id|uuid|FALSE||FK||
|tenant_id|uuid|FALSE||FK||
