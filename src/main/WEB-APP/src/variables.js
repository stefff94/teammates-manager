export const roles = [
    {id: "R1", name: "Student"},
    {id: "R2", name: "Frontend developer"},
    {id: "R3", name: "Backend developer"},
    {id: "R4", name: "Full Stack developer"},
    {id: "R5", name: "Analyst Programmer"},
]

export const genders = [
    {id: "M", name: "Male"},
    {id: "F", name: "Female"}
]

export const avatars = {
    M: [
        "/images/avatar/large/elliot.jpg",
        "/images/avatar/large/steve.jpg",
        "/images/avatar2/large/matthew.png"
    ],
    F: [
        "/images/avatar/large/stevie.jpg",
        "/images/avatar2/large/molly.png",
        "/images/avatar2/large/elyse.png"
    ]
}

export const rules = [
    { property: "name", reg: /^([^0-9]*)$/ },
    { property: "city", reg: /^([^0-9]*)$/ },
    { property: "email", reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ }
]

export const avatarBaseUrl = "https://semantic-ui.com";
