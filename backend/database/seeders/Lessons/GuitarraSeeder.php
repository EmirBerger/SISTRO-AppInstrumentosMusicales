<?php

namespace Database\Seeders\Lessons;

use Illuminate\Database\Seeder;
use App\Models\Instrument;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\LessonBlock;

class GuitarraSeeder extends Seeder
{
    public function run(): void
    {
        $guitarra = Instrument::where('name', 'Guitarra')->first();
        if (!$guitarra) return;

        foreach ($this->data() as $claseData) {
            $module = Module::create([
                'instrument_id' => $guitarra->instrument_id,
                'title'         => $claseData['titulo'],
                'level'         => $claseData['nivel'],
                'order'         => $claseData['orden'],
            ]);

            foreach ($claseData['modulos'] as $moduloData) {
                $lesson = Lesson::create([
                    'module_id'      => $module->module_id,
                    'title'          => $moduloData['titulo'],
                    'theory_content' => null,
                    'order'          => $moduloData['orden'],
                ]);

                foreach ($moduloData['bloques'] as $bloque) {
                    LessonBlock::create([
                        'lesson_id' => $lesson->lesson_id,
                        'type'      => $bloque['tipo'],
                        'content'   => $bloque['contenido'],
                        'order'     => $bloque['orden'],
                    ]);
                }
            }
        }
    }

