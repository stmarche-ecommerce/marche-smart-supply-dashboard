export function getGreetingMessage() {
  const timeOfDay = greetingMessage();
  const day = new Date().getDay();
  const message = new Array();
  message[0] = `${timeOfDay} tenha um bom domingo`;
  message[1] = `${timeOfDay} tenha uma boa segunda-feira`;
  message[2] = `${timeOfDay} tenha uma boa terça-feira`;
  message[3] = `${timeOfDay} tenha uma boa quarta-feira`;
  message[4] = `${timeOfDay} tenha uma boa quinta-feira`;
  message[5] = `${timeOfDay} Hoje também é dia de trabalho, mas pelo menos é final de semana`;
  message[6] = `${timeOfDay} tenha um bom sábado`;

  return message[day];
}

const greetingMessage = () => {
  let h = Number(
    new Date().toLocaleTimeString("pt-BR", { hour: "numeric", hour12: false })
  );
  if (h >= 0 && h <= 5) {
    return "🌚 Boa madrugada!";
  } else if (h >= 6 && h < 12) {
    return "☀ Bom dia!";
  } else if (h >= 12 && h < 18) {
    return "☀ Boa tarde!";
  } else if (h >= 18 && h <= 23) {
    return "🌚 Boa noite!";
  }
};
