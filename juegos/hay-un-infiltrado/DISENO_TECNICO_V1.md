# DOCUMENTO DE DISEÑO TÉCNICO — V1.0

**Proyecto:** ROCK AND BIRRA: ¡HAY UN INFILTRADO!  
**Ambientación:** NaguaYork, año 2010. **Plataformas:** Android y PC (HTML5 responsive).

## Visión
Comedia de sospecha social y exploración original ambientada en la sede de Rock And Birra Radio. Charlie Sure intenta salvar una transmisión especial. Hay sabotajes, tareas, pistas, birras escondidas y un infiltrado entre los panas. No se debe copiar la interfaz, gráficos, música o personajes de otros juegos.

## Equipo y canon
**Protagonista:** Charlie Sure, gorra RB, lentes transparentes, barba ligera, cabello liso largo en cola con canas.

**Elenco/sospechosos:** La Flaca (estratega y observadora, tratada con respeto), Lino («¡Dame un chance!»), Nacho («Coño, chamo»), Beto (logística), Yoda (tecnología), El Pato y El Lobo (panas chilenos), Pirulo (humor y comentarios impredecibles). El infiltrado es un rol aleatorio de partida; no implica alterar el canon literario de los personajes.

**Continuidad:** no introducir la frecuencia 99.1 en el videojuego anterior al Libro II. Bola 9 no es un lugar sobrenatural. Emisora, equipos y birras como escenario lúdico ficticio.

## Modo individual (V0.2)
- Lienzo lógico 1200×760 con escalado responsive Canvas 2D.
- Charlie se mueve con flechas/WASD o cruceta; E/ACCIÓN inicia interacciones.
- Ocho NPC con desplazamiento por puntos aleatorios; infiltrado asignado aleatoriamente.
- Cinco minitareas de selección: consola, archivo musical, monitores, nevera y transmisor.
- Nueve birras repartidas por el mapa; recuperar seis es requisito de victoria por tareas.
- Tres pistas fijas revelan al infiltrado (mecánica provisional).
- Sabotajes con cuenta atrás e integridad 3.
- Asamblea de panas: un voto por partida, correcto = ganar; incorrecto = perder.
- Reinicio de partida con roles aleatorios nuevos.

## Flujo de estados
Inicio → partida → (tarea / pista / birra / sabotaje / asamblea) → partida → victoria o derrota → reiniciar. Las pantallas de diálogo pausan el avance del mundo.

## Diseño de mapa
Cabina principal, archivo musical, transmisor, nevera, monitores, zona central y pasillos. Visuales de cómic noventero creados por Canvas; el arte definitivo exige referencias oficiales de los personajes y del logotipo, sin alterar ese logo.

## Multijugador (fase posterior; NO implementado)
Arquitectura cliente HTML5 + servidor Node.js WebSocket autoritativo. Una sala privada tendría lobby, 4–9 jugadores, roles secretos, sincronización de movimiento, interacciones verificadas en servidor, votación con temporizador, expulsiones, sabotajes y reconexión con token temporal. Rate limiting y validación del lado servidor. No usar P2P como fuente única de verdad.

## Fases y criterios de salida
1. **V0.2 local:** bucle de partida y objetivos completos. Revisar manualmente en Android y PC.
2. **V0.3 QA:** eliminar errores, pruebas táctiles en vertical/horizontal y accesibilidad, ajuste de dificultad, mejoras de IA y pistas no deterministas.
3. **V0.4 arte:** sprites y animaciones originales consistentes con la biblia de personajes, efectos sonoros propios/licenciados.
4. **V1.0 online:** salas, reconexión, privacidad, validación y pruebas de estrés. Requiere servidor y pruebas de red.

## Riesgos y límites actuales
La IA no deduce ni realiza sabotajes visibles en pantalla: los eventos son temporizados. Las tareas son preguntas de opción múltiple. No hay progresión guardada ni multijugador. Las rutas de NPC no tienen colisiones complejas. El arte es provisional, no fidelidad retratística final.

## V0.3 / alcance
Pausa P / táctil, manifiesto PWA, icono provisional, prioridad de reparación, soporte de pantallas táctiles grandes. El multijugador se deja para la siguiente fase: servidor autoritativo con WebSocket, salas privadas, votos y reconexión.
