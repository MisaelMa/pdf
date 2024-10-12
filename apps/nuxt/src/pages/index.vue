<template>
  <div style="display: grid;">

     <div>
      <input v-model="title">
      <button @click="download()" >Download</button>
     </div>
     {{ sizePage }}
     <select v-model="sizePage">
        <option v-for="page in pageNames" :key="page" :value="page">{{ page }}</option>
     </select>

  <div :style="{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#525659',
  }">
    <PDF :size="sizePage">
      <Document>
        <Page :style="styles.body" bookmark="Harry Pottessr and the Philosopher's Stone">
         <!--  <Text :style="styles.header" fixed="true">
            ~ Created with react-pdfssww
          </Text> -->
          
        <!--   <Caman :text="title"></Caman>

          <Text :style="styles.title">Don Quijote de la Mancha</Text>
          <Text :style="styles.author">Miguel de Cervantes</Text>
          <Image :style="styles.image" src="../quijote1.png" />

          <Text :style="styles.subtitle">
            Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo
            D. Quijote de la Mancha
          </Text> -->
         <!--  <Text>
            Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo
            D. Quijote de la Mancha, e 333333333333333
          </Text> -->
          <Text style="text-align: left;">Hechas, pues, estas prevenciones, <Span style="color:red; font-size: 40px">ssss</Span> 
            <Span style="color:blue; font-size: 40px">Test</Span>
            <Span>This is <strong>important</strong> and <a href="#">a link {{ title }}</a>.</Span> quiso aguardar más tiempo a poner en efeto su pensamiento, apretándole a ello la falta que él pensaba que
            hacía en el mundo su tardanza, según eran los agravios que pensaba
            deshacer, tuertos que enderezar, sinrazones que emendar y abusos que
            mejorar y deudas que satisfacer. Y así, sin dar parte a persona alguna
            de su intención y sin que nadie le viese, una mañana, antes del día, que
            era uno de los calurosos del mes de Julio, se armó de todas sus armas,
            subió sobre Rocinante, puesta su mal compuesta celada, embrazó su
            adarga, tomó su lanza y por la puerta falsa de un corral salió al campo
            con grandísimo contento y alborozo de ver con cuánta facilidad había {{ title }} 
           
          </Text>
   <!--        <Text>
            dado principio a su buen deseo. Mas apenas se vio en el campo cuando le
            asaltó un pensamiento terrible, y tal, que por poco le hiciera dejar la
            comenzada empresa; y fue que le vino a la memoria que no era armado
            caballero, y que, conforme a ley de caballería, ni podía ni debía tomar
            armas con ningún caballero; y puesto que lo fuera, había de llevar armas
            blancas, como novel caballero, sin empresa en el escudo, hasta que por
            su esfuerzo la ganase. Estos pensamientos le hicieron titubear en su
            propósito; mas pudiendo más su locura que otra razón alguna, propuso de
            hacerse armar caballero del primero que topase, a imitación de otros
            muchos que así lo hicieron, según él había leído en los libros que tal
            le tenían. En lo de las armas blancas, pensaba limpiarlas de manera, en
            teniendo lugar, que lo fuesen más que un arminio; y con esto se quietó18
            y prosiguió su camino, sin llevar otro que aquel que su caballo quería,
            creyendo que en aquello consistía la fuerza de las aventuras
          </Text> -->
        <!--   <Text :style="styles.text">
            Es, pues, de saber, que este sobredicho hidalgo, los ratos que estaba ocioso (que eran los
            más del año) se daba a leer libros de caballerías con tanta afición y gusto, que olvidó casi
            de todo punto el ejercicio de la caza, y aun la administración de su hacienda; y llegó a tanto
            su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura, para
            comprar libros de caballerías en que leer; y así llevó a su casa todos cuantos pudo haber
            dellos; y de todos ningunos le parecían tan bien como los que compuso el famoso Feliciano
            de Silva: porque la claridad de su prosa, y aquellas intrincadas razones suyas, le parecían
          </Text>
          <Text :style="styles.text">
            Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
            mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
            cuando salga a luz la verdadera historia de mis famosos hechos, que el
            sabio que los escribiere no ponga, cuando llegue a contar esta mi
            primera salida tan de mañana, desta manera?: Apenas había el rubicundo
            Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
            hebras de sus hermosos cabellos, y apenas los pequeños y pintados
            pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
            armonía la venida de la rosada Aurora, que, dejando la blanda cama del
            celoso marido, por las puertas y balcones del manchego horizonte a los
            mortales se mostraba, cuando el famoso caballero don Quijote de la
            Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
            Rocinante y comenzó a caminar por el antiguo y conocido Campo de
            Montiel.
          </Text>
          <Text :style="styles.text">
            Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
            mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
            cuando salga a luz la verdadera historia de mis famosos hechos, que el
            sabio que los escribiere no ponga, cuando llegue a contar esta mi
            primera salida tan de mañana, desta manera?: Apenas había el rubicundo
            Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
            hebras de sus hermosos cabellos, y apenas los pequeños y pintados
            pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
            armonía la venida de la rosada Aurora, que, dejando la blanda cama del
            celoso marido, por las puertas y balcones del manchego horizonte a los
            mortales se mostraba, cuando el famoso caballero don Quijote de la
            Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
            Rocinante y comenzó a caminar por el antiguo y conocido Campo de
            Montiel.
          </Text>
          <Text :style="styles.text">
            Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
            mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
            cuando salga a luz la verdadera historia de mis famosos hechos, que el
            sabio que los escribiere no ponga, cuando llegue a contar esta mi
            primera salida tan de mañana, desta manera?: Apenas había el rubicundo
            Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
            hebras de sus hermosos cabellos, y apenas los pequeños y pintados
            pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
            armonía la venida de la rosada Aurora, que, dejando la blanda cama del
            celoso marido, por las puertas y balcones del manchego horizonte a los
            mortales se mostraba, cuando el famoso caballero don Quijote de la
            Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
            Rocinante y comenzó a caminar por el antiguo y conocido Campo de
            Montiel.
          </Text>
          <Text :style="styles.text">
            Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
            mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
            cuando salga a luz la verdadera historia de mis famosos hechos, que el
            sabio que los escribiere no ponga, cuando llegue a contar esta mi
            primera salida tan de mañana, desta manera?: Apenas había el rubicundo
            Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
            hebras de sus hermosos cabellos, y apenas los pequeños y pintados
            pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
            armonía la venida de la rosada Aurora, que, dejando la blanda cama del
            celoso marido, por las puertas y balcones del manchego horizonte a los
            mortales se mostraba, cuando el famoso caballero don Quijote de la
            Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
            Rocinante y comenzó a caminar por el antiguo y conocido Campo de
            Montiel.
          </Text>
          <Text :style="styles.text">
            Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
            mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
            cuando salga a luz la verdadera historia de mis famosos hechos, que el
            sabio que los escribiere no ponga, cuando llegue a contar esta mi
            primera salida tan de mañana, desta manera?: Apenas había el rubicundo
            Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
            hebras de sus hermosos cabellos, y apenas los pequeños y pintados
            pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
            armonía la venida de la rosada Aurora, que, dejando la blanda cama del
            celoso marido, por las puertas y balcones del manchego horizonte a los
            mortales se mostraba, cuando el famoso caballero don Quijote de la
            Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
            Rocinante y comenzó a caminar por el antiguo y conocido Campo de
            Montiel.
          </Text> -->
        </Page>
        <template v-if="false" v-for="i in 3">
          <Page :style="styles.body" bookmark="Harry Pottessr and the Philosopher's Stone">
            <Text :style="styles.header" fixed="true">
              ~ Created with react-pdfssww
            </Text>
            <Text :style="styles.title">Don Quijote de la Mancha</Text>
            <Text :style="styles.author">Miguel de Cervantes</Text>
            <Image :style="styles.image" src="../quijote1.png" />

            <Text :style="styles.subtitle">
              Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo
              D. Quijote de la Mancha
            </Text>
            <Text :style="styles.text">
              Hechas, pues, estas prevenciones, no quiso aguardar más tiempo a poner
              en efeto su pensamiento, apretándole a ello la falta que él pensaba que
              hacía en el mundo su tardanza, según eran los agravios que pensaba
              deshacer, tuertos que enderezar, sinrazones que emendar y abusos que
              mejorar y deudas que satisfacer. Y así, sin dar parte a persona alguna
              de su intención y sin que nadie le viese, una mañana, antes del día, que
              era uno de los calurosos del mes de Julio, se armó de todas sus armas,
              subió sobre Rocinante, puesta su mal compuesta celada, embrazó su
              adarga, tomó su lanza y por la puerta falsa de un corral salió al campo
              con grandísimo contento y alborozo de ver con cuánta facilidad había
              dado principio a su buen deseo. Mas apenas se vio en el campo cuando le
              asaltó un pensamiento terrible, y tal, que por poco le hiciera dejar la
              comenzada empresa; y fue que le vino a la memoria que no era armado
              caballero, y que, conforme a ley de caballería, ni podía ni debía tomar
              armas con ningún caballero; y puesto que lo fuera, había de llevar armas
              blancas, como novel caballero, sin empresa en el escudo, hasta que por
              su esfuerzo la ganase. Estos pensamientos le hicieron titubear en su
              propósito; mas pudiendo más su locura que otra razón alguna, propuso de
              hacerse armar caballero del primero que topase, a imitación de otros
              muchos que así lo hicieron, según él había leído en los libros que tal
              le tenían. En lo de las armas blancas, pensaba limpiarlas de manera, en
              teniendo lugar, que lo fuesen más que un arminio; y con esto se quietó18
              y prosiguió su camino, sin llevar otro que aquel que su caballo quería,
              creyendo que en aquello consistía la fuerza de las aventuras
            </Text>
            <Text :style="styles.text">
              Es, pues, de saber, que este sobredicho hidalgo, los ratos que estaba ocioso (que eran los
              más del año) se daba a leer libros de caballerías con tanta afición y gusto, que olvidó casi
              de todo punto el ejercicio de la caza, y aun la administración de su hacienda; y llegó a tanto
              su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura, para
              comprar libros de caballerías en que leer; y así llevó a su casa todos cuantos pudo haber
              dellos; y de todos ningunos le parecían tan bien como los que compuso el famoso Feliciano
              de Silva: porque la claridad de su prosa, y aquellas intrincadas razones suyas, le parecían
            </Text>
            <Text :style="styles.text">
              Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
              mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
              cuando salga a luz la verdadera historia de mis famosos hechos, que el
              sabio que los escribiere no ponga, cuando llegue a contar esta mi
              primera salida tan de mañana, desta manera?: Apenas había el rubicundo
              Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
              hebras de sus hermosos cabellos, y apenas los pequeños y pintados
              pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
              armonía la venida de la rosada Aurora, que, dejando la blanda cama del
              celoso marido, por las puertas y balcones del manchego horizonte a los
              mortales se mostraba, cuando el famoso caballero don Quijote de la
              Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
              Rocinante y comenzó a caminar por el antiguo y conocido Campo de
              Montiel.
            </Text>
            <Text :style="styles.text">
              Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
              mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
              cuando salga a luz la verdadera historia de mis famosos hechos, que el
              sabio que los escribiere no ponga, cuando llegue a contar esta mi
              primera salida tan de mañana, desta manera?: Apenas había el rubicundo
              Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
              hebras de sus hermosos cabellos, y apenas los pequeños y pintados
              pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
              armonía la venida de la rosada Aurora, que, dejando la blanda cama del
              celoso marido, por las puertas y balcones del manchego horizonte a los
              mortales se mostraba, cuando el famoso caballero don Quijote de la
              Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
              Rocinante y comenzó a caminar por el antiguo y conocido Campo de
              Montiel.
            </Text>
            <Text :style="styles.text">
              Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
              mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
              cuando salga a luz la verdadera historia de mis famosos hechos, que el
              sabio que los escribiere no ponga, cuando llegue a contar esta mi
              primera salida tan de mañana, desta manera?: Apenas había el rubicundo
              Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
              hebras de sus hermosos cabellos, y apenas los pequeños y pintados
              pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
              armonía la venida de la rosada Aurora, que, dejando la blanda cama del
              celoso marido, por las puertas y balcones del manchego horizonte a los
              mortales se mostraba, cuando el famoso caballero don Quijote de la
              Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
              Rocinante y comenzó a caminar por el antiguo y conocido Campo de
              Montiel.
            </Text>
            <Text :style="styles.text">
              Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
              mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
              cuando salga a luz la verdadera historia de mis famosos hechos, que el
              sabio que los escribiere no ponga, cuando llegue a contar esta mi
              primera salida tan de mañana, desta manera?: Apenas había el rubicundo
              Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
              hebras de sus hermosos cabellos, y apenas los pequeños y pintados
              pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
              armonía la venida de la rosada Aurora, que, dejando la blanda cama del
              celoso marido, por las puertas y balcones del manchego horizonte a los
              mortales se mostraba, cuando el famoso caballero don Quijote de la
              Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
              Rocinante y comenzó a caminar por el antiguo y conocido Campo de
              Montiel.
            </Text>
            <Text :style="styles.text">
              Yendo, pues, caminando nuestro flamante aventurero, iba hablando consigo
              mesmo, y diciendo: —¿Quién duda, sino que en los venideros tiempos,
              cuando salga a luz la verdadera historia de mis famosos hechos, que el
              sabio que los escribiere no ponga, cuando llegue a contar esta mi
              primera salida tan de mañana, desta manera?: Apenas había el rubicundo
              Apolo tendido por la faz de la ancha y espaciosa tierra las doradas
              hebras de sus hermosos cabellos, y apenas los pequeños y pintados
              pajarillos con sus arpadas lenguas habían saludado con dulce y meliflua
              armonía la venida de la rosada Aurora, que, dejando la blanda cama del
              celoso marido, por las puertas y balcones del manchego horizonte a los
              mortales se mostraba, cuando el famoso caballero don Quijote de la
              Mancha, dejando las ociosas plumas, subió sobre su famoso caballo
              Rocinante y comenzó a caminar por el antiguo y conocido Campo de
              Montiel.
            </Text>
          </Page>
        </template>
      </Document>
    </PDF>
  </div>
</div>
  
</template>
<script setup lang="ts">
import { defineOptions } from "vue";
import { PDF, Text, Page, Document, Image, Span } from "../components/Elements";
import {  StyleSheet } from "../components/tags";
import Caman from "~/components/Caman.vue";
import { usePDF } from "~/hook/usePDF";
defineOptions({
  components: {},
});
const { download } = usePDF();
const title = ref('Amir');
const sizePage = ref('A4');
const pageNames = [
  "A4",
  "Letter",
  "Legal",
  "Tabloid",
  "Carta",
  "Oficio"
];

const styles = StyleSheet.create({
  body: {
    paddingTop: '35px',
    paddingLeft: '60px',
    paddingRight: '60px',
    paddingBottom: '65px',
  },
  title: {
    fontSize: '24px',
    paddingTop: '12px',
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: '18px',
    marginTop: '12px',
    marginBottom: '22px',
    fontFamily: 'Oswald'
  },
  text: {
    marginBottom: '12px',
    marginTop: '12px',
    fontSize: '16px',
    textAlign: "justify",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    with: '200px',
    height: '200px',
    textAlign: "center",
  },
  header: {
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
</script>
