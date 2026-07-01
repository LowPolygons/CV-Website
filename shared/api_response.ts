export type ApiResponse<T> = {
    status: number
    // ? means optional
    content?: T 
    error?: string
}
export function Err<T>(code: number, error: string): ApiResponse<T> {
    return {
        status: code,
        error: error,
    }
}

export function Ok<T>(content: T): ApiResponse<T> {
    return { status: 200, content: content }
}