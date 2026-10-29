// =============================================
// TAREA PRÁCTICA: TARJETA DE PERFIL (REACT NATIVE)
// =============================================
// Objetivo: Crear una tarjeta de perfil siguiendo los pasos del README.md
// Componentes permitidos: View, Text, Image, StyleSheet y Platform
// Todo el código está comentado en español para entender qué hace cada cosa

// Importamos los componentes necesarios desde React Native
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

// -------------------- DATOS A MOSTRAR --------------------
// Estos datos ya vienen definidos, NO debemos modificarlos
const BIO =
  'Building cross-platform apps with React Native. I love clean layouts, accessible design and sharing what I learn with the community.';

// Array con las estadísticas que mostraremos en la tarjeta
const STATS = [
  { label: 'Projects', value: '24' },      // Proyectos
  { label: 'Followers', value: '1.2k' },   // Seguidores
  { label: 'Following', value: '180' },    // Siguiendo
];

// Array con las habilidades que mostraremos como etiquetas
const SKILLS = ['React Native', 'JavaScript', 'UI Design', 'Git', 'Flexbox'];

// -------------------- PALETA DE COLORES --------------------
// Centralizamos todos los colores en un objeto para NO repetirlos
// Esto cumple con el requisito: "No color should be repeated as a hard-coded string"
const COLORS = {
  background: '#EEF1F6',  // Color de fondo de la pantalla
  card: '#FFFFFF',        // Color blanco de la tarjeta
  text: '#1F2937',        // Color principal para textos
  muted: '#6B7280',       // Color gris para textos secundarios
  primary: '#2563EB',     // Color azul principal (botones, rol)
  primaryLight: '#DBEAFE',// Color azul claro para etiquetas
  border: '#E5E7EB',      // Color gris claro para bordes
  online: '#22C55E',      // Color verde para indicador "online"
};