    private function data(): array
    {
        return [
            // ── C01 ──────────────────────────────────────────────────────
            [
                'titulo' => 'El instrumento y la postura',
                'nivel'  => 'principiante',
                'orden'  => 1,
                'modulos' => [
                    [
                        'titulo' => 'Partes de la guitarra',
                        'orden'  => 1,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Antes de tocar la primera nota, vale la pena conocer el instrumento que tenés en las manos. La guitarra tiene tres zonas principales, y cada parte tiene una función específica.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Guitarra acústica con flechas señalando cada parte', 'caption' => 'Vista frontal con etiquetas: cabeza, clavijas, cejuela, mástil, trastes, cuerpo, boca y puente']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La cabeza es la parte de arriba. Ahí están las clavijas, que son las perillas que girás para afinar cada cuerda. Tensás y la nota sube, aflojás y la nota baja. El mástil es el palo largo donde trabaja tu mano izquierda. Tiene los trastes, que son las divisiones metálicas que separan una nota de otra. El cuerpo es la caja de madera. En la guitarra acústica el sonido se amplifica adentro y sale por la boca, que es el agujero redondo. El puente es la pieza pegada abajo del cuerpo donde se anclan las cuerdas.'],
                            ['tipo' => 'image', 'orden' => 4, 'contenido' => ['url' => '', 'alt' => 'Primer plano del mástil con trastes numerados del 1 al 5', 'caption' => 'Los trastes metálicos dividen el mástil en notas']],
                            ['tipo' => 'tip',   'orden' => 5, 'contenido' => 'Pasá el dedo por el borde de los trastes. Si sentís que cortan, la guitarra necesita un ajuste de luthier. Una guitarra con trastes afilados hace mucho más difícil aprender.'],
                            ['tipo' => 'key_concepts', 'orden' => 6, 'contenido' => ['cabeza', 'clavijas', 'mástil', 'trastes', 'diapasón', 'cuerpo', 'boca', 'puente']],
                        ],
                    ],
                    [
                        'titulo' => 'Tipos de guitarra',
                        'orden'  => 2,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'No todas las guitarras son iguales. Antes de aprender a tocar, es útil saber qué tipo de guitarra tenés en las manos y qué la hace diferente a las otras.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Tres guitarras una al lado de la otra: clásica, acústica y eléctrica', 'caption' => 'Izquierda: clásica (nylon) · Centro: acústica (acero) · Derecha: eléctrica']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La guitarra clásica tiene cuerdas de nylon, sonido suave y cálido. Es ideal para empezar porque las cuerdas lastiman menos los dedos. La guitarra acústica folk tiene cuerdas de acero, sonido más brillante y fuerte. Es la más común en pop, rock acústico y country. La guitarra eléctrica tiene cuerpo sólido y necesita amplificador. Sus cuerdas son las más fáciles de pisar. Es ideal para rock, blues y metal.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Cualquier guitarra sirve para aprender. Lo más importante es que esté bien afinada y en buen estado. Todo lo que aprendás en una lo podés aplicar en las otras.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['guitarra clásica', 'guitarra acústica', 'guitarra eléctrica', 'cuerdas de nylon', 'cuerdas de acero', 'amplificador']],
                        ],
                    ],
                    [
                        'titulo' => 'La postura',
                        'orden'  => 3,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'La postura es uno de los detalles más ignorados por los principiantes y uno de los que más importa a largo plazo. Tocar con mala postura genera dolores en muñeca, cuello y espalda, y limita tu progreso técnico.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Persona sentada con postura correcta sosteniendo la guitarra', 'caption' => 'Posición informal: guitarra sobre muslo derecho, mástil inclinado hacia arriba, espalda recta']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Sentate en el borde de una silla sin apoyar la espalda en el respaldo. La guitarra descansa sobre tu muslo derecho si sos diestro. El brazo derecho cae naturalmente sobre el cuerpo del instrumento. El mástil debe quedar inclinado hacia arriba, no horizontal. Esto hace que tu mano izquierda pueda llegar cómodo a todos los trastes sin forzar la muñeca.'],
                            ['tipo' => 'image', 'orden' => 4, 'contenido' => ['url' => '', 'alt' => 'Comparación postura correcta vs incorrecta', 'caption' => 'Izquierda: correcto (mástil inclinado, hombros relajados) · Derecha: incorrecto (encorvado, mástil horizontal)']],
                            ['tipo' => 'tip',   'orden' => 5, 'contenido' => 'Practicá frente a un espejo. Si tu hombro izquierdo está más alto que el derecho, estás haciendo fuerza de más. Relajá ese hombro cada vez que empieces a tocar.'],
                            ['tipo' => 'key_concepts', 'orden' => 6, 'contenido' => ['posición informal', 'posición clásica', 'mástil inclinado', 'hombros relajados', 'espalda recta']],
                        ],
                    ],
                    [
                        'titulo' => 'La mano izquierda en el mástil',
                        'orden'  => 4,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'La mano izquierda es la que pisa las cuerdas para cambiar las notas. La posición en que la ponés importa mucho: una posición correcta hace que todo sea más fácil y que no te canses tan rápido.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Mano izquierda en el mástil en posición correcta, vista lateral', 'caption' => 'Pulgar detrás del mástil, dedos curvados, palma sin tocar el mástil']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'El pulgar va apoyado en la parte de atrás del mástil, aproximadamente detrás del dedo medio. No lo envuelvas por arriba como si agarraras un palo: eso tensa toda la mano. Los dedos deben estar curvados, como si sostuvieras una pelota pequeña. Así la yema, que es la parte redonda de la punta, cae perpendicularmente sobre la cuerda sin tocar las de al lado. La palma de la mano no debe tocar el mástil.'],
                            ['tipo' => 'image', 'orden' => 4, 'contenido' => ['url' => '', 'alt' => 'Comparación dedo curvado correcto vs dedo plano incorrecto', 'caption' => 'Izquierda: yema bien curvada (correcto) · Derecha: dedo plano aplastando cuerdas vecinas (incorrecto)']],
                            ['tipo' => 'tip',   'orden' => 5, 'contenido' => 'No aprietes más de lo necesario. Pisá una cuerda con muy poca presión y aumentá de a poco hasta que suene limpia. Esa es la presión correcta. Apretar de más cansa la mano sin mejorar el sonido.'],
                            ['tipo' => 'key_concepts', 'orden' => 6, 'contenido' => ['posición del pulgar', 'yema del dedo', 'curvatura de dedos', 'presión mínima', 'uñas cortas', 'palma libre']],
                        ],
                    ],
                ],
            ],
            // ── C02 ──────────────────────────────────────────────────────
            [
                'titulo' => 'Las cuerdas y la afinación',
                'nivel'  => 'principiante',
                'orden'  => 2,
                'modulos' => [
                    [
                        'titulo' => 'Las 6 cuerdas',
                        'orden'  => 1,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'La guitarra estándar tiene 6 cuerdas. Cada una tiene un nombre, un número y produce un sonido diferente. Aprender a distinguirlas es lo primero que hacés antes de tocar cualquier cosa.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Las 6 cuerdas de la guitarra numeradas con sus nombres', 'caption' => 'De la más gruesa a la más delgada: Mi (6) · La (5) · Re (4) · Sol (3) · Si (2) · Mi (1)']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Las cuerdas se numeran del 1 al 6, pero el orden puede confundir: la cuerda 1 es la más delgada (la que está más cerca del piso cuando sostenés la guitarra) y la cuerda 6 es la más gruesa. En orden de más gruesa a más delgada: Mi grave (6), La (5), Re (4), Sol (3), Si (2), Mi agudo (1). Para recordarlas existe la frase: Mi La Re Sol Si Mi.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Las cuerdas más gruesas vibran más lento y suenan grave. Las más delgadas vibran más rápido y suenan agudo. Cuando alguien te dice "tocá la 4ta cuerda", está hablando del Re.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['cuerda prima', 'bordones', 'Mi-La-Re-Sol-Si-Mi', 'afinación estándar', 'cuerda grave', 'cuerda aguda']],
                        ],
                    ],
                    [
                        'titulo' => 'Cómo afinar',
                        'orden'  => 2,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Antes de tocar cualquier cosa, la guitarra tiene que estar afinada. Una guitarra desafinada suena mal no importa qué tan bien toques. La buena noticia es que afinar es muy fácil con las herramientas correctas.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Pantalla de una app afinador mostrando la cuerda La en 440Hz', 'caption' => 'Un afinador cromático indica si la nota está alta, baja o afinada']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La forma más fácil de afinar es usando un afinador cromático, que podés descargar gratis en tu celular. Tocás cada cuerda y el afinador te dice si está alta, baja o perfecta. Si la aguja está a la derecha, la nota está alta: aflojás la clavija. Si está a la izquierda, la nota está baja: tensás la clavija. Siempre mové la clavija despacio y de a poco.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Afiná siempre subiendo el tono, nunca bajando. Si te pasaste, bajá un poco más y volvé a subir. Llegar a la nota desde abajo es más estable.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['afinador cromático', '440 Hz', 'clavija', 'tensar', 'aflojar', 'nota alta', 'nota baja']],
                        ],
                    ],
                    [
                        'titulo' => 'Los trastes y las notas',
                        'orden'  => 3,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Ya sabés que los trastes dividen el mástil. Pero ¿qué produce exactamente cada traste? Cada traste que subís en una cuerda sube la nota un semitono, que es la distancia más pequeña entre dos notas en la música occidental.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Mapa de notas de la cuerda Mi grave traste por traste', 'caption' => 'Cuerda 6 al aire: Mi · Traste 1: Fa · Traste 2: Fa# · Traste 3: Sol · Traste 4: Sol# · Traste 5: La']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Por ejemplo: la cuerda 6 al aire suena Mi. Si pisás el traste 1, suena Fa. El traste 2 suena Fa sostenido. El traste 3 suena Sol. Y así sucesivamente. Cada traste es exactamente un semitono más alto que el anterior. En el traste 12 llegás al mismo nombre de nota que la cuerda al aire, pero una octava más aguda.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'El traste 5 de la cuerda 6 suena La, igual que la cuerda 5 al aire. Esto te permite afinar las cuerdas de oído comparando una con otra.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['semitono', 'cuerda al aire', 'octava', 'mapa del mástil', 'sostenido']],
                        ],
                    ],
                    [
                        'titulo' => 'Cómo pisar correctamente',
                        'orden'  => 4,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Pisar una cuerda parece simple pero tiene detalles que marcan la diferencia entre una nota que suena limpia y una que suena apagada o zumbante.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Dedo pisando la cuerda justo antes del traste metálico', 'caption' => 'Zona correcta: justo antes del traste, no en el medio del espacio']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La posición correcta del dedo es justo antes del traste metálico, lo más cerca posible del traste del lado del cuerpo. Si pisás en el medio del espacio entre dos trastes necesitás mucha más presión y la nota puede zumbar. Si pisás encima del traste metálico, la nota suena apagada. Usá la yema del dedo, que es la parte redondeada de la punta, y curvá el dedo para que no toque las cuerdas vecinas.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Pisá una nota y tocala. Si suena "bzz", revisá si estás pisando en el lugar correcto y si el dedo está suficientemente curvado. Son los dos únicos problemas posibles.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['zona de pisada', 'yema del dedo', 'curvatura', 'presión justa', 'nota limpia']],
                        ],
                    ],
                ],
            ],
            // ── C03 ──────────────────────────────────────────────────────
            [
                'titulo' => 'Primeras notas y el sistema musical',
                'nivel'  => 'principiante',
                'orden'  => 3,
                'modulos' => [
                    [
                        'titulo' => 'Qué es una nota',
                        'orden'  => 1,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Una nota es el sonido más básico que podés producir: una sola cuerda vibrando a una velocidad determinada. Esa velocidad se llama frecuencia y se mide en Hertz. El La estándar que se usa en todo el mundo vibra a exactamente 440 veces por segundo, o 440 Hz.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Onda de sonido de una nota mostrando su frecuencia', 'caption' => 'Una nota más aguda tiene más ciclos por segundo que una nota grave']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Cada nota tiene un nombre, una altura (grave o aguda) y una duración. La altura es qué tan grave o aguda suena. La duración es cuánto tiempo suena. En música se usan letras o nombres en español para identificar cada nota: Do, Re, Mi, Fa, Sol, La, Si.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'El oído humano puede distinguir cientos de frecuencias distintas, pero la música occidental organiza todas esas posibilidades en solo 12 notas que se repiten.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['nota', 'frecuencia', 'Hertz', 'altura', 'duración', '440 Hz']],
                        ],
                    ],
                    [
                        'titulo' => 'El sistema de 7 notas',
                        'orden'  => 2,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'La música occidental usa 7 notas básicas que se repiten en ciclos. Esas notas son Do, Re, Mi, Fa, Sol, La y Si. Cuando llegás a Si, la siguiente nota vuelve a ser Do, pero más aguda. Esa repetición se llama octava.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Las 7 notas musicales en un diagrama circular mostrando el ciclo de octavas', 'caption' => 'Do Re Mi Fa Sol La Si → Do (octava siguiente)']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Entre algunas notas hay un tono de distancia y entre otras solo un semitono, que es la mitad de un tono. Los semitonos están entre Mi-Fa y entre Si-Do. Entre todas las demás notas hay un tono completo. Esta distribución no es arbitraria: es la base de toda la música occidental y determina cómo se construyen las escalas y los acordes.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'En guitarra no necesitás memorizar toda la teoría de golpe. Lo que sí conviene tener claro es que entre Mi y Fa no hay nota intermedia, y entre Si y Do tampoco. En todos los demás casos sí hay una nota entre medio.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['Do Re Mi Fa Sol La Si', 'octava', 'tono', 'semitono', 'Mi-Fa', 'Si-Do']],
                        ],
                    ],
                    [
                        'titulo' => 'Sostenidos y bemoles',
                        'orden'  => 3,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Además de las 7 notas básicas, existen las notas intermedias: los sostenidos y los bemoles. Un sostenido sube una nota medio tono. Un bemol baja una nota medio tono. Así llegamos a las 12 notas de la música occidental.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Teclado de piano mostrando teclas blancas y negras con nombres de notas', 'caption' => 'Las teclas negras son las notas con sostenido o bemol']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'El símbolo del sostenido es # y el del bemol es b. Fa# es la nota entre Fa y Sol. Sib es la nota entre La y Si. Lo interesante es que Fa# y Solb son exactamente la misma nota con dos nombres distintos, dependiendo del contexto armónico en que estés. En guitarra, esto significa que en el traste 2 de la cuerda 6 podés decir que suena Fa# o Solb, y ambos son correctos.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'No te preocupes por memorizar todos los sostenidos y bemoles de golpe. Se van aprendiendo naturalmente a medida que estudiás acordes y escalas.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['sostenido (#)', 'bemol (b)', 'enarmónico', '12 notas', 'escala cromática']],
                        ],
                    ],
                    [
                        'titulo' => 'Las notas en la cuerda Mi grave',
                        'orden'  => 4,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Ahora que sabés cómo funciona el sistema de notas, vas a aprender a ubicarlas en la guitarra. Empezamos por la cuerda 6, el Mi grave, que es la cuerda más gruesa. Conocer bien esta cuerda es la clave para entender todo el mástil.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Mástil de guitarra mostrando la cuerda 6 con todas las notas del traste 0 al 12', 'caption' => 'Mi · Fa · Fa# · Sol · Sol# · La · Sib · Si · Do · Do# · Re · Mib · Mi']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La cuerda 6 al aire suena Mi. Cada traste sube un semitono. Así recorremos: Mi (0), Fa (1), Fa# (2), Sol (3), Sol# (4), La (5), Sib (6), Si (7), Do (8), Do# (9), Re (10), Mib (11), Mi (12). En el traste 12 llegamos de vuelta al Mi, pero una octava más aguda. Esta es toda la escala cromática, que son las 12 notas posibles.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'No necesitás memorizar esto de una. Fijate que el La está en el traste 5, que es el mismo sonido que la cuerda 5 al aire. Esa es la primera referencia que vale la pena recordar.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['escala cromática', 'cuerda 6', 'traste 12 = octava', 'mapa de notas', 'referencia en traste 5']],
                        ],
                    ],
                ],
            ],
            // ── C04 ──────────────────────────────────────────────────────
            [
                'titulo' => 'Tu primer acorde: Em y Am',
                'nivel'  => 'principiante',
                'orden'  => 4,
                'modulos' => [
                    [
                        'titulo' => 'Qué es un acorde',
                        'orden'  => 1,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Una nota es un sonido individual. Un acorde es cuando tocás varias notas al mismo tiempo y suenan bien juntas. En guitarra, la mayoría de los acordes se forman pisando entre 2 y 4 cuerdas mientras la mano derecha rasguea todas o casi todas.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Diagrama de cejilla mostrando cómo se lee: puntos, números, X y O', 'caption' => 'Cómo leer un diagrama de acordes: O = cuerda al aire · X = no se toca · Número = dedo']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Los diagramas de acordes son mapas del mástil. Las líneas verticales son las cuerdas (de Mi grave a la izquierda hasta Mi agudo a la derecha) y las líneas horizontales son los trastes. Los puntos negros muestran dónde poner los dedos. La O encima de una cuerda significa que se toca al aire. La X significa que no se toca.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Los primeros acordes que vas a aprender son los llamados acordes abiertos, porque usan cuerdas al aire. Son los más fáciles y los más usados en música popular.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['acorde', 'diagrama de cejilla', 'cuerda al aire (O)', 'cuerda muteada (X)', 'acorde abierto']],
                        ],
                    ],
                    [
                        'titulo' => 'Mi menor (Em)',
                        'orden'  => 2,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Mi menor es históricamente el primer acorde que aprende la mayoría de los guitarristas. Usa solo dos dedos, todas las cuerdas suenan y tiene un sonido oscuro y expresivo.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Diagrama de cejilla del acorde Em y foto de la digitación real', 'caption' => 'Em: dedo medio en Re/traste 2 · dedo anular en La/traste 2 · resto al aire']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Para formar Em: dedo medio en la cuerda 4 (Re) traste 2, y dedo anular en la cuerda 5 (La) traste 2. Las cuerdas 6, 3, 2 y 1 se tocan al aire. Rasguea desde la cuerda 6 hacia abajo con el pulgar o la púa. Todas las 6 cuerdas suenan.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Si alguna cuerda suena apagada al tocar Em, probablemente uno de tus dos dedos la está tocando sin querer. Curvá más los dedos para que solo la yema haga contacto.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['Mi menor', 'acorde de dos dedos', 'todas las cuerdas suenan', 'dedo medio', 'dedo anular']],
                        ],
                    ],
                    [
                        'titulo' => 'La menor (Am)',
                        'orden'  => 3,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'La menor es el segundo acorde más usado entre los acordes fáciles. Junto con Em forman una de las combinaciones más comunes en canciones de todos los géneros.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Diagrama de cejilla de Am y foto de la digitación', 'caption' => 'Am: índice en Si/traste 1 · medio en Re/traste 2 · anular en Sol/traste 2 · cuerda 6 no se toca']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Para formar Am: dedo índice en la cuerda 2 (Si) traste 1, dedo medio en la cuerda 4 (Re) traste 2, dedo anular en la cuerda 3 (Sol) traste 2. La cuerda 5 (La) se toca al aire. La cuerda 1 (Mi agudo) se toca al aire. La cuerda 6 (Mi grave) NO se toca: el rasgueo arranca desde la cuerda 5.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Al cambiar de Em a Am, fijate que el anular se mueve de la cuerda 5 a la cuerda 3. Practicá ese movimiento aislado antes de intentar el cambio con ritmo.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['La menor', 'inicio en cuerda 5', 'dedo índice', 'cuerda muteada', 'diferencia con Em']],
                        ],
                    ],
                    [
                        'titulo' => 'Cómo leer un diagrama de cejilla',
                        'orden'  => 4,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Los diagramas de acordes aparecen en todas partes: en aplicaciones, libros, partituras. Saber leerlos te da acceso inmediato a cualquier acorde que necesites aprender.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Diagrama de cejilla anotado con leyenda explicando cada elemento', 'caption' => 'Leyenda completa: cejuela arriba · trastes horizontales · cuerdas verticales · puntos con número de dedo · X y O arriba']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'La línea gruesa arriba del diagrama es la cejuela del mástil. Los números dentro de los puntos indican qué dedo usar: 1 es el índice, 2 el medio, 3 el anular y 4 el meñique. A veces el diagrama muestra un número a la derecha indicando en qué traste empieza el diagrama, cuando el acorde no está al comienzo del mástil. Una línea curva que cruza todas las cuerdas indica una cejilla.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Cuando veas un diagrama nuevo, primero identificá las X y O (qué cuerdas se tocan y cuáles no), luego ubicá los puntos de más fácil posición y armá el acorde de adentro hacia afuera.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['cejuela', 'números de dedo 1-2-3-4', 'cejilla', 'posición en el mástil', 'leyenda del diagrama']],
                        ],
                    ],
                ],
            ],
            // ── C05 ──────────────────────────────────────────────────────
            [
                'titulo' => 'El ritmo y el primer rasgueo',
                'nivel'  => 'principiante',
                'orden'  => 5,
                'modulos' => [
                    [
                        'titulo' => 'Pulso y tempo',
                        'orden'  => 1,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'El pulso es el latido constante de la música. Es lo que sentís cuando escuchás una canción y empezás a mover el pie o a aplaudir. El tempo es la velocidad de ese pulso y se mide en BPM, que significa beats por minuto.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Metrónomo mostrando 60 BPM con el péndulo en movimiento', 'caption' => '60 BPM = 1 golpe por segundo. Es el tempo estándar para practicar lento.']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'Un metrónomo es una herramienta que marca el pulso de forma constante. Podés descargar una app gratis en tu celular. Para practicar, empezá siempre a 60 BPM o menos. La velocidad final de una canción no importa al principio: lo que importa es que el pulso sea constante y parejo.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Nunca practiques algo rápido si todavía no te sale lento. La velocidad es una consecuencia de la precisión, no al revés. Si apurás el tempo, estás memorizando los errores.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['pulso', 'tempo', 'BPM', 'metrónomo', 'constancia']],
                        ],
                    ],
                    [
                        'titulo' => 'El compás de 4/4',
                        'orden'  => 2,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'El compás es la forma en que la música organiza el tiempo en grupos regulares. El compás más común es el 4/4: cuatro tiempos por compás. Se cuenta así: uno, dos, tres, cuatro, uno, dos, tres, cuatro...'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Línea de tiempo mostrando 4 tiempos con el tiempo 1 marcado como fuerte', 'caption' => 'El tiempo 1 es el más fuerte de cada compás. El 3 es secundariamente fuerte.']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'El primer tiempo de cada compás es el más fuerte y marcado. Lo sentís en la música como el "boom" del bombo. Los tiempos 2 y 4 son los tiempos débiles, donde suele caer el aplauso en los conciertos. El tiempo 3 es moderadamente fuerte. Esta distribución de fuerza entre los cuatro tiempos es lo que le da groove a la música.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'Cuando practiques rasgueos, contá en voz alta: "uno dos tres cuatro". Al principio parece raro pero es la forma más rápida de internalizar el compás.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['compás', '4/4', 'tiempo fuerte', 'tiempo débil', 'contar en voz alta']],
                        ],
                    ],
                    [
                        'titulo' => 'Rasgueo hacia abajo',
                        'orden'  => 3,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'El rasgueo es pasar la mano por las cuerdas de forma que varias suenen al mismo tiempo. El rasgueo más simple y fundamental es hacia abajo: la mano baja desde la cuerda más gruesa hacia la más delgada.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Diagrama de patrón de rasgueo con cuatro flechas hacia abajo sobre 4 tiempos', 'caption' => 'Patrón básico: ↓ ↓ ↓ ↓ · Un rasgueo por tiempo · Cuatro por compás']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'El movimiento del rasgueo viene de la muñeca, no del codo. El antebrazo descansa sobre el cuerpo de la guitarra y la muñeca oscila hacia abajo. Con una púa, la sostenés entre el pulgar y el índice con el filo mirando hacia las cuerdas. Con el pulgar, usás la parte carnosa de la punta. Empezá con Em y rasgueá cuatro veces hacia abajo, una por cada tiempo del compás.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'No te preocupes si el sonido no es parejo al principio. Lo importante es que los cuatro rasgueos caigan en los cuatro tiempos. El sonido mejora con la práctica.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['rasgueo hacia abajo', 'movimiento de muñeca', 'púa', 'patrón ↓↓↓↓', 'tiempo y rasgueo']],
                        ],
                    ],
                    [
                        'titulo' => 'Primer cambio de acorde con ritmo',
                        'orden'  => 4,
                        'bloques' => [
                            ['tipo' => 'text',  'orden' => 1, 'contenido' => 'Ahora que sabés formar Em y Am, y que sabés rasguear, llega el primer desafío real: cambiar de un acorde al otro sin detener el ritmo.'],
                            ['tipo' => 'image', 'orden' => 2, 'contenido' => ['url' => '', 'alt' => 'Línea de tiempo mostrando 4 tiempos de Em seguidos de 4 tiempos de Am', 'caption' => 'Em (4 tiempos) → Am (4 tiempos) → repetir']],
                            ['tipo' => 'text',  'orden' => 3, 'contenido' => 'El secreto del cambio de acorde es anticipar: antes de que llegue el tiempo del cambio, tu mano ya tiene que estar moviéndose hacia el nuevo acorde. Practicalo primero sin rasguear: formá Em, luego mové los dedos a Am, verificá que suene bien, y volvé a Em. Repetí eso 20 veces antes de agregar el ritmo. Cuando lo combines con el rasgueo, si el cambio no sale perfecto, no pares el ritmo. Un acorde imperfecto en tiempo es mejor que un cambio perfecto fuera de tiempo.'],
                            ['tipo' => 'tip',   'orden' => 4, 'contenido' => 'El ritmo nunca se detiene. Si perdés el acorde, seguí rasgueando aunque sea en el aire. Mantener el pulso es más importante que el acorde perfecto.'],
                            ['tipo' => 'key_concepts', 'orden' => 5, 'contenido' => ['cambio de acorde', 'anticipar el cambio', 'ritmo constante', 'práctica sin rasgueo', 'tiempo sobre perfección']],
                        ],
                    ],
                ],
            ],
        ];
    }
}
