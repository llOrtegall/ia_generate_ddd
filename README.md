# User Management API - Clean Architecture + DDD

Un ejemplo robusto de Clean Architecture con Domain-Driven Design (DDD) para la gestión de usuarios usando Bun, TypeScript, Express y Sequelize.

## 🏗️ Arquitectura

```
src/
├── domain/                 # Capa de Dominio (Business Logic)
│   ├── entities/          # Entidades y Value Objects
│   ├── repositories/      # Interfaces de Repositorios
│   └── services/          # Servicios de Dominio
├── application/           # Capa de Aplicación (Use Cases)
│   ├── dtos/             # Data Transfer Objects
│   └── use-cases/        # Casos de Uso
├── infrastructure/        # Capa de Infraestructura (External Concerns)
│   ├── database/         # Configuración de Base de Datos
│   └── repositories/     # Implementaciones de Repositorios
├── interfaces/           # Capa de Interfaces (Controllers & Routes)
│   ├── controllers/      # Controladores HTTP
│   └── routes/          # Definición de Rutas
├── container.ts          # Inyección de Dependencias
├── app.ts               # Configuración de Express
└── index.ts             # Punto de Entrada
```

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Configurar base de datos (primera vez)
bun run db:setup

# Ejecutar en modo desarrollo
bun run dev

# Construir para producción
bun run build

# Ejecutar en producción
bun start
```

## 🛠️ Scripts de Base de Datos

```bash
# Configuración segura (crea tablas solo si no existen)
bun run db:setup

# Modificar tablas existentes para que coincidan con los modelos
bun run db:setup:alter

# Recrear todas las tablas (⚠️ BORRA TODOS LOS DATOS)
bun run db:setup:force
```

## 🗄️ Configuración de Base de Datos

Crea un archivo `.env` basado en `.env.example` y configura las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=user_management
NODE_ENV=development
DB_SYNC_MODE=safe
```

### 🔄 Modos de Sincronización

La variable `DB_SYNC_MODE` controla cómo Sequelize maneja las tablas:

| Modo | Descripción | Uso recomendado |
|------|------------|-----------------|
| `safe` | Crea tablas solo si no existen | ✅ **Producción y desarrollo inicial** |
| `alter` | Modifica tablas existentes para coincidir con modelos | 🔧 **Desarrollo con cambios de esquema** |
| `force` | Borra y recrea todas las tablas | ⚠️ **Solo desarrollo (BORRA DATOS)** |
| `none` | No sincroniza tablas | 📋 **Usar migraciones manuales** |

## 📡 API Endpoints

### Crear Usuario
```bash
POST /api/users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

### Obtener Usuario por ID
```bash
GET /api/users/{id}
```

### Obtener Todos los Usuarios
```bash
GET /api/users
```

### Health Check
```bash
GET /health
```

## 🏛️ Principios DDD Implementados

### Value Objects
- `UserId`: Identificador único inmutable
- `Email`: Validación de formato de email
- `Password`: Validación de longitud mínima

### Entidades
- `User`: Entidad raíz del agregado con lógica de negocio

### Servicios de Dominio
- `UserDomainService`: Validación de unicidad de email

### Repositorios
- Patrón Repository con interface en dominio e implementación en infraestructura

### Casos de Uso
- `CreateUserUseCase`: Crear nuevo usuario
- `GetUserUseCase`: Obtener usuario por ID
- `GetAllUsersUseCase`: Obtener todos los usuarios

## 🛡️ Validación

Se utiliza Zod para validación de DTOs:
- Validación de email
- Validación de longitud de contraseña
- Validación de nombre mínimo

## 📦 Dependencias Principales

- **Bun**: Runtime y package manager
- **Express**: Framework web
- **Sequelize**: ORM para base de datos
- **MySQL**: Base de datos relacional
- **Zod**: Validación de esquemas
- **TypeScript**: Tipado estático

## 🎯 Características

- ✅ Clean Architecture
- ✅ Domain-Driven Design
- ✅ Dependency Injection
- ✅ Value Objects
- ✅ Repository Pattern
- ✅ Use Cases Pattern
- ✅ Input Validation
- ✅ Error Handling
- ✅ TypeScript
- ✅ Minimal Code
- ✅ Production Ready