// -------------------- COMPONENTE PRINCIPAL --------------------
export default function App() {
  return (
    // Vista principal que ocupa toda la pantalla
    <View style={styles.screen}>
      {/* Tarjeta de perfil blanca */}
      <View style={styles.card}>
        
        {/* PASO 2: IMAGEN DEL BANNER */}
        {/* Se coloca en la parte superior de la tarjeta, ocupando todo el ancho */}
        <Image
          source={require('./assets/banner.png')} // Imagen local del banner
          style={styles.banner}                   // Aplicamos estilos
          resizeMode="cover"                     // Cubre todo el espacio sin distorsionarse
        />

        {/* PASO 3: FILA DEL ENCABEZADO (AVATAR + INFORMACIÓN PERSONAL) */}
        {/* Usamos flexDirection: 'row' para poner avatar y textos lado a lado */}
        <View style={styles.headerRow}>
          
          {/* PASO 4: CONTENEDOR DEL AVATAR CON INSIGNIA ONLINE */}
          {/* Envolvemos avatar y badge para poder posicionar la insignia con absolute */}
          <View style={styles.avatarWrapper}>
            {/* Imagen del avatar */}
            <Image
              source={require('./assets/avatar.png')} // Imagen local del avatar
              style={styles.avatar}                   // Aplicamos estilos circulares
              resizeMode="cover"                     // Cubre el espacio circular
            />
            {/* PASO 4: Insignia verde "online" en la esquina inferior derecha */}
            <View style={styles.onlineBadge} />
          </View>

          {/* Bloque con nombre, rol y ubicación (ocupa el resto del ancho con flex: 1) */}
          <View style={styles.headerText}>
            {/* PASO 1: TEXTOS PRINCIPALES */}
            <Text style={styles.name}>Alex Rivera</Text>        {/* Nombre - más grande y en negrita */}
            <Text style={styles.role}>Mobile Developer</Text>   {/* Rol - color primario */}
            <Text style={styles.location}>Lisbon, Portugal</Text>{/* Ubicación - color gris */}
          </View>
        </View>

        {/* PASO 1: BIOGRAFÍA */}
        {/* numberOfLines={3} limita el texto a máximo 3 líneas */}
        <Text style={styles.bio} numberOfLines={3}>
          {BIO}
        </Text>

        {/* PASO 3: FILA DE ESTADÍSTICAS */}
        {/* Usamos .map() para renderizar cada estadística */}
        <View style={styles.statsRow}>
          {STATS.map((stat, index) => (
            <View
              key={stat.label} // Clave única obligatoria
              style={[
                styles.stat,                        // Estilo base para cada estadística
                index !== 0 && styles.statDivider,  // Añade divisor vertical excepto el primero
              ]}
            >
              {/* Valor numérico de la estadística (grande y en negrita) */}
              <Text style={styles.statValue}>{stat.value}</Text>
              {/* Etiqueta de la estadística (pequeña y gris) */}
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* PASO 4: TÍTULO DE HABILIDADES */}
        <Text style={styles.skillsTitle}>SKILLS</Text>

        {/* PASO 4: ETIQUETAS DE HABILIDADES */}
        {/* flexWrap: 'wrap' permite que pasen a la siguiente línea si no caben */}
        <View style={styles.tagsContainer}>
          {SKILLS.map((skill) => (
            <View key={skill} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
            </View>
          ))}
        </View>

        {/* PASO 4: BOTONES DE ACCIÓN */}
        {/* Dos botones lado a lado con igual ancho (flex: 1) */}
        <View style={styles.buttonsRow}>
          {/* Botón "Follow" - relleno con color primario */}
          <View style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonPrimaryText}>Follow</Text>
          </View>
          {/* Botón "Message" - solo borde con color primario */}
          <View style={[styles.button, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>Message</Text>
          </View>
        </View>

      </View>
    </View>
  );
}

// -------------------- ESTILOS CON STYLESHEET.CREATE --------------------
// Todos los estilos se definen aquí. No hay estilos inline en el JSX
const styles = StyleSheet.create({
  // ===== ESTILOS DE LA PANTALLA =====
  screen: {
    flex: 1,                      // Ocupa todo el espacio disponible
    justifyContent: 'center',     // Centra la tarjeta verticalmente en la pantalla
    paddingHorizontal: 20,        // Espacio lateral
    backgroundColor: COLORS.background, // Fondo gris claro
  },

  // ===== ESTILOS DE LA TARJETA =====
  card: {
    backgroundColor: COLORS.card, // Fondo blanco
    borderRadius: 20,             // Esquinas redondeadas
    padding: 20,                  // Espacio interno
    paddingTop: 0,                // Sin padding superior para que el banner llegue a los bordes
    overflow: 'hidden',           // Oculta lo que se salga para respetar bordes redondeados del banner
    // Sombra que funciona tanto en iOS como en Android
    ...Platform.select({
      ios: {
        shadowColor: '#000',           // Color de la sombra
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento
        shadowOpacity: 0.1,            // Opacidad
        shadowRadius: 12,              // Difuminado
      },
      android: {
        elevation: 6, // Elevación para sombra en Android
      },
    }),
  },

  // ===== ESTILOS DEL BANNER =====
  banner: {
    width: '100%',      // Ocupa todo el ancho de la tarjeta
    height: 120,        // Altura fija
    resizeMode: 'cover',// Escala para cubrir sin distorsionar
  },

  // ===== ESTILOS DE LA FILA DEL ENCABEZADO =====
  headerRow: {
    flexDirection: 'row',     // Elementos en fila (horizontal)
    alignItems: 'flex-start', // Alineados desde arriba
    marginTop: -48,           // Margen negativo para superponer avatar sobre el banner
  },

  // Contenedor que envuelve el avatar y la insignia
  avatarWrapper: {
    width: 96,
    height: 96,
  },

  // ===== ESTILOS DEL AVATAR =====
  avatar: {
    width: 96,                // Ancho
    height: 96,               // Alto
    borderRadius: 48,         // La mitad del ancho/alto = círculo perfecto
    borderWidth: 4,           // Grosor del borde blanco
    borderColor: COLORS.card, // Color del borde
    backgroundColor: COLORS.border, // Color de fondo por si falla la imagen
  },

  // ===== ESTILOS DE LA INSIGNIA ONLINE =====
  onlineBadge: {
    position: 'absolute',     // Posición absoluta respecto al avatarWrapper
    bottom: 2,                // Separado 2px desde abajo
    right: 2,                 // Separado 2px desde la derecha
    width: 18,                // Ancho del círculo
    height: 18,               // Alto del círculo
    borderRadius: 9,          // Círculo perfecto
    backgroundColor: COLORS.online, // Verde
    borderWidth: 2,           // Borde blanco
    borderColor: COLORS.card, // Color del borde
  },

  // ===== ESTILOS DEL BLOQUE DE TEXTO DEL ENCABEZADO =====
  headerText: {
    flex: 1,          // Ocupa todo el espacio restante en la fila
    marginLeft: 12,   // Separación a la izquierda del avatar
    marginTop: 56,    // Se baja para que empiece debajo del banner
  },

  // ===== ESTILOS DE LOS TEXTOS PRINCIPALES =====
  name: {
    fontSize: 22,           // Tamaño grande
    fontWeight: 'bold',     // Negrita
    color: COLORS.text,     // Color principal
  },

  role: {
    fontSize: 16,           // Tamaño medio
    color: COLORS.primary,  // Color azul primario
    marginTop: 2,           // Pequeña separación superior
  },

  location: {
    fontSize: 14,           // Tamaño un poco más pequeño
    color: COLORS.muted,    // Color gris
    marginTop: 2,           // Pequeña separación superior
  },

  // ===== ESTILOS DE LA BIOGRAFÍA =====
  bio: {
    fontSize: 14,           // Tamaño de texto
    color: COLORS.text,     // Color principal
    lineHeight: 20,         // Altura de línea para mejor legibilidad
    marginTop: 12,          // Separación superior
  },

  // ===== ESTILOS DE LA FILA DE ESTADÍSTICAS =====
  statsRow: {
    flexDirection: 'row',        // Estadísticas en fila
    borderTopWidth: 1,           // Borde superior
    borderBottomWidth: 1,        // Borde inferior
    borderColor: COLORS.border,  // Color de los bordes
    marginTop: 16,               // Separación superior
    paddingVertical: 12,         // Espaciado vertical interno
  },

  // Estilo base para cada estadística
  stat: {
    flex: 1,              // Cada estadística ocupa el mismo ancho
    alignItems: 'center', // Centrado horizontal
  },

  // Divisor vertical entre estadísticas
  statDivider: {
    borderLeftWidth: 1,           // Borde izquierdo
    borderLeftColor: COLORS.border, // Color del divisor
  },

  // Valor numérico de la estadística
  statValue: {
    fontSize: 18,           // Tamaño grande
    fontWeight: 'bold',     // Negrita
    color: COLORS.text,     // Color principal
  },

  // Etiqueta de la estadística
  statLabel: {
    fontSize: 12,           // Tamaño pequeño
    color: COLORS.muted,    // Color gris
    marginTop: 2,           // Separación superior
  },

  // ===== ESTILOS DE LAS HABILIDADES =====
  // Título "SKILLS"
  skillsTitle: {
    fontSize: 12,               // Tamaño pequeño
    fontWeight: '600',          // Semi-negrita
    color: COLORS.muted,        // Color gris
    textTransform: 'uppercase', // Todo en mayúsculas
    letterSpacing: 1,           // Espaciado entre letras
    marginTop: 16,              // Separación superior
    marginBottom: 8,            // Separación inferior
  },

  // Contenedor de las etiquetas
  tagsContainer: {
    flexDirection: 'row',   // En fila
    flexWrap: 'wrap',       // Permite salto de línea
    gap: 8,                 // Espacio entre etiquetas
  },

  // Cada etiqueta individual
  tag: {
    backgroundColor: COLORS.primaryLight, // Fondo azul claro
    paddingHorizontal: 12,                // Espaciado horizontal
    paddingVertical: 6,                  // Espaciado vertical
    borderRadius: 999,                   // Forma de píldora (muy redondeado)
  },

  // Texto dentro de la etiqueta
  tagText: {
    fontSize: 13,          // Tamaño de texto
    color: COLORS.primary, // Color azul primario
  },

  // ===== ESTILOS DE LOS BOTONES =====
  // Fila que contiene ambos botones
  buttonsRow: {
    flexDirection: 'row', // Botones lado a lado
    gap: 12,              // Espacio entre botones
    marginTop: 20,        // Separación superior
  },

  // Estilo base para ambos botones
  button: {
    flex: 1,                    // Ambos botones ocupan el mismo ancho
    paddingVertical: 10,        // Espaciado vertical
    borderRadius: 12,           // Esquinas redondeadas
    alignItems: 'center',       // Centrado horizontal
    justifyContent: 'center',   // Centrado vertical
  },

  // Botón primario "Follow"
  buttonPrimary: {
    backgroundColor: COLORS.primary, // Fondo azul
  },

  // Texto del botón primario
  buttonPrimaryText: {
    color: COLORS.card,      // Texto blanco
    fontWeight: '600',       // Semi-negrita
    fontSize: 15,            // Tamaño de texto
  },

  // Botón con borde "Message"
  buttonOutline: {
    backgroundColor: 'transparent', // Sin fondo
    borderWidth: 1,                 // Grosor del borde
    borderColor: COLORS.primary,    // Borde azul
  },

  // Texto del botón con borde
  buttonOutlineText: {
    color: COLORS.primary,   // Texto azul
    fontWeight: '600',       // Semi-negrita
    fontSize: 15,            // Tamaño de texto
  },
});
