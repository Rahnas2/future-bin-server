export class InvalidCredentialsError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidCredentialsError';
    }
}

export class BlockedUserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BlockedUserError';
    }
}

export class conflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'conflictError';
    }
}

export class notFound extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'notFound'
    }
}

export class unAuthorized extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'unAuthorized'
    }
}

export class Forbidden extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'Forbidden'
    }
}

export class DatabaseError extends Error {
    constructor(message: string){
        super(message)
        this.name = 'DatabaseError'  
    }
}