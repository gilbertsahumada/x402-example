# x402 - Ejemplo de Implementación

Proyecto de ejemplo que demuestra cómo implementar el protocolo de pagos x402 para crear aplicaciones de pago nativo en HTTP usando blockchain.

## ¿Qué es x402?

**x402** es un protocolo de pagos de código abierto construido sobre HTTP que permite pagos digitales nativos de internet usando blockchain. Aprovecha el código de estado HTTP 402 Payment Required para crear un flujo de pagos sin fricciones.

### Características Principales

- **Estándar Abierto**: Agnóstico a cadenas y tokens, no depende de una sola entidad
- **Nativo de HTTP**: Se integra perfectamente con solicitudes HTTP existentes
- **Tarifas Bajas**: Sin tarifas porcentuales, solo $0.001 de pago mínimo
- **Liquidación Rápida**: Tiempos de liquidación de 2 segundos
- **Sin Gas**: Sin tarifas de gas para clientes o servidores de recursos

**Filosofía Clave**: "1 línea de código para aceptar dólares digitales"

## Estructura del Proyecto

```
x402/
├── buyer/                 # Aplicación cliente de ejemplo
│   ├── package.json
│   ├── index.ts          # Implementación principal del comprador
│   ├── .env              # Configuración (almacena clave privada)
│   └── .env.example      # Plantilla
│
└── seller/               # Servidor de recursos de ejemplo
    ├── package.json
    ├── server.ts         # Implementación principal del servidor vendedor
    └── .gitignore
```

## Tecnologías Utilizadas

### Componente Comprador (Buyer)
- `x402-fetch` (v0.6.6): Biblioteca del lado del cliente para envolver fetch con el protocolo de pago x402
- `viem` (v2.38.3): Biblioteca cliente de Ethereum/blockchain para gestión de cuentas y billeteras
- `tsx` (v4.20.6): Runtime de ejecución de TypeScript

### Componente Vendedor (Seller)
- `x402-express` (v0.6.5): Middleware de Express.js para el protocolo de pago x402
- `express` (v5.1.0): Framework web para servidor HTTP
- `tsx` (v4.20.6): Runtime de ejecución de TypeScript
- `dotenv` (v17.2.3): Gestión de variables de entorno

### Infraestructura Subyacente
- Construido sobre el ecosistema x402 de Coinbase
- Usa redes blockchain (ej. Base Sepolia en el ejemplo)
- Se integra con servidores facilitadores para verificación y liquidación de pagos

## Componentes

### Comprador (`buyer/index.ts`)

**Propósito**: Demuestra cómo un cliente hace solicitudes HTTP a recursos de pago.

**Características Clave**:
- Importa funcionalidad de pago x402 desde `x402-fetch`
- Usa `viem` para crear un cliente de billetera desde una clave privada
- Envuelve la función estándar `fetch` con `wrapFetchWithPayment` para agregar capacidades de pago
- Realiza solicitudes HTTP GET a endpoints del vendedor con manejo automático de pagos
- Decodifica respuestas de pago del vendedor

**Flujo**:
1. El cliente necesita una clave privada para firmar transacciones
2. Envuelve fetch con metadatos de pago
3. Envía solicitudes al endpoint del vendedor (ej. `http://localhost:4023/mint`)
4. Maneja respuestas y confirmaciones de pago
5. Extrae datos de respuesta de pago usando `decodeXPaymentResponse`

### Vendedor (`seller/server.ts`)

**Propósito**: Demuestra cómo un servidor de recursos acepta pagos para acceder a endpoints.

**Características Clave**:
- Servidor Express.js ejecutándose en el puerto 4023
- Usa `paymentMiddleware` de `x402-express` para proteger endpoints
- Requiere pago antes de servir respuestas
- Especifica precios y requisitos de red de pago

**Detalles de Implementación**:
- **Dirección de Billetera de Pago**: `0xb322E239E5A32724633A595b8f8657F9cbb307B2` (recibe pagos)
- **Endpoint Protegido**: `GET /mint` con precio de $0.005 (0.005 USDC)
- **Red**: Base Sepolia (testnet de Ethereum)
- **Facilitador**: Usa el facilitador x402.org para verificación y liquidación de pagos

## Instalación

### Requisitos Previos
- Node.js instalado
- Yarn (gestor de paquetes)
- Una clave privada de billetera Ethereum para el comprador

### Configuración del Comprador

```bash
cd buyer
yarn install
```

Crea un archivo `.env` basado en `.env.example`:
```env
PRIVATE_KEY=tu_clave_privada_aqui
```

### Configuración del Vendedor

```bash
cd seller
yarn install
```

## Uso

### 1. Iniciar el Servidor Vendedor

```bash
cd seller
yarn tsx server.ts
```

El servidor se ejecutará en `http://localhost:4023`

### 2. Ejecutar el Cliente Comprador

En otra terminal:

```bash
cd buyer
yarn tsx index.ts
```

El comprador realizará una solicitud de pago al endpoint `/mint` del vendedor.

## Cómo Funciona el Protocolo x402

1. **Cliente solicita recurso** del servidor
2. **Servidor responde con 402 Payment Required** (si no hay pago)
3. **Cliente incluye encabezado X-PAYMENT** con firma de pago
4. **Facilitador verifica y liquida** el pago en blockchain
5. **Servidor devuelve recurso** con encabezado X-PAYMENT-RESPONSE

### Verificación y Liquidación
- Manejado por el facilitador x402 de Coinbase
- No es necesario que los servidores de recursos gestionen blockchain directamente
- Sin gas para ambas partes

### Activo Utilizado
USDC (USD Coin) - stablecoin para precios predecibles

## Casos de Uso

- **APIs**: Cobrar por llamada de API
- **Servicios de Datos**: Monetizar acceso a datos
- **Servicios de IA**: Pagar por servicios de agentes de IA
- **Descargas de Archivos**: Precios por archivo o por byte
- **Micropagos**: Cualquier servicio que requiera pagos inferiores a un dólar

## Configuración

### Variables de Entorno (Comprador)

```env
PRIVATE_KEY=tu_clave_privada_de_ethereum
```

### Configuración del Middleware (Vendedor)

```typescript
paymentMiddleware(
  "0xb322E239E5A32724633A595b8f8657F9cbb307B2",  // Dirección receptora
  {
    "GET /mint": {
      price: "0.005",           // Precio en USD
      network: "base-sepolia"   // Red blockchain
    }
  },
  {
    url: "https://x402.org/facilitator"  // Servicio facilitador
  }
)
```

## Red de Prueba

Este proyecto usa **Base Sepolia** (testnet de Ethereum) para desarrollo y pruebas.

Pago mínimo: **$0.001** (1 centavo)

## Autor

Gilberts Ahumada

## Licencia

ISC

## Recursos Adicionales

- [Documentación de x402](https://x402.org)
- [GitHub de x402](https://github.com/coinbase/x402)
- [Base Network](https://base.org)
