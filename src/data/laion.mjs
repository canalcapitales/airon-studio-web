// Página de artista de LAION (/laion/ y /en/laion/).
// Los textos de biografía y visión son de LAION: **palabra** se muestra destacada.
// Portada: wordmark de LAION (src/static/img/laion/wordmark-*.webp) sobre negro pleno.
// Obras: imágenes en src/static/img/laion/pieza-NN-700.webp y -1600.webp (vertical).

// El orden es el de los números de los archivos en el Drive de LAION (carpeta HQ COLOR).
export const LAION_OBRAS = Array.from({ length: 37 }, (_, i) => `pieza-${String(i + 1).padStart(2, '0')}`);

export const LAION = {
  es: {
    titulo: 'LAION — Graffiti writer argentino',
    desc: 'LAION, graffiti writer argentino. Pintando desde 2008: wildstyle, letras y cultura urbana, de San Martín de los Andes a Buenos Aires.',
    kicker: 'Graffiti writer argentino',
    desde: 'Pintando desde 2008',
    bajada: 'Letras, calle y cultura urbana.',
    verObra: 'Ver obra ↓',
    contacto: 'Contacto',
    datos: [
      ['2008', 'Primera pared'],
      ['15+', 'Años de letras'],
      ['37', 'Piezas en esta selección'],
      ['SMA → BA', 'De la montaña a la ciudad'],
    ],
    biografia: 'Biografía',
    bio: [
      'Graffiti writer **argentino**. Pintando desde **2008**.',
      'Empecé en **San Martín de los Andes**, un pueblo de montaña donde no había escena: había algunas paredes y muchas ganas. En **2012** llegué a **Buenos Aires** y caí justo en una de las épocas más intensas del graffiti local.',
      'Soy diseñador gráfico de formación y eso se filtra en cada pieza: las capas, las luces, el movimiento, la obsesión por que quede bien resuelto. De la calle traigo lo otro: la medianera, la persiana, el cemento, la luz naranja del alumbrado, el ruido del tren y la música en los parlantes. La adrenalina de pintar rápido, con un ojo en la pared y otro en la esquina. Todo eso también entra en las letras.',
      'Mi estilo nace del **wildstyle**, pero busco siempre el mismo equilibrio: que un writer encuentre el código y que el que pasa caminando igual pueda leerlo.',
      'Más de 15 años de letras, calle y cultura urbana.',
    ],
    obra: 'Obra',
    obraTexto: 'Una selección de paredes pintadas entre San Martín de los Andes, Buenos Aires y La Plata. Tocá cualquier pieza para verla en grande.',
    pieza: (n) => `LAION — pieza ${n}`,
    vision: 'Visión',
    visionTexto: [
      'El wildstyle nació en **Nueva York** a fines de los 70: letras que se doblan, se cruzan y se vuelven un código entre writers. Yo tomo esa raíz y la pienso desde acá.',
      'Porque el graffiti no lo inventé yo. Las letras ya estaban. Lo que uno hace es **representar**: agarrar tu nombre y estirarlo hasta que sea inconfundible. Exagerar una curva, torcer una letra, encontrar el gesto que hace que alguien pase y sepa que es tuyo sin leer la firma.',
      'Y hacerlo bien. Prolijo. Con nivel. Esto no es un hobby: es un oficio que se entrena. Cada pared es la oportunidad de dejar lo mejor que tenés ese día, y si no estás a la altura, el muro lo cuenta solo.',
      'Nadie te paga por eso. La pintura sale de tu bolsillo y las horas también. La calle tiene su costo, y no siempre es solo económico. Se hace igual, por amor a las letras y por los que están al lado tuyo cuando pintás.',
    ],
    cierre: ['Las paredes se tapan.', 'Los amigos no.'],
    ruta: 'Recorrido',
    hitos: [
      ['2008', 'San Martín de los Andes', 'Primeras paredes en un pueblo de montaña sin escena.'],
      ['2012', 'Buenos Aires', 'Llegada a la ciudad en una de las épocas más intensas del graffiti local.'],
      ['Hoy', 'Argentina', 'Wildstyle, letras y cultura urbana. Más de 15 años pintando.'],
    ],
    contactoTitulo: 'Paredes, colaboraciones y prensa',
    contactoTexto: 'Para pintar juntos, invitar a LAION a un evento o festival, proponer una exposición o una nota.',
    contactoBoton: 'Escribirle a LAION →',
    contactoMensaje: 'Hola LAION, te escribo por ',
    estudio: 'LAION también es diseñador gráfico y dirige AIRON Studio.',
    estudioLink: 'Conocé el estudio →',
    firmaAlt: 'Logo de LAION: la palabra LAION en rojo con una estrella blanca sobre el mapa de Argentina en puntos',
  },
  en: {
    titulo: 'LAION — Argentine graffiti writer',
    desc: 'LAION, Argentine graffiti writer. Painting since 2008: wildstyle, letters and urban culture, from San Martín de los Andes to Buenos Aires.',
    kicker: 'Argentine graffiti writer',
    desde: 'Painting since 2008',
    bajada: 'Letters, streets and urban culture.',
    verObra: 'See the work ↓',
    contacto: 'Contact',
    datos: [
      ['2008', 'First wall'],
      ['15+', 'Years of letters'],
      ['37', 'Pieces in this selection'],
      ['SMA → BA', 'From the mountains to the city'],
    ],
    biografia: 'Biography',
    bio: [
      '**Argentine** graffiti writer. Painting since **2008**.',
      'I started in **San Martín de los Andes**, a mountain town with no scene: just a few walls and a lot of drive. In **2012** I moved to **Buenos Aires** and landed right in one of the most intense eras of local graffiti.',
      'I’m a graphic designer by training, and it seeps into every piece: the layers, the highlights, the movement, the obsession with getting it right. From the street I bring the rest: the side wall, the shutter, the concrete, the orange glow of the streetlights, the noise of the train and the music in the speakers. The adrenaline of painting fast, one eye on the wall and the other on the corner. All of that goes into the letters too.',
      'My style comes from **wildstyle**, but I always look for the same balance: a writer should find the code, and someone walking by should still be able to read it.',
      'More than 15 years of letters, streets and urban culture.',
    ],
    obra: 'Work',
    obraTexto: 'A selection of walls painted across San Martín de los Andes, Buenos Aires and La Plata. Tap any piece to see it large.',
    pieza: (n) => `LAION — piece ${n}`,
    vision: 'Vision',
    visionTexto: [
      'Wildstyle was born in **New York** in the late 70s: letters that bend, cross over and become a code between writers. I take that root and think it from here.',
      'Because I didn’t invent graffiti. The letters were already there. What you do is **represent**: take your name and stretch it until it’s unmistakable. Exaggerate a curve, twist a letter, find the gesture that lets someone walk by and know it’s yours without reading the tag.',
      'And do it right. Clean. With level. This is not a hobby: it’s a craft you train. Every wall is a chance to leave the best you’ve got that day, and if you’re not up to it, the wall tells on you.',
      'Nobody pays you for it. The paint comes out of your pocket, and so do the hours. The street has its cost, and it isn’t always just money. You do it anyway, for the love of letters and for the people standing next to you while you paint.',
    ],
    cierre: ['Walls get buffed.', 'Friends don’t.'],
    ruta: 'Path',
    hitos: [
      ['2008', 'San Martín de los Andes', 'First walls in a mountain town with no scene.'],
      ['2012', 'Buenos Aires', 'Moved to the city during one of the most intense eras of local graffiti.'],
      ['Now', 'Argentina', 'Wildstyle, letters and urban culture. More than 15 years painting.'],
    ],
    contactoTitulo: 'Walls, collaborations and press',
    contactoTexto: 'To paint together, invite LAION to an event or festival, or pitch an exhibition or a story.',
    contactoBoton: 'Write to LAION →',
    contactoMensaje: 'Hi LAION, I’m writing about ',
    estudio: 'LAION is also a graphic designer and runs AIRON Studio.',
    estudioLink: 'Meet the studio →',
    firmaAlt: 'LAION logo: the word LAION in red with a white star over a dotted map of Argentina',
  },
};
