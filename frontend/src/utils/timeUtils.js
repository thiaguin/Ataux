export const getDefaultTime = (date) => {
    const time = new Date(date);
    const year = time.getFullYear();
    const day = time.getDate();
    const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
    const minute = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    const month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;

    return {
        time: `${hours}:${minute}`,
        date: `${year}-${month}-${day}`,
    };
};

export const showTime = (value) => {
    const date = new Date(value);
    const day = date.toLocaleDateString('pt-BR');
    const time = date.toLocaleTimeString('pt-BR');

    return `${day} - ${time}`;
};

export const showAcceptedTime = (value) => {
    const date = new Date(value);
    const day = date.toLocaleDateString('pt-BR');
    const hour = date.getHours();

    return `${day} - ${hour}h`;
};
