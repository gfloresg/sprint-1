// TASK 3 — Modales, ScrollView y SafeAreaView
// Este archivo implementa la tarjeta de perfil interactiva con modal de compartir,
// una lista horizontal de proyectos y protección de áreas seguras (notch/barras).

// Importamos React y el hook useState para manejar estado en componentes funcionales
import { useState } from 'react';
// Importamos los componentes de React Native que usaremos en la interfaz
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Button,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
// Importamos SafeAreaProvider y SafeAreaView para respetar las áreas seguras del dispositivo
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Paleta de colores centralizada: evita repetir colores "hardcodeados" en los estilos
const COLORS = {
  background: '#EEF1F6', // Color de fondo general de la pantalla
  card: '#FFFFFF', // Fondo de la tarjeta
  text: '#1B1F2A', // Color principal del texto
  muted: '#6B7280', // Texto secundario/gris
  primary: '#2F6FED', // Color primario (botones, acentos)
  primaryLight: '#E6EEFF', // Variante clara del primario (fondos suaves)
  border: '#E5E7EB', // Bordes y divisores
  online: '#22C55E', // Indicador de estado en línea
  offline: '#9CA3AF', // Indicador de estado fuera de línea
};

// Biografía larga del perfil (se muestra con opción de expandir/contraer)
const BIO =
  'Building cross-platform apps with React Native. I love clean layouts, accessible design and sharing what I learn with the community. When I am not coding, I mentor junior developers, contribute to open source and explore new coffee shops around the city.';

// Lista de habilidades que el usuario puede seleccionar/deseleccionar
const SKILLS = ['React Native', 'JavaScript', 'UI Design', 'Git', 'Flexbox'];
// Número base de seguidores (se usa para calcular el valor derivado)
const BASE_FOLLOWERS = 1200;
// Longitud máxima permitida para el mensaje del compositor
const MAX_MESSAGE = 140;

// Proyectos recientes que se muestran en un ScrollView horizontal
const PROJECTS = [
  { name: 'Weather App', tech: 'React Native', stars: 128 },
  { name: 'Task Tracker', tech: 'Expo', stars: 96 },
  { name: 'Photo Gallery', tech: 'Expo Camera', stars: 74 },
  { name: 'Recipe Book', tech: 'FlatList', stars: 61 },
  { name: 'Chat UI', tech: 'Flexbox', stars: 45 },
];

// Contactos disponibles para compartir el perfil desde el modal
const CONTACTS = [
  'Ana López',
  'Ben Carter',
  'Carla Ruiz',
  'David Kim',
  'Elena Petrova',
  'Farid Hassan',
  'Grace Liu',
  'Hugo Silva',
];

