declare module "Register" {
    type Register = {
        name: string
        email: string
        password: string
    }
}

declare module "SignIn" {
    type SignIn = {
        email: string
        password: string
    }
}