interface Stadium {
    id: string
    name: string
    "stadium_id": string
    "stadium_item_id": string
    "price_status": string
}

declare const stadiums: Stadium[]
declare const dates: string[]

interface Item {
    date_start: string
    is_check: 1 | 2
    price: string
    time_end: string
    time_start: string
}

declare let data: Item[]
