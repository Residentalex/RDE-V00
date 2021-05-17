export interface Add {
    idAdd?: string,
    idPerson?: string,
    idService?: string,
    idTasker?: string,
    price?: Number,
    title?: string,
    location?: {
        latitude: number,
        longitude: number
    },
    details?: string,
    addPhotos?: any,
    createdAt?: any,
    status?: boolean,
    modifyAt?: any
}