// Función auxiliar: agrega separadores de miles (1200 -> '1,200')
function formatCount(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Componente principal de la aplicación
export default function App() {
  // Estado: indica si el usuario está siguiendo el perfil
  const [isFollowing, setIsFollowing] = useState(false);
  // Estado: controla si el compositor de mensajes está abierto
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  // Estado: texto actual del mensaje (input controlado)
  const [message, setMessage] = useState('');
  // Estado: indica si la biografía está expandida
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  // Estado: indica si el usuario aparece en línea
  const [isOnline, setIsOnline] = useState(true);
  // Estado: arreglo de habilidades seleccionadas (se actualiza sin mutar)
  const [selectedSkills, setSelectedSkills] = useState([]);
  // Estado: controla la visibilidad del modal de compartir
  const [modalVisible, setModalVisible] = useState(false);
  // Estado: arreglo de contactos seleccionados en el modal (sin mutaciones)
  const [selectedContacts, setSelectedContacts] = useState([]);

  // Valor derivado: seguidores calculados a partir del estado (no es otro useState)
  const followers = BASE_FOLLOWERS + (isFollowing ? 1 : 0);
  // Valor derivado: deshabilita "Send" si el mensaje está vacío o solo tiene espacios
  const isSendDisabled = message.trim().length === 0;
  // Valor derivado: deshabilita compartir si no hay contactos seleccionados
  const isShareDisabled = selectedContacts.length === 0;
  // Datos de estadísticas que se renderizan en la fila de stats
  const stats = [
    { label: 'Projects', value: '24' },
    { label: 'Followers', value: formatCount(followers) },
    { label: 'Following', value: '180' },
  ];

  // Manejador: alterna el estado de seguir / dejar de seguir
  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
  };

  // Manejador: abre o cierra el compositor de mensajes
  const handleMessagePress = () => {
    setIsComposerOpen(!isComposerOpen);
  };

  // Manejador: envía el mensaje, muestra alerta y limpia/cierra el compositor
  const handleSendPress = () => {
    Alert.alert('Message sent', `To Alex: "${message.trim()}"`);
    setMessage('');
    setIsComposerOpen(false);
  };

  // Manejador: agrega o quita una habilidad del arreglo sin mutarlo
  const handleSkillPress = (skill) => {
    // Nunca modificamos el arreglo directamente: creamos uno nuevo
    setSelectedSkills(
      selectedSkills.includes(skill)
        ? selectedSkills.filter((item) => item !== skill)
        : [...selectedSkills, skill]
    );
  };

  // Manejador: cierra el modal y limpia los contactos seleccionados
  const closeModal = () => {
    setModalVisible(false);
    setSelectedContacts([]);
  };

  // Manejador: agrega o quita un contacto del arreglo sin mutarlo
  const handleContactPress = (name) => {
    setSelectedContacts(
      selectedContacts.includes(name)
        ? selectedContacts.filter((item) => item !== name)
        : [...selectedContacts, name]
    );
  };

  // Manejador: confirma el compartir, muestra alerta y cierra el modal
  const handleConfirmShare = () => {
    Alert.alert('Profile shared', `Sent to: ${selectedContacts.join(', ')}`);
    closeModal();
  };

  // Renderizado de la interfaz
  return (
    // SafeAreaProvider debe envolver la app para que SafeAreaView funcione correctamente
    <SafeAreaProvider>
      {/* SafeAreaView protege el contenido de notch, barras de estado y zonas inseguras */}
      <SafeAreaView style={styles.safe}>
        {/* ScrollView principal: permite desplazar toda la pantalla verticalmente */}
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.screenContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tarjeta del perfil */}
          <View style={styles.card}>
            {/* Imagen de banner superior */}
            <Image
              source={require('./assets/banner.png')}
              style={styles.banner}
              resizeMode="cover"
            />
            {/* Cuerpo de la tarjeta con padding */}
            <View style={styles.body}>
              {/* Fila de encabezado: avatar + información de texto */}
              <View style={styles.headerRow}>
                {/* Avatar presionable: alterna estado online/offline */}
                <Pressable onPress={() => setIsOnline(!isOnline)}>
                  <Image source={require('./assets/avatar.png')} style={styles.avatar} />
                  {/* Indicador de estado: cambia color según isOnline */}
                  <View style={[styles.onlineBadge, !isOnline && styles.offlineBadge]} />
                </Pressable>
                {/* Bloque de texto del encabezado (nombre, rol, ubicación) */}
                <View style={styles.headerText}>
                  <Text style={styles.name}>Alex Rivera</Text>
                  <Text style={styles.role}>Mobile Developer</Text>
                  <Text style={styles.location}>Lisbon, Portugal</Text>
                </View>
              </View>

              {/* Biografía: se muestra en 3 líneas o completa según el estado */}
              <Text style={styles.bio} numberOfLines={isBioExpanded ? undefined : 3}>
                {BIO}
              </Text>
              {/* Enlace para expandir/contraer la biografía */}
              <Pressable onPress={() => setIsBioExpanded(!isBioExpanded)}>
                <Text style={styles.link}>{isBioExpanded ? 'Show less' : 'Read more'}</Text>
              </Pressable>

              {/* Fila de estadísticas (Projects, Followers, Following) */}
              <View style={styles.statsRow}>
                {stats.map((item, index) => (
                  <View
                    key={item.label}
                    style={[styles.stat, index < stats.length - 1 && styles.statDivider]}
                  >
                    <Text style={styles.statValue}>{item.value}</Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {/* Lista de habilidades como etiquetas presionables/seleccionables */}
              <View style={styles.tags}>
                {SKILLS.map((skill) => {
                  // Determinamos si la habilidad actual está seleccionada
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <Pressable
                      key={skill}
                      onPress={() => handleSkillPress(skill)}
                      // Estilo con función: aplica feedback visual cuando se presiona
                      style={({ pressed }) => [
                        styles.tag,
                        isSelected && styles.tagSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                        {skill}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {/* Texto de ayuda que muestra cuántas habilidades hay seleccionadas */}
              <Text style={styles.hint}>
                Tap a skill to select it · {selectedSkills.length} selected
              </Text>

              {/* Título de la sección de proyectos recientes */}
              <Text style={styles.sectionTitle}>RECENT PROJECTS</Text>
              {/* ScrollView horizontal: lista de tarjetas de proyectos */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.projectsRow}
              >
                {PROJECTS.map((project) => (
                  <View key={project.name} style={styles.projectCard}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectTech}>{project.tech}</Text>
                    <Text style={styles.projectStars}>★ {project.stars}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Botones de acción: Follow/Following y Message/Close */}
              <View style={styles.actions}>
                {/* Botón Follow: alterna seguimiento y cambia estilo/etiqueta */}
                <Pressable
                  onPress={handleFollowPress}
                  style={({ pressed }) => [
                    styles.button,
                    isFollowing ? styles.buttonFollowing : styles.buttonPrimary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.buttonText, !isFollowing && styles.buttonTextPrimary]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
                {/* Botón Message: abre o cierra el compositor */}
                <Pressable
                  onPress={handleMessagePress}
                  style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                >
                  <Text style={styles.buttonText}>{isComposerOpen ? 'Close' : 'Message'}</Text>
                </Pressable>
              </View>

              {/* Renderizado condicional: compositor visible solo cuando isComposerOpen es true */}
              {isComposerOpen && (
                <View style={styles.composer}>
                  {/* TextInput controlado: value + onChangeText + maxLength */}
                  <TextInput
                    style={styles.input}
                    placeholder="Write a message to Alex"
                    placeholderTextColor={COLORS.muted}
                    value={message}
                    onChangeText={(newText) => setMessage(newText)}
                    maxLength={MAX_MESSAGE}
                  />
                  {/* Pie del compositor: contador y botón Send */}
                  <View style={styles.composerFooter}>
                    <Text style={styles.counter}>
                      {message.length}/{MAX_MESSAGE} characters
                    </Text>
                    {/* Botón Send: deshabilitado si el mensaje está vacío/solo espacios */}
                    <Pressable
                      disabled={isSendDisabled}
                      onPress={handleSendPress}
                      style={({ pressed }) => [
                        styles.sendButton,
                        isSendDisabled && styles.sendButtonDisabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.sendText}>Send</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Botón nativo Button: abre el modal de compartir perfil */}
              <View style={styles.shareWrapper}>
                <Button
                  title="Share profile"
                  color={COLORS.primary}
                  onPress={() => setModalVisible(true)}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Modal: se muestra sobre la pantalla cuando modalVisible es true */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          {/* Overlay oscuro: cubre la pantalla; al tocar fuera se cierra el modal */}
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
            {/* Hoja/tarjeta del modal con el contenido */}
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Share profile</Text>
              <Text style={styles.sheetText}>Choose who gets Alex's profile.</Text>

              {/* ScrollView vertical dentro del modal: lista de contactos con altura máxima */}
              <ScrollView style={styles.contactList}>
                {CONTACTS.map((name) => {
                  // Determinamos si el contacto está seleccionado
                  const isSelected = selectedContacts.includes(name);
                  return (
                    <Pressable
                      key={name}
                      onPress={() => handleContactPress(name)}
                      style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]}
                    >
                      <Text style={styles.contactName}>{name}</Text>
                      {/* Checkbox visual: muestra marca cuando está seleccionado */}
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkMark}>✓</Text>}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Botón para confirmar compartir: deshabilitado si no hay selección */}
              <Pressable
                disabled={isShareDisabled}
                onPress={handleConfirmShare}
                style={({ pressed }) => [
                  styles.shareButton,
                  isShareDisabled && styles.shareButtonDisabled,
                  pressed && !isShareDisabled && styles.pressed,
                ]}
              >
                <Text style={styles.shareButtonText}>
                  {isShareDisabled ? 'Select contacts' : `Share with ${selectedContacts.length}`}
                </Text>
              </Pressable>

              {/* Botón Cancelar: cierra el modal y limpia la selección */}
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [styles.sheetClose, pressed && styles.pressed]}
              >
                <Text style={styles.sheetCloseText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Sombra de la tarjeta adaptada por plataforma (iOS usa shadow*, Android usa elevation)
const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  android: {
    elevation: 6,
  },
  default: {},
});

// Hoja de estilos creada con StyleSheet.create para mejor organización y rendimiento
const styles = StyleSheet.create({
  // Estilo del contenedor SafeAreaView
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Estilo base del ScrollView principal
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Estilo del contenido interno del ScrollView (permite centrar y dar padding)
  screenContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  // Tarjeta principal
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    ...cardShadow,
  },
  // Imagen de banner
  banner: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // Cuerpo interno de la tarjeta
  body: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Fila del encabezado (avatar + texto)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -44,
  },
  // Avatar circular con borde
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.card,
  },
  // Indicador de estado en línea (posición absoluta sobre el avatar)
  onlineBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.online,
    borderWidth: 3,
    borderColor: COLORS.card,
  },
  // Variante del indicador cuando está fuera de línea
  offlineBadge: {
    backgroundColor: COLORS.offline,
  },
  // Contenedor de texto del encabezado
  headerText: {
    flex: 1,
    marginLeft: 14,
    marginTop: 52,
  },
  // Nombre del perfil
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Rol/profesión
  role: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
  // Ubicación
  location: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  // Biografía
  bio: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.text,
  },
  // Enlace "Read more / Show less"
  link: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Fila de estadísticas con bordes superior e inferior
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  // Cada celda de estadística
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  // Divisor derecho entre estadísticas
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  // Valor numérico de la estadística
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Etiqueta de la estadística
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  // Contenedor de etiquetas de habilidades (con wrap)
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  // Etiqueta individual
  tag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  // Texto de la etiqueta
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Estilo de etiqueta seleccionada
  tagSelected: {
    backgroundColor: COLORS.primary,
  },
  // Texto de etiqueta seleccionada
  tagTextSelected: {
    color: '#FFFFFF',
  },
  // Texto de ayuda bajo las etiquetas
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.muted,
  },
  // Fila de botones de acción
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  // Estilo base de botón presionable
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  // Variante primaria (relleno)
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  // Variante para estado "Following"
  buttonFollowing: {
    backgroundColor: COLORS.primaryLight,
  },
  // Texto base de botones
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Texto blanco para botón primario
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  // Feedback visual al presionar (opacidad)
  pressed: {
    opacity: 0.6,
  },
  // Contenedor del compositor de mensajes
  composer: {
    marginTop: 16,
  },
  // Campo de texto del mensaje
  input: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  // Pie del compositor (contador + enviar)
  composerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  // Contador de caracteres
  counter: {
    fontSize: 12,
    color: COLORS.muted,
  },
  // Botón de enviar
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  // Botón de enviar deshabilitado
  sendButtonDisabled: {
    backgroundColor: COLORS.offline,
  },
  // Texto del botón enviar
  sendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Contenedor del botón "Share profile"
  shareWrapper: {
    marginTop: 12,
    alignItems: 'center',
  },
  // Overlay semitransparente del modal
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Tarjeta/hoja del modal
  sheet: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  // Título del modal
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Texto descriptivo del modal
  sheetText: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 14,
    color: COLORS.muted,
  },
  // Botón de cierre/cancelar del modal
  sheetClose: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  // Texto del botón de cierre
  sheetCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Título de sección (RECENT PROJECTS)
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.muted,
  },
  // Contenedor interno del ScrollView horizontal de proyectos
  projectsRow: {
    gap: 12,
    paddingRight: 4,
  },
  // Tarjeta individual de proyecto
  projectCard: {
    width: 140,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
  },
  // Nombre del proyecto
  projectName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Tecnología del proyecto
  projectTech: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.muted,
  },
  // Estrellas del proyecto
  projectStars: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Lista de contactos con scroll vertical dentro del modal
  contactList: {
    maxHeight: 240,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  // Fila de contacto
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  // Nombre del contacto
  contactName: {
    fontSize: 15,
    color: COLORS.text,
  },
  // Checkbox circular
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.offline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Checkbox seleccionado
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  // Marca dentro del checkbox
  checkMark: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Botón de compartir en el modal
  shareButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  // Botón de compartir deshabilitado
  shareButtonDisabled: {
    backgroundColor: COLORS.offline,
  },
  // Texto del botón compartir
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
