# 🔥 Configuración de Supabase para QuorumLuxe

Este documento explica cómo configurar Supabase como backend para la aplicación.

## 📋 Requisitos Previos

1. Cuenta en [Supabase](https://supabase.com)
2. Proyecto creado en Supabase

## 🚀 Paso 1: Obtener Credenciales

1. Ve a tu proyecto en Supabase
2. Navega a `Settings > API`
3. Copia las siguientes credenciales:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: La clave pública para el cliente

4. Crea un archivo `.env` en la raíz del proyecto (basándote en `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

## 🗄️ Paso 2: Crear Tablas en Supabase

### 2.1 Tabla `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rut TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_rut ON users(rut);

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden leer su propia información
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propia información
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 2.2 Tabla `daily_words` (Palabras del Día para Wordle)

```sql
CREATE TABLE daily_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palabra TEXT NOT NULL,
  fecha DATE UNIQUE NOT NULL,
  dificultad TEXT CHECK (dificultad IN ('facil', 'media', 'dificil')) DEFAULT 'media',
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice por fecha para búsquedas rápidas
CREATE INDEX idx_daily_words_fecha ON daily_words(fecha);

-- RLS
ALTER TABLE daily_words ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer palabras (pero sin ver la palabra secreta en producción)
CREATE POLICY "Anyone can read daily words" ON daily_words
  FOR SELECT USING (true);

-- Política: Solo admins pueden insertar palabras
CREATE POLICY "Only admins can insert daily words" ON daily_words
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

### 2.3 Tabla `wordle_games` (Partidas de Wordle)

```sql
CREATE TABLE wordle_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  daily_word_id UUID REFERENCES daily_words(id) NOT NULL,
  intentos_usados INT DEFAULT 0,
  completado BOOLEAN DEFAULT false,
  ganado BOOLEAN DEFAULT false,
  puntaje INT DEFAULT 0,
  tiempo_segundos INT DEFAULT 0,
  fecha_juego DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_wordle_games_user ON wordle_games(user_id);
CREATE INDEX idx_wordle_games_fecha ON wordle_games(fecha_juego);
CREATE INDEX idx_wordle_games_user_fecha ON wordle_games(user_id, fecha_juego);

-- Constraint: Un usuario solo puede jugar una vez por día
CREATE UNIQUE INDEX unique_user_daily_game ON wordle_games(user_id, daily_word_id);

-- RLS
ALTER TABLE wordle_games ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propias partidas
CREATE POLICY "Users can read own games" ON wordle_games
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar sus propias partidas
CREATE POLICY "Users can insert own games" ON wordle_games
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propias partidas
CREATE POLICY "Users can update own games" ON wordle_games
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2.4 Tabla `user_tickets` (Balance de Tickets)

```sql
CREATE TABLE user_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  tickets_disponibles INT DEFAULT 0,
  tickets_usados INT DEFAULT 0,
  tickets_comprados INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_user_tickets_user ON user_tickets(user_id);

-- RLS
ALTER TABLE user_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tickets" ON user_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets" ON user_tickets
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2.5 Tabla `tickets` (Historial de Compras)

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cantidad INT NOT NULL,
  fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metodo_pago TEXT CHECK (metodo_pago IN ('paypal', 'mercadopago', 'stripe')) NOT NULL,
  transaccion_id TEXT UNIQUE NOT NULL,
  estado_pago TEXT CHECK (estado_pago IN ('pendiente', 'pagado', 'rechazado')) DEFAULT 'pendiente',
  monto_pagado DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_transaccion ON tickets(transaccion_id);

-- RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tickets" ON tickets
  FOR SELECT USING (auth.uid() = user_id);
```

### 2.6 Tabla `player_scores` (Ranking de Jugadores)

```sql
CREATE TABLE player_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  puntaje_total INT DEFAULT 0,
  partidas_jugadas INT DEFAULT 0,
  promedio_puntaje DECIMAL(5, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para ordenar por puntaje
CREATE INDEX idx_player_scores_puntaje ON player_scores(puntaje_total DESC);

-- RLS
ALTER TABLE player_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores" ON player_scores
  FOR SELECT USING (true);
```

### 2.7 Tabla `raffles` (Sorteos)

```sql
CREATE TABLE raffles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  premio TEXT NOT NULL,
  monto_acumulado DECIMAL(12, 2) DEFAULT 0,
  estado TEXT CHECK (estado IN ('activo', 'finalizado', 'proximo')) DEFAULT 'proximo',
  ganador_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_raffles_estado ON raffles(estado);
CREATE INDEX idx_raffles_fecha_fin ON raffles(fecha_fin);

-- RLS
ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read raffles" ON raffles
  FOR SELECT USING (true);
```

## 🔐 Paso 3: Configurar Autenticación (Opcional)

Si quieres usar Supabase Auth en lugar de tu propio sistema de autenticación:

1. Ve a `Authentication > Settings` en Supabase
2. Configura los proveedores de autenticación (Email, Google, etc.)
3. Habilita email confirmations si lo deseas

## 📊 Paso 4: Insertar Datos de Prueba

### Palabras del Día para Wordle (próximos 7 días)

**IMPORTANTE: Todas las palabras deben tener exactamente 5 letras**

```sql
INSERT INTO daily_words (palabra, fecha, dificultad, categoria) VALUES
  ('PLAYA', CURRENT_DATE, 'facil', 'Lugares'),
  ('GATOS', CURRENT_DATE + 1, 'facil', 'Animales'),
  ('LIBRO', CURRENT_DATE + 2, 'facil', 'Objetos'),
  ('NOCHE', CURRENT_DATE + 3, 'media', 'Tiempo'),
  ('QUESO', CURRENT_DATE + 4, 'media', 'Comida'),
  ('RADIO', CURRENT_DATE + 5, 'media', 'Tecnología'),
  ('BRAVO', CURRENT_DATE + 6, 'media', 'Expresiones');
```

## ✅ Paso 5: Verificar Conexión

1. Asegúrate de que el archivo `.env` tiene las credenciales correctas
2. Ejecuta `npm run dev`
3. Verifica en la consola del navegador que no haya errores de Supabase

## 🔧 Funciones Útiles de Supabase

### Función para actualizar ranking automáticamente

```sql
CREATE OR REPLACE FUNCTION update_player_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar puntaje del jugador después de cada partida
  INSERT INTO player_scores (user_id, puntaje_total, partidas_jugadas, promedio_puntaje, updated_at)
  VALUES (
    NEW.user_id,
    NEW.puntaje,
    1,
    NEW.puntaje,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    puntaje_total = player_scores.puntaje_total + NEW.puntaje,
    partidas_jugadas = player_scores.partidas_jugadas + 1,
    promedio_puntaje = (player_scores.puntaje_total + NEW.puntaje) / (player_scores.partidas_jugadas + 1),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se activa al completar una partida
CREATE TRIGGER trigger_update_player_score
  AFTER INSERT ON wordle_games
  FOR EACH ROW
  WHEN (NEW.completado = true)
  EXECUTE FUNCTION update_player_score();
```

## 📝 Notas Importantes

1. **RLS (Row Level Security)**: Las políticas configuradas aseguran que los usuarios solo puedan acceder a sus propios datos
2. **Índices**: Los índices mejoran el rendimiento de las consultas
3. **Constraints**: Aseguran la integridad de los datos (ej: un usuario solo puede jugar una vez por día)

## 🐛 Troubleshooting

### Error: "No se puede conectar a Supabase"
- Verifica que las credenciales en `.env` sean correctas
- Verifica que el proyecto de Supabase esté activo

### Error: "Permission denied"
- Revisa las políticas RLS de la tabla
- Asegúrate de que el usuario esté autenticado correctamente

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
