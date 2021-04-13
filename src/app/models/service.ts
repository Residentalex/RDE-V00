export interface Service {
    idService: string,
    serviceName: string,
    description?: string,
    createAt: Date,
    modifyAt?: Date,
    status: boolean
}
