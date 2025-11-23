export function formMemberSince(dataString){
    const date = new Date(dataString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `Member since ${month} ${year}`;
}

export function formatPublishDate(dataString){
    const date = new Date(dataString);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    return `Published on ${month} ${day}, ${year}`;
}