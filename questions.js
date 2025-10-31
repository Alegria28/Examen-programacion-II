const { text } = require("express");

// Banco de 16 preguntas de opción múltiple
module.exports = [
  {
    id: 1,
    text: "¿Qué es objeto en java?",
    options: ["Es un conjunto de declaraciones de funciones", "Es una agrupación que termina una cadena de herencia", "Es una agrupación de datos y de funciones", "Es conjunto de variables y funciones relacionadas con esas variables"],
    correct: "Es conjunto de variables y funciones relacionadas con esas variables"
  },
  {
    id: 2,
    text: "¿Qué es una clase en java?",
    options: ["Es un conjunto de declaraciones de funciones", "Es una agrupación que termina una cadena de herencia.", "Es una agrupación de datos y de funciones", "Es conjunto de variables y funciones relacionadas con esas variables"],
    correct: "Es una agrupación de datos y de funciones"
  },
  {
    id: 3,
    text: "¿Para qué se utiliza la clase abstract",
    options: ["Para poder ser accesibles en otras clases", "Para acceder desde otros paquetes", "Para la clase base para la herencia", "Para ser una súper clase"],
    correct: "Para la clase base para la herencia"
  },
  {
    id: 4,
    text: "¿Cómo se especifica las clases que tienen una súper clase?",
    options: ["Interface","implements", "Extends", "Object"],
    correct: "Extends"
  },
  {
    id: 5,
    text: "¿Qué es una interface?",
    options: ["Una súper clase", "Es un conjunto de declaraciones de funciones", "Una herencia múltiple", "Un fichero public"],
    correct: "Es un conjunto de declaraciones de funciones"
  },
  {
    id: 6,
    text: "Menciona los tres modificadores de acceso",
    options: ["Static, final, private","Clase, static, public", "Public, private, protected", "Class, final, static"],
    correct: "Public, private, protected"
  },
  {
    id: 7,
    text: "¿Cuál de estas son palabras reservadas de java?",
    options: ["cast future generic","continue for Boolean","default goto null","Implements Public Extends"],
    correct: "cast future generic"
  },
  {
    id: 8,
    text:"¿Cuáles son las variables de objeto en Java?",
    options: ["Es un conjunto de declaraciones de funciones", "Encapsulamiento y herencia", "Es una agrupación de datos y de funciones", "Implements Public Extends"],
    correct: "Encapsulamiento y herencia"
  },
  {
    id: 9,
    text: "¿Cómo se declara una clase final?",
    options: ["final class MiClase {}", "class final MiClase {}", "MiClase final class {}", "class MiClase final {}"],
    correct: "final class MiClase {}"
  },
  {
    id: 10,
    text: "¿Cómo se llama la clase que termina una cadena de herencia?",
    oprions: ["Public", "Abstract", "Public", "final"],
    correct: "final"
  },
  {
    id: 12,
    text: "¿Cómo se debe llamar el fichero con extensión .java?",
    options: [ "El fichero se debe llamar como atributo", "El fichero se debe llamar como la clase interface", "El fichero se debe llamar como la clase object", "El fichero de debe llamar como la clase public"],
    correct: "El fichero de debe llamar como la clase public"
  },
  {
    id: 11,
    text: "¿Qué palabra reservada se utiliza para heredar una clase?",
    options: ["implements", "extends", "inherit", "super"],
    correct: "extends"  
  },
  {
    id: 13,
    text: "¿Qué palabra reservada se utiliza para implementar una interface?",
    options: ["extends", "implements", "inherit", "super"], 
    correct: "implements"
  },
  {
    id: 14,
    text: "¿Qué es un atributo?",
    options: ["Es el comportamiento de los métodos", " Es la instaciación", " Es la implementacion", "Son las características de las clases"],
    correct: "Son las características de las clases"
  },
  {
    id: 15,
    text: "¿Qué es una sobrecarga de métodos?",
    options: ["Permiten declarar métodos que se llaman igual pero reciben parámetros iguales", "Permiten declarar métodos que se llaman igual pero reciben diferentes parámetros", "Permiten declarar atributos que se llaman igual", " Permiten declarar parámetros"],
    correct: "Permiten declarar métodos que se llaman igual pero reciben diferentes parámetros"
  },
  {
    id: 16,
    text: "¿Qué es el encapsulamiento?",
    options: ["Es un mecanismo que permite ocultar los datos de un objeto", "Es un mecanismo que permite heredar los datos de un objeto", "Es un mecanismo que permite implementar los datos de un objeto", "Es un mecanismo que permite instanciar los datos de un objeto"],
    correct: "Es un mecanismo que permite ocultar los datos de un objeto"
  }
];